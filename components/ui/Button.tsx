'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { type LucideIcon } from './icons';

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  selected?: boolean;
  children?: ReactNode;
}

const SIZE_STYLES: Record<Size, { padding: string; text: string; iconSize: number; gap: string }> = {
  sm: { padding: 'px-2.5 py-1', text: 'text-xs',  iconSize: 14, gap: 'gap-1.5' },
  md: { padding: 'px-3.5 py-2', text: 'text-sm',  iconSize: 16, gap: 'gap-2' },
  lg: { padding: 'px-5 py-3',   text: 'text-base', iconSize: 18, gap: 'gap-2' },
};

const VARIANT_STYLES: Record<Variant, { base: string; hover: string; selected: string }> = {
  primary: {
    base: 'bg-[color:var(--accent)]/15 border border-[color:var(--accent-border-strong)] text-[color:var(--accent-soft)] shadow-[var(--glow-accent)]',
    hover: 'hover:bg-[color:var(--accent)]/25',
    selected: 'bg-[color:var(--accent)]/30 text-white',
  },
  secondary: {
    base: 'bg-transparent border border-[color:var(--accent-border)] text-[color:var(--accent-soft)]',
    hover: 'hover:bg-[color:var(--accent)]/10 hover:border-[color:var(--accent-border-strong)]',
    selected: 'bg-[color:var(--accent)]/15 border-[color:var(--accent-border-strong)] text-white',
  },
  ghost: {
    base: 'bg-transparent border border-transparent text-[color:var(--text-secondary)]',
    hover: 'hover:text-white hover:bg-white/5',
    selected: 'bg-white/10 text-white',
  },
  success: {
    base: 'bg-[color:var(--success)]/12 border border-[color:var(--success)]/50 text-[color:var(--success)]',
    hover: 'hover:bg-[color:var(--success)]/20',
    selected: 'bg-[color:var(--success)]/25 text-white',
  },
  warning: {
    base: 'bg-[color:var(--warning)]/12 border border-[color:var(--warning)]/50 text-[color:var(--warning)]',
    hover: 'hover:bg-[color:var(--warning)]/20',
    selected: 'bg-[color:var(--warning)]/25 text-white',
  },
  danger: {
    base: 'bg-[color:var(--danger)]/12 border border-[color:var(--danger)]/50 text-[color:var(--danger)]',
    hover: 'hover:bg-[color:var(--danger)]/20',
    selected: 'bg-[color:var(--danger)]/25 text-white',
  },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  selected = false,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}: Props) {
  const s = SIZE_STYLES[size];
  const v = VARIANT_STYLES[variant];
  const cls = [
    'inline-flex items-center justify-center rounded-[var(--radius)]',
    'uppercase tracking-wider transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed pointer-events-auto',
    s.padding,
    s.text,
    s.gap,
    selected ? v.selected : v.base,
    !disabled && v.hover,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconEl = Icon ? <Icon size={s.iconSize} strokeWidth={2} aria-hidden /> : null;

  return (
    <button
      type={type}
      disabled={disabled}
      className={cls}
      style={{ fontFamily: 'var(--font-aldrich)' }}
      {...rest}
    >
      {iconEl && iconPosition === 'left' && iconEl}
      {children}
      {iconEl && iconPosition === 'right' && iconEl}
    </button>
  );
}
