import { TsuruScene, type TsuruSceneHandle } from "@/components/TsuruScene";
import { forwardRef } from "react";
import { monthlyConfig } from "@/config/monthly";

type Props = {
  color: string;
  baseCount: number;
  sceneRef: React.RefObject<TsuruSceneHandle | null>;
  total: number;
  goal: number;
};

export const BoxScene = forwardRef<HTMLDivElement, Props>(
  ({ color, baseCount, sceneRef, total, goal }, ref) => {
    const boxColor = monthlyConfig.boxColor;
    return (
      <div ref={ref} className="relative h-[45vh] w-full max-w-[min(90vw,360px)] sm:h-[60vh] sm:max-w-md">
        {/* SVG da caixa */}
        <svg
          viewBox="0 0 400 460"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          style={{ filter: "drop-shadow(0 25px 35px rgba(40,30,10,0.25))" }}
        >
          <defs>
            <linearGradient id="boxFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={boxColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={boxColor} stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="boxBackSide" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={boxColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={boxColor} stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="boxLeft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={boxColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={boxColor} stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="boxRight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={boxColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={boxColor} stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="boxInside" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={boxColor} stopOpacity="0.1" />
              <stop offset="100%" stopColor={boxColor} stopOpacity="0.05" />
            </linearGradient>

            <linearGradient id="boxBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={boxColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={boxColor} stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* interior */}
          <polygon points="52,75 348,75 348,418 52,418" fill="url(#boxBackSide)" />
          <polygon points="32,55 368,55 368,425 32,425" fill="url(#boxInside)" />
          <polygon points="32,55 368,55 348,75 52,75" fill="url(#boxBack)" opacity="0.9" />

          <polygon points="32,55 52,75 52,418 32,425" fill={boxColor} opacity="0.2" />
          <polygon points="368,55 348,75 348,418 368,425" fill={boxColor} opacity="0.2" />

          {/* bordas */}
          <polygon points="20,50 380,50 368,60 32,60" fill={boxColor} opacity="0.6" />
          <polygon points="20,50 32,60 32,425 20,440" fill="url(#boxLeft)" />
          <polygon points="380,50 368,60 368,425 380,440" fill="url(#boxRight)" />

          <polygon points="32,425 368,425 380,440 20,440" fill="url(#boxFront)" />

          <line x1="32" y1="425" x2="368" y2="425" stroke={boxColor} strokeWidth="1.2" opacity="0.3" />
          <line x1="20" y1="50" x2="380" y2="50" stroke={boxColor} strokeWidth="1.5" opacity="0.4" />
        </svg>

        {/* tsurus */}
        <TsuruScene
          ref={sceneRef}
          color={color}
          baseCount={baseCount}
        />
      </div>
    );
  }
);

BoxScene.displayName = "BoxScene";