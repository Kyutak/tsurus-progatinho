import { monthlyConfig } from "@/config/monthly";
import { motion, AnimatePresence } from "framer-motion";

const { monthlyMessage } = monthlyConfig;

type Props = {
  open: boolean;
  trackId: string;
  inline?: boolean;
  monthlyMessage?: string;
};

export function SpotifyEmbed({ open, trackId, inline = false }: Props) {
  if (inline) {
    return open ? (
      <div className="w-full max-w-xs mx-auto mb-4 overflow-hidden rounded-2xl shadow-2xl">
        <iframe
          title="Música do mês"
          src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
          className="
            w-[min(92vw,340px)]
            mx-auto mt-6
            overflow-hidden rounded-2xl shadow-2xl

            relative

            sm:fixed sm:right-3 sm:top-1/2 sm:-translate-y-1/2 sm:mx-0
          "
        >
          <div className="flex flex-col">
            <iframe
              title="Música do mês"
              src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />

            <div className="mt-3 w-full max-w-xl rounded-3xl border border-white/15 bg-white/10 px-5 py-4 text-center text-sm text-white/90 shadow-xl backdrop-blur-xl">
              {monthlyMessage}
            </div>
          </div>
        </motion.div>
        
      )}
    </AnimatePresence>
  );
}