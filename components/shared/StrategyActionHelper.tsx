'use client';

import { useState } from 'react';
import {
  getStrategyActionSteps,
  getStrategyActions,
  type QuickActionKind,
} from '@/data/strategyActions';
import { Check, Circle, Coins, Plus, RefreshCw, Trophy } from '@/components/ui/icons';
import { type LucideIcon } from '@/components/ui/icons';

interface Props {
  /** Nombre EN de la carta de estrategia (StrategyEntry.nameEn). */
  nameEn: string;
  variant: 'primary' | 'secondary';
  /** Aplica la acción rápida. El padre decide store directo vs sendCommand. */
  onQuickAction: (q: QuickActionKind) => void | Promise<void>;
  /** Para el botón de reponer Exportaciones: máximo y actual de la facción. */
  commodityMax?: number;
  currentCommodities?: number;
  /** Deshabilita todos los botones (p. ej. mientras hay un comando en vuelo). */
  disabled?: boolean;
  /** Estilo compacto para móvil. */
  compact?: boolean;
}

function quickIcon(kind: QuickActionKind['kind']): LucideIcon {
  switch (kind) {
    case 'tokens':
      return Plus;
    case 'tradeGoods':
    case 'commodities':
      return Coins;
    case 'replenishCommodities':
      return RefreshCw;
    case 'incrementVP':
      return Trophy;
  }
}

export default function StrategyActionHelper({
  nameEn,
  variant,
  onQuickAction,
  commodityMax,
  currentCommodities,
  disabled = false,
  compact = false,
}: Props) {
  // Estado local cosmético: pasos marcados y acciones rápidas ya aplicadas.
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [applied, setApplied] = useState<Record<number, boolean>>({});

  const steps = getStrategyActionSteps(nameEn)?.[variant];

  // Fallback: sin pasos estructurados, mostrar el texto plano de la chuleta.
  if (!steps || steps.length === 0) {
    const text = getStrategyActions(nameEn)?.[variant === 'primary' ? 'primaryEs' : 'secondaryEs'];
    if (!text) return null;
    return (
      <div className="rounded-[var(--radius)] border border-white/10 bg-[var(--bg-surface)] p-3">
        <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">{text}</p>
      </div>
    );
  }

  const handleQuick = async (idx: number, quick: NonNullable<typeof steps[number]['quick']>) => {
    if (disabled || applied[idx]) return;
    if (quick.confirm && typeof window !== 'undefined') {
      if (!window.confirm(`${quick.label}: ¿aplicar este efecto?`)) return;
    }
    // Marcar antes de await para evitar doble disparo por dobles toques rápidos.
    setApplied((m) => ({ ...m, [idx]: true }));
    setChecked((m) => ({ ...m, [idx]: true }));
    try {
      // `quick` incluye label/confirm además del QuickActionKind; el consumidor
      // discrimina por `kind` e ignora el resto.
      await onQuickAction(quick);
    } catch {
      // Si falla, permitir reintento.
      setApplied((m) => ({ ...m, [idx]: false }));
    }
  };

  return (
    <div className="rounded-[var(--radius)] border border-white/10 bg-[var(--bg-surface)] p-3 flex flex-col gap-2">
      <p
        className="text-[11px] uppercase tracking-wider text-[color:var(--text-muted)]"
        style={{ fontFamily: 'var(--font-share-tech-mono)' }}
      >
        {variant === 'primary' ? 'Acción primaria' : 'Acción secundaria'}
      </p>

      {steps.map((step, idx) => {
        const isChecked = !!checked[idx];
        const quick = step.quick;

        // Botón de reponer: mostrar X/Y y deshabilitar si ya está al máximo.
        const atMax =
          quick?.kind === 'replenishCommodities' &&
          commodityMax !== undefined &&
          currentCommodities !== undefined &&
          currentCommodities >= commodityMax;

        const Icon = quick ? quickIcon(quick.kind) : null;
        const btnDisabled = disabled || !!applied[idx] || atMax;

        return (
          <div key={idx} className="flex items-start gap-2">
            <button
              type="button"
              onClick={() => setChecked((m) => ({ ...m, [idx]: !m[idx] }))}
              className="flex-shrink-0 mt-0.5 text-[color:var(--text-muted)] hover:text-white transition-colors"
              aria-label={isChecked ? 'Marcar como pendiente' : 'Marcar como hecho'}
            >
              {isChecked ? (
                <Check size={16} strokeWidth={2.5} className="text-[color:var(--success)]" />
              ) : (
                <Circle size={16} strokeWidth={2} />
              )}
            </button>

            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <span
                className={`${compact ? 'text-xs' : 'text-sm'} leading-snug ${
                  isChecked
                    ? 'text-[color:var(--text-muted)] line-through'
                    : 'text-[color:var(--text-secondary)]'
                }`}
              >
                {step.text}
              </span>

              {quick && Icon && (
                <button
                  type="button"
                  onClick={() => handleQuick(idx, quick)}
                  disabled={btnDisabled}
                  className={`self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius)] border text-xs transition-all ${
                    btnDisabled
                      ? 'opacity-40 cursor-not-allowed border-white/8 text-[color:var(--text-muted)]'
                      : 'border-[color:var(--accent-border-faint)] text-[color:var(--accent-soft)] hover:bg-white/5 pointer-events-auto'
                  }`}
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  <Icon size={13} strokeWidth={2} aria-hidden />
                  <span>
                    {quick.label}
                    {quick.kind === 'replenishCommodities' &&
                      commodityMax !== undefined &&
                      currentCommodities !== undefined &&
                      ` (${currentCommodities}/${commodityMax})`}
                  </span>
                  {applied[idx] && <Check size={12} strokeWidth={2.5} aria-hidden />}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
