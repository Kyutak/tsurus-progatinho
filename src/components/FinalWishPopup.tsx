import { motion, AnimatePresence } from "framer-motion";
import { Crane3D } from "./Crane3D";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  color: string;
  wishText: string;
};

export function FinalWishPopup({ open, onClose, color, wishText }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          {/* Cartinha */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.4, rotateX: -90, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotateX: -60, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1200 }}
            className="relative w-full max-w-2xl"
          >
            <div
              className="relative overflow-hidden rounded-2xl border-2 bg-[var(--paper)] p-8 shadow-2xl sm:p-12"
              style={{ borderColor: color }}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-white/80 p-1.5 text-foreground/60 transition hover:text-foreground"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mx-auto mb-6 h-40 w-40"
              >
                <Crane3D color={color} />
              </motion.div>

              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
                className="space-y-4 text-center"
              >
                <h2
                  className="font-display text-3xl italic sm:text-4xl"
                  style= {{ color }}
                >
                  Mil tsurus, um desejo
                </h2>
                <div
                  className="whitespace-pre-wrap font-display text-lg leading-relaxed text-foreground/85 sm:text-xl"
                >
                  {wishText}
                </div>
              </motion.div>

              {/* Detalhe decorativo de cantos */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 60%)`,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
