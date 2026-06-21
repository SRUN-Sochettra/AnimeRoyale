export default function EggLogo({ size = 80, animated = false }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 90 104" aria-hidden="true" className={animated ? "animate-wobble" : undefined}>
      <ellipse cx="45" cy="54" rx="31" ry="41" fill="#FCE9B8" stroke="#2E2416" strokeWidth="4" />
      <path d="M28 50L36 58L45 47L54 59L63 49" fill="none" stroke="#C84A2E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="38" r="2" fill="#B89968" />
      <circle cx="56" cy="42" r="1.8" fill="#B89968" />
      <circle cx="49" cy="72" r="2" fill="#B89968" />
    </svg>
  );
}
