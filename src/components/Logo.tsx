import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  linkClassName?: string;
  variant?: "default" | "light";
}

const sizes = {
  sm: { width: 60, height: 40 },
  md: { width: 75, height: 50 },
  lg: { width: 100, height: 65 },
} as const;

export function Logo({ size = "md", linkClassName = "", variant = "default" }: LogoProps) {
  const s = sizes[size];
  const src = variant === "light" ? "/images/logo-white.png" : "/images/logo.png";
  return (
    <Link href="/" className={`group shrink-0 ${linkClassName}`}>
      <Image
        src={src}
        alt="Nilmani Ceylon Tours"
        width={s.width}
        height={s.height}
        className="object-contain transition-opacity duration-300 group-hover:opacity-80"
        priority
      />
    </Link>
  );
}
