export function Brand({
  size = 32,
  showWord = true,
  wordSize = "md",
}: {
  size?: number;
  showWord?: boolean;
  wordSize?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClass =
    wordSize === "xl" ? "text-5xl md:text-6xl"
    : wordSize === "lg" ? "text-3xl"
    : wordSize === "sm" ? "text-base"
    : "text-2xl";

  return (
    <span className="inline-flex items-center gap-3">
      <span
        className="relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-lg bg-white/5 border border-white/10 group"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative font-bold text-white text-[10px] sm:text-xs">M</div>
      </span>
      {showWord && (
        <span className={`huge-type !italic-none !tracking-tighter ${sizeClass} glossy-text leading-none pb-0.5 mt-0.5`}>
          MATRIXBOOK
        </span>
      )}
    </span>
  );
}