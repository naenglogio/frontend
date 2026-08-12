interface FridgeIllustrationProps {
  className?: string;
}

export function FridgeIllustration({ className = '' }: FridgeIllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="50"
        y="30"
        width="100"
        height="150"
        rx="18"
        fill="white"
        fillOpacity="0.15"
        stroke="white"
        strokeWidth="4"
      />
      <line x1="50" y1="75" x2="150" y2="75" stroke="white" strokeWidth="4" />
      <rect x="122" y="45" width="6" height="20" rx="3" fill="white" />
      <rect x="122" y="95" width="6" height="30" rx="3" fill="white" />
      <circle cx="85" cy="122" r="4" fill="white" />
      <circle cx="105" cy="122" r="4" fill="white" />
      <path
        d="M85 136 Q95 143 105 136"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g transform="translate(38,2) rotate(-12)">
        <path d="M0 22 L15 22 L7.5 48 Z" fill="#FFC49B" />
        <path
          d="M2 22 Q4 9 0 2 M7.5 22 Q7.5 7 7.5 0 M13 22 Q11 9 15 2"
          stroke="#9FD88C"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M128 8 Q142 -12 158 12 Q144 26 128 20 Z"
        fill="#9FD88C"
        transform="translate(0,4)"
      />
    </svg>
  );
}
