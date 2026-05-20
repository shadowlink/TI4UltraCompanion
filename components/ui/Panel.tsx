import { type ReactNode, type HTMLAttributes } from 'react';

type PanelVariant = 'surface' | 'elevated' | 'accent' | 'subtle';

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: PanelVariant;
  children: ReactNode;
}

const VARIANT_STYLES: Record<PanelVariant, string> = {
  surface:
    'bg-[var(--bg-surface)] border border-[color:var(--accent-border)]',
  elevated:
    'bg-[var(--bg-elevated)] border border-[color:var(--accent-border)] shadow-[var(--elevation-2)]',
  accent:
    'bg-[color:var(--accent)]/8 border border-[color:var(--accent-border-strong)] shadow-[var(--glow-accent)]',
  subtle:
    'bg-[var(--bg-surface)] border border-white/8',
};

/**
 * Base card / panel. Use `variant="accent"` for highlighted callouts,
 * `elevated` for modals & popovers, `surface` for default cards,
 * `subtle` for low-emphasis containers (e.g. info blocks).
 */
export default function Panel({ variant = 'surface', className = '', children, ...rest }: Props) {
  return (
    <div
      className={`rounded-[var(--radius)] ${VARIANT_STYLES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
