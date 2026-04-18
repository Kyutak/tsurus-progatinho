import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useMemo } from "react";

type Props = {
  color: string;
  count?: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function MonthlyHearts({ color, count = 18 }: Props) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        initialX: Math.random() * 260 - 130,
        initialY: Math.random() * 40 + 10,
        finalX: Math.random() * 360 - 180,
        finalY: Math.random() * -220 - 80,
        delay: i * 0.05,
        size: clamp(16 + Math.random() * 10, 16, 24),
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ opacity: 0, scale: 0, x: heart.initialX, y: heart.initialY }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.1, 0.6], x: heart.finalX, y: heart.finalY }}
          transition={{ delay: heart.delay, duration: 1.4, ease: "easeOut" }}
          className="absolute"
          style={{ left: "50%", top: "50%", color }}
        >
          <Heart className="block" fill="currentColor" style={{ width: heart.size, height: heart.size }} />
        </motion.div>
      ))}
    </div>
  );
}
