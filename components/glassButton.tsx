interface GlassButtonProps {
  label: string;
  href: string;
}

export default function GlassButton({ label, href }: GlassButtonProps) {
  return (
    <div className="glass-btn-wrap">
      <button
        className="glass-btn"
        type="button"
        onClick={() => window.open(href, "_blank")}
      >
        <span>{label}</span>
      </button>
      <div className="glass-btn-shadow" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="100%"
        width="100%"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 0,
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern
            patternUnits="userSpaceOnUse"
            height="30"
            width="30"
            id={`dottedGrid-${label}`}
          >
            <circle fill="rgba(255,255,255,0.15)" r="1" cy="2" cx="2" />
          </pattern>
        </defs>
        <rect fill={`url(#dottedGrid-${label})`} height="100%" width="100%" />
      </svg>
    </div>
  );
}
