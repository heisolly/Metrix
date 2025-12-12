import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizeMap = {
  sm: { width: 40, height: 40, text: "text-lg" },
  md: { width: 56, height: 56, text: "text-2xl" },
  lg: { width: 72, height: 72, text: "text-3xl" },
  xl: { width: 96, height: 96, text: "text-4xl" },
};

export default function Logo({
  size = "md",
  showText = true,
  href = "/",
  className = "",
}: LogoProps) {
  const { width, height, text } = sizeMap[size];

  const logoContent = (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div
        className="relative flex-shrink-0"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Image
          src="/logo.png"
          alt="Metrix Gaming Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span className={`font-black text-white tracking-tight ${text}`}>
          Metrix
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
