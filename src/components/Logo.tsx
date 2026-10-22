import { withBase } from "@/lib/base";

export function Logo({
  size = 44,
  className = "",
  alt = "VZW De Toekomst",
}: {
  size?: number;
  className?: string;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBase("/logo.jpg")}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
