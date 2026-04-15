interface LotusIconProps {
  size?: number;
  className?: string;
}

export function LotusIcon({ size = 44, className = "" }: LotusIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 80"
      width={size}
      height={size * 0.8}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="lotus-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8891A" />
          <stop offset="45%" stopColor="#7B6114" />
          <stop offset="100%" stopColor="#5C4A0F" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#lotus-gold)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* Center petal — tallest, vertical */}
        <path d="M50 68 C44 52, 40 30, 50 6 C60 30, 56 52, 50 68Z" />
        {/* Inner-left petal */}
        <path d="M50 68 C42 54, 32 36, 36 12 C48 30, 52 52, 50 68Z" />
        {/* Inner-right petal */}
        <path d="M50 68 C48 52, 52 30, 64 12 C68 36, 58 54, 50 68Z" />
        {/* Outer-left petal */}
        <path d="M50 68 C40 56, 24 42, 22 18 C38 30, 48 50, 50 68Z" />
        {/* Outer-right petal */}
        <path d="M50 68 C52 50, 62 30, 78 18 C76 42, 60 56, 50 68Z" />
      </g>
    </svg>
  );
}
