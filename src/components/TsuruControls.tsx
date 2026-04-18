import { Minus, Plus, ChevronsRight } from "lucide-react";

type Props = {
  color: string;
  reachedMonthly: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onSkip: () => void;
  disableRemove: boolean;
};

const baseBtn =
  "flex items-center justify-center rounded-full border border-white/10 backdrop-blur-md shadow-md transition active:scale-95";

export function TsuruControls({
  color,
  reachedMonthly,
  onAdd,
  onRemove,
  onSkip,
  disableRemove,
}: Props) {
  return (
    <div className="mt-6 flex items-center gap-3">
      {/* REMOVE */}
      <button
        onClick={onRemove}
        disabled={disableRemove}
        className={`${baseBtn} h-12 w-12 bg-white/10 hover:bg-white/20 disabled:opacity-40`}
      >
        <Minus className="h-5 w-5 text-white/80" />
      </button>

      {/* ADD */}
      <button
        onClick={onAdd}
        disabled={reachedMonthly}
        className={`${baseBtn} h-16 w-16 text-white disabled:opacity-70`}
        style={{
          background: `linear-gradient(135deg, ${color}cc, ${color}88)`,
          boxShadow: `0 10px 30px -10px ${color}40`,
        }}
      >
        <Plus className="h-7 w-7" />
      </button>

      {/* SKIP */}
      <button
        onClick={onSkip}
        disabled={reachedMonthly}
        className={`${baseBtn} h-12 w-12 bg-white/10 hover:bg-white/20 disabled:opacity-40`}
      >
        <ChevronsRight className="h-5 w-5 text-white/80" />
      </button>
    </div>
  );
}