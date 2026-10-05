export function Logo({
  className = "",
  white = false,
}: {
  className?: string;
  white?: boolean;
}) {
  return (
    <img
      className={`logo ${className}`}
      src={`/brand/azuria-logo${white ? "-branca" : "-azul"}.svg`}
      width="875"
      height="210"
      alt="Azuria"
    />
  );
}
