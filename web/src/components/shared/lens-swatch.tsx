import { cn } from "@/lib/utils";

/**
 * Placeholder lens visual: tinted gradient body with a circular lens ring,
 * glass highlight and a soft bottom shadow.
 */
export function LensSwatch({
  colorFrom,
  colorTo,
  className,
  round = false,
}: {
  colorFrom: string;
  colorTo: string;
  className?: string;
  round?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-border",
        round ? "rounded-full" : "rounded-2xl",
        className
      )}
      style={{ background: `linear-gradient(140deg, ${colorFrom}, ${colorTo})` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 24% 4%, rgb(255 255 255 / 0.5) 0%, rgb(255 255 255 / 0) 52%)",
        }}
      />
      {/* lens ring */}
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          border: "1px solid rgb(255 255 255 / 0.4)",
          boxShadow:
            "inset 0 8px 18px rgb(255 255 255 / 0.28), inset 0 -8px 18px rgb(0 0 0 / 0.22)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "linear-gradient(to top, rgb(0 0 0 / 0.35), transparent)" }}
      />
    </div>
  );
}
