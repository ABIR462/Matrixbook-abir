import logo from "@/assets/logo.png";

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
        className="relative inline-flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <img src={logo} alt="MATRIXBOOK" width={size} height={size} className="relative object-contain" />
      </span>
      {showWord && (
        <span className={`huge-type !italic-none !tracking-tighter ${sizeClass} glossy-text leading-none pb-0.5 mt-0.5`}>
          MATRIXBOOK
        </span>
      )}
    </span>
  );
}