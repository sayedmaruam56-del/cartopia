import { BRAND } from "../lib/brand";

function Mark() {
  return (
    <svg
      width="46"
      height="46"
      viewBox="0 0 48 48"
      fill="none"
      className="drop-shadow-[0_0_10px_rgba(139,92,246,0.8)] transition-transform duration-500 group-hover:scale-110"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cartopia-grad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ddd6fe" />
          <stop offset="0.5" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#5b21b6" />
        </linearGradient>
      </defs>

      {/* حلقة الكوكب المائلة */}
      <g transform="rotate(-25 24 24)">
        <ellipse cx="24" cy="24" rx="22" ry="7" stroke="#c4b5fd" strokeOpacity="0.45" strokeWidth="1" />
        <circle r="2.6" fill="#fff">
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            path="M 2 24 a 22 7 0 1 0 44 0 a 22 7 0 1 0 -44 0"
          />
        </circle>
      </g>

      {/* حرف C على شكل مدار */}
      <g className="logo-c">
        <circle
          cx="24"
          cy="24"
          r="15"
          stroke="url(#cartopia-grad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeDasharray="70 100"
          transform="rotate(46 24 24)"
        />
      </g>

      {/* نجمة في المركز */}
      <path
        className="animate-pulse"
        d="M24 15 L26.2 21.8 L33 24 L26.2 26.2 L24 33 L21.8 26.2 L15 24 L21.8 21.8 Z"
        fill="#fff"
      />
    </svg>
  );
}

export default function Logo() {
  return (
    <>
      <Mark />
      <span className="text-2xl font-extrabold tracking-tight leading-none" aria-label={BRAND.name}>
        {BRAND.name.split("").map((ch, i) =>
          ch.toLowerCase() === "o" ? (
            <span key={i} className="logo-o" style={{ "--i": i }}>
              <span className="logo-o-orbit" />
            </span>
          ) : (
            <span key={i} className="logo-letter" style={{ "--i": i }}>
              {ch}
            </span>
          )
        )}
      </span>
    </>
  );
}