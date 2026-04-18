import { motion, AnimatePresence } from "framer-motion";
import { Crane3D } from "./Crane3D";
import { X } from "lucide-react";
import { useState } from "react";
import { MonthlyHearts } from "./MonthlyHearts";
import { SpotifyEmbed } from "./SpotifyEmbed";

type Props = {
  open: boolean;
  onClose: () => void;
  color: string;
  tsuruColor: string;
  message: string;
  trackId: string;
};

export function MonthlyPopup({ open, onClose, color, tsuruColor, message, trackId }: Props) {
  const [showCanvas, setShowCanvas] = useState(false);

  const hearts = Array.from({ length: 10 }, (_, i) => i);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationStart={() => setShowCanvas(false)}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            onAnimationComplete={() => setShowCanvas(true)}
            className="relative flex w-[min(92vw,420px)] flex-col items-center gap-3 px-6 py-6 rounded-3xl
                       bg-gradient-to-b from-white/20 to-white/5
                       backdrop-blur-lg border border-white/20 shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full bg-white/60 p-1 text-foreground/60 backdrop-blur-sm transition hover:bg-white/90 hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="h-56 w-56 sm:h-64 sm:w-64 -mb-2">
              {showCanvas && <Crane3D color={tsuruColor} />}
            </div>

            {/* Spotify Embed */}

            <p
              className="text-center font-display text-xl italic leading-snug sm:text-2xl"
              style={{ color }}
            >
              {message}
            </p>

            <SpotifyEmbed open={open} trackId={trackId} inline={true} />

            <div className="absolute inset-0 pointer-events-none">
              <MonthlyHearts color={color} count={22} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}