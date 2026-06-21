export default function FloatingEgg({ className, size, delay, opacity }) {
  return (
    <div className={className} style={{ opacity }}>
      <svg width={size} height={size * 1.2} viewBox="0 0 80 96" className="animate-float" style={{ animationDelay: `${delay}s` }} aria-hidden="true">
        <ellipse cx="40" cy="52" rx="28" ry="36" fill="#FCE9B8" stroke="#2E2416" strokeWidth="3" />
        <circle cx="28" cy="42" r="1.5" fill="#B89968" />
        <circle cx="50" cy="46" r="1.2" fill="#B89968" />
        <circle cx="44" cy="68" r="1.5" fill="#B89968" />
      </svg>
    </div>
  );
}
