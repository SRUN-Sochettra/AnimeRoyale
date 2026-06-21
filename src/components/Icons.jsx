const baseProps = {
  fill: 'none',
  stroke: '#2E2416',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconMagnifier({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="14" cy="14" r="8" fill="#FCE9B8" {...baseProps} />
      <line x1="20" y1="20" x2="26" y2="26" {...baseProps} />
      <circle cx="12" cy="12" r="2" fill="#FFFDF7" stroke="none" />
    </svg>
  )
}

export function IconBrokenEgg({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M 20 8 L 25 18 L 22 24 L 28 22 L 32 30 L 38 24 L 44 28 Q 48 16 32 6 Q 24 6 20 8 Z"
        fill="#FCE9B8"
        {...baseProps}
      />
      <path
        d="M 14 32 Q 12 56 32 58 Q 52 56 50 32 L 44 36 L 38 30 L 32 36 L 26 30 L 20 36 Z"
        fill="#FCE9B8"
        {...baseProps}
      />
    </svg>
  )
}

export function IconSparkle({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M 16 4 L 18 14 L 28 16 L 18 18 L 16 28 L 14 18 L 4 16 L 14 14 Z"
        fill="#F5B544"
        {...baseProps}
      />
      <circle cx="25" cy="7" r="1.5" fill="#F5B544" {...baseProps} />
      <circle cx="7" cy="25" r="1" fill="#F5B544" {...baseProps} />
    </svg>
  )
}

export function IconMegaphone({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M 5 18 L 10 18 L 22 24 L 22 8 L 10 14 L 5 14 Z" fill="#F5B544" {...baseProps} />
      <path d="M 10 18 L 12 26" {...baseProps} />
      <path d="M 25 12 Q 28 16 25 20" {...baseProps} />
    </svg>
  )
}

export function IconChart({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M 7 25 L 7 15" {...baseProps} />
      <path d="M 16 25 L 16 8" {...baseProps} />
      <path d="M 25 25 L 25 12" {...baseProps} />
    </svg>
  )
}
