'use client';

interface Props {
  label: string;
  color: string;
  bg: string;
  value: number;
  max?: number;
  canEdit: boolean;
  canDecrement: boolean;
  canIncrement: boolean;
  busy: boolean;
  onDec: () => void;
  onInc: () => void;
}

/**
 * Fila a todo el ancho con un contador y botones +/- grandes (cómodos para el
 * dedo). Pensada para apilar varias en vertical en la sección "Mando" móvil.
 */
export default function MobileStepperRow({
  label,
  color,
  bg,
  value,
  max,
  canEdit,
  canDecrement,
  canIncrement,
  busy,
  onDec,
  onInc,
}: Props) {
  return (
    <div
      className="flex items-center justify-between rounded-lg border-2 px-3 py-2 pointer-events-auto"
      style={{ borderColor: color, background: `linear-gradient(90deg, ${bg} 0%, rgba(0,0,0,0.4) 100%)` }}
    >
      <span className="text-sm uppercase tracking-wider" style={{ color, fontFamily: 'var(--font-aldrich)' }}>
        {label}
      </span>
      <div className="flex items-center gap-3">
        {canEdit && (
          <button
            onClick={onDec}
            disabled={busy || !canDecrement}
            className="w-12 h-12 rounded-lg border border-red-500/60 bg-red-500/15 text-red-200 text-2xl leading-none active:bg-red-500/30 disabled:opacity-30 flex items-center justify-center"
            aria-label={`Restar ${label}`}
          >
            −
          </button>
        )}
        <span
          className="text-3xl font-bold text-white min-w-[2.5ch] text-center"
          style={{ fontFamily: 'var(--font-share-tech-mono)' }}
        >
          {value}
          {max !== undefined && <span className="text-base text-gray-400"> / {max}</span>}
        </span>
        {canEdit && (
          <button
            onClick={onInc}
            disabled={busy || !canIncrement}
            className="w-12 h-12 rounded-lg border border-green-500/60 bg-green-500/15 text-green-200 text-2xl leading-none active:bg-green-500/30 disabled:opacity-30 flex items-center justify-center"
            aria-label={`Sumar ${label}`}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
