import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Minus, ChevronsRight } from "lucide-react";
import { monthlyConfig } from "@/config/monthly";
import { finalWish } from "@/config/finalWish";
import { playFalling, playVanish } from "@/lib/sounds";
import { TsuruScene, type TsuruSceneHandle } from "@/components/TsuruScene";
import { MonthlyPopup } from "@/components/MonthlyPopup";
import { FinalWishPopup } from "@/components/FinalWishPopup";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { ShaderBackground } from "@/components/hero-shader";
import { BoxScene } from "@/components/BoxScene";
import { TsuruControls } from "@/components/TsuruControls";

const TOTAL_GOAL = 1000;

export default function App() {
  const [state, setState] = useState({
    total: 0,
    currentMonthCount: 0,
  });

  const sceneRef = useRef<TsuruSceneHandle>(null);
  const [showMonthly, setShowMonthly] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [showMonthlyMessageInline, setShowMonthlyMessageInline] = useState(false);

  const { monthlyLimit, monthName, Color, monthlyMessage, spotifyTrackId } = monthlyConfig;

  const effectiveLimit = monthlyLimit;
  const remainingThisMonth = Math.max(effectiveLimit - state.total, 0);

  const reachedMonthly = state.total >= effectiveLimit;
  const reachedFinal = state.total >= TOTAL_GOAL;

  const wasReachedRef = useRef({ monthly: false, final: false });

  useEffect(() => {
    if (reachedFinal && !wasReachedRef.current.final) {
      wasReachedRef.current.final = true;
      setShowFinal(true);
      setMusicOn(true);
    } else if (reachedMonthly && !wasReachedRef.current.monthly) {
      wasReachedRef.current.monthly = true;
      setShowMonthly(true);
      setMusicOn(true);
    }

    if (!reachedMonthly) wasReachedRef.current.monthly = false;
    if (!reachedFinal) wasReachedRef.current.final = false;
  }, [reachedMonthly, reachedFinal]);

  function handleAdd() {
    if (state.total >= effectiveLimit) return;

    playFalling();
    sceneRef.current?.addOne();

    setState((s) => ({
      total: Math.min(s.total + 1, TOTAL_GOAL),
      currentMonthCount: s.currentMonthCount + 1,
    }));
  }

  function handleRemove() {
    if (state.currentMonthCount <= 0) return;

    playVanish();
    sceneRef.current?.removeOne();

    setState((s) => ({
      total: s.total - 1,
      currentMonthCount: s.currentMonthCount - 1,
    }));
  }

  function handleSkipToLimit() {
    if (state.total >= effectiveLimit) return;

    const remaining = effectiveLimit - state.total;

    sceneRef.current?.fillToLimit(Math.min(effectiveLimit, 80));

    setState((s) => ({
      total: effectiveLimit,
      currentMonthCount: s.currentMonthCount + remaining,
    }));
  }

  const baseSilhouetteCount = 0;
  const colorAccent = useMemo(() => Color, [Color]);

  return (
    <div className="relative min-h-dvh w-full flex flex-col">
      <ShaderBackground>
        <header className="relative z-10 px-4 pt-6 text-center sm:pt-10">
          <h1 className="mt-1 font-display text-3xl italic leading-tight sm:text-5xl text-white">
            Mil tsurus, <span style={{ color: colorAccent }}>pra meu risonho</span>
          </h1>
        </header>

        <main className="relative z-10 mx-auto mt-4 flex w-full max-w-xl flex-col items-center px-4 sm:mt-6">
          <div className="mb-3 flex w-full items-end justify-between gap-4 px-2"></div>

          <div className="mb-6 mt-6 w-full max-w-md">
            <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
              <div className="text-center font-display text-white/80">
                <div className="text-4xl sm:text-5xl tracking-wider">
                  {state.total} / {TOTAL_GOAL}
                </div>
              </div>
            </div>

            <div className="relative">
              <BoxScene
                color={colorAccent}
                baseCount={baseSilhouetteCount}
                sceneRef={sceneRef}
                total={state.total}
                goal={TOTAL_GOAL}
              />

              <div className="pointer-events-none absolute -right-2 bottom-2 rounded-3xl border border-white/15 bg-black/10 px-3 py-2 text-xs uppercase tracking-[0.24em] text-white/80 shadow-2xl backdrop-blur-xl sm:text-sm">
                <div className="text-left">
                  <div className="font-display text-xs uppercase tracking-widest text-white/70">
                    {monthName}
                  </div>
                  <div className="font-display text-3xl tabular-nums sm:text-4xl" style={{ color: colorAccent }}>
                    {state.currentMonthCount}
                    <span className="text-base text-white/70"> / ?</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TsuruControls
            color={colorAccent}
            reachedMonthly={reachedMonthly}
            disableRemove={state.currentMonthCount <= 0}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onSkip={handleSkipToLimit}
          />
          <div className="mt-6 w-full flex justify-center">
            <div className="h-px w-40 bg-white/20" />
          </div>

          <SpotifyEmbed
            open={musicOn && !(showMonthly || showFinal)}
            trackId={spotifyTrackId}
          />

          <div className="mt-6 w-full flex justify-center">
            <div className="h-px w-40 bg-white/20" />
          </div>
          <div className="block sm:hidden h-20 w-full bg-transparent"></div>
        </main>

        <MonthlyPopup
          open={showMonthly && !showFinal}
          onClose={() => {
            setShowMonthly(false);
            setShowMonthlyMessageInline(true);
          }}
          color={colorAccent}
          tsuruColor={monthlyConfig.tsuruColor}
          message={monthlyMessage}
          trackId={spotifyTrackId}
        />

        <FinalWishPopup
          open={showFinal}
          onClose={() => setShowFinal(false)}
          color={colorAccent}
          wishText={finalWish}
        />
      </ShaderBackground>
    </div>
  );
}
