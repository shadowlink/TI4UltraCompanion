'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from './icons';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** Tailwind max-width class, e.g. `max-w-md`, `max-w-xl`. Defaults to `max-w-md`. */
  maxWidth?: string;
  /** Hide the close button (rare — for blocking modals). */
  hideClose?: boolean;
  /** Disable backdrop-click and Esc dismissals. */
  blocking?: boolean;
  children: ReactNode;
}

/**
 * Shared modal shell. Backdrop + elevated panel + optional title bar with close button.
 * Closes on backdrop click and on Escape unless `blocking`.
 */
export default function Modal({
  open,
  onClose,
  title,
  maxWidth = 'max-w-md',
  hideClose = false,
  blocking = false,
  children,
}: Props) {
  useEffect(() => {
    if (!open || blocking) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, blocking, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay pointer-events-auto"
      onClick={() => { if (!blocking) onClose(); }}
    >
      <div
        className={`${maxWidth} w-[calc(100%-2rem)] rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[color:var(--accent-border)] shadow-[var(--elevation-2)] flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || !hideClose) && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-[color:var(--accent-border-faint)]">
            <h2
              className="text-sm uppercase tracking-wider text-[color:var(--accent-soft)]"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {title}
            </h2>
            {!hideClose && (
              <button
                onClick={onClose}
                className="text-[color:var(--text-muted)] hover:text-white pointer-events-auto p-1 -mr-1 transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} strokeWidth={2} />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
