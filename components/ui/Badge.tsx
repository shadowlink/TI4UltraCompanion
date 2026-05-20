import { type HTMLAttributes, type ReactNode } from 'react';

type Tone = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'custom';
type Size = 'xs' | 'sm';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: Size;
  /** Filled background vs outline. Defaults to outline. */
  filled?: boolean;
  /** For `tone="custom"`, pass an arbitrary hex color. */
  color?: string;
  children: ReactNode;
}

const TONE_VARS: Record<Exclude<Tone, 'custom'>, string> = {
  accent:  'var(--accent)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger:  'var(--danger)',
  info:    'var(--info)',
  neutral: '#9ca3af',
};

const SIZE_STYLES: Record<Size, string> = {
  xs: 'text-[9px] px-1 py-px',
  sm: 'text-[10px] px-1.5 py-0.5',
};

/**
 * Inline tag: tech level, expansion, faction marker, exhausted state, etc.
 * Pass `filled` for solid background (used for L1/L2/L3 chips).
 */
export default function Badge({
  tone = 'neutral',
  size = 'sm',
  filled = false,
  color,
  className = '',
  children,
  ...rest
}: Props) {
  const hex = tone === 'custom' ? (color ?? '#9ca3af') : TONE_VARS[tone];
  const sizeCls = SIZE_STYLES[size];
  const baseCls = 'inline-flex items-center gap-1 leading-none uppercase tracking-wider rounded-[var(--radius-sm)] font-bold';

  const style = filled
    ? { background: hex, color: '#fff' }
    : { borderColor: `${hex}99`, color: hex, background: `${hex}15` };

  return (
    <span
      className={`${baseCls} ${sizeCls} ${filled ? '' : 'border'} ${className}`}
      style={{ ...style, fontFamily: 'var(--font-aldrich)' }}
      {...rest}
    >
      {children}
    </span>
  );
}
