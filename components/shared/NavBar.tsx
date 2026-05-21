'use client';

import { useGameStore } from '@/store/gameStore';
import { formatTime } from '@/lib/timeUtils';
import { Timer, Radio, Settings } from '@/components/ui/icons';

const PHASE_LABELS: Record<number, string> = {
  2: 'Fase de Estrategia',
  3: 'Fase de Acción',
  4: 'Fase de Estado',
  5: 'Fase de Consejo Galáctico',
};

export default function NavBar() {
  const gameDuration = useGameStore((s) => s.gameDuration);
  const clockRun = useGameStore((s) => s.clockRun);
  const phase = useGameStore((s) => s.phase);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const decisionTimerRemaining = useGameStore((s) => s.decisionTimerRemaining);
  const decisionTimerLimit = useGameStore((s) => s.options.decisionTimerLimit);
  const setClock = useGameStore((s) => s.setClock);
  const openModal = useGameStore((s) => s.openModal);

  const phaseLabel = PHASE_LABELS[phase] ?? '';
  const progressPct = Math.max(0, (decisionTimerRemaining / decisionTimerLimit) * 100);
  const isDecisionRed = decisionTimerRemaining <= 5;

  const handleClockClick = () => {
    setClock(clockRun === 1 ? -1 : 1);
  };

  return (
    <nav className="flex flex-col px-3 py-3 gap-2 bg-[var(--bg-surface)] border-t border-[color:var(--accent-border-faint)]">
      {/* Clock */}
      <button
        onClick={handleClockClick}
        className="flex items-center gap-2 pointer-events-auto"
        title={clockRun === 1 ? 'Pause' : 'Resume'}
      >
        <Timer size={16} className="text-[color:var(--accent)]" strokeWidth={2} aria-hidden />
        <span
          className={`text-base ${clockRun !== 1 ? 'text-[color:var(--text-muted)]' : 'text-white'}`}
          style={{ fontFamily: 'var(--font-share-tech-mono)' }}
        >
          {clockRun === 0 ? '—Pausa—' : formatTime(gameDuration)}
        </span>
      </button>

      {/* Phase + round */}
      {phaseLabel ? (
        <div className="flex flex-col gap-0.5">
          <span
            className="text-xs text-[color:var(--text-muted)]"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {`Ronda ${turnCounter}`}
          </span>
          <span
            className="text-sm text-[color:var(--accent-soft)] text-shadow"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {phaseLabel}
          </span>
        </div>
      ) : null}

      {/* Decision timer */}
      <div className="flex flex-col gap-1">
        <div className="w-full h-2 bg-white/5 rounded overflow-hidden">
          <div
            className="h-full rounded transition-[width,background-color] duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              background: isDecisionRed ? 'var(--danger)' : 'var(--accent)',
            }}
          />
        </div>
        <span
          className="text-2xl font-bold text-center transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-share-tech-mono)',
            color: isDecisionRed ? 'var(--danger)' : 'var(--text-secondary)',
          }}
        >
          {decisionTimerRemaining > 0 ? decisionTimerRemaining : '¡Decide!'}
        </span>
      </div>

      {/* Broadcast + Options */}
      <div className="flex items-center gap-1 mt-auto pt-2 border-t border-white/10">
        <button
          onClick={() => openModal('broadcast')}
          className="text-[color:var(--accent)] hover:text-[color:var(--accent-soft)] p-2 transition-colors pointer-events-auto"
          title="Compartir partida"
          aria-label="Compartir partida"
        >
          <Radio size={18} strokeWidth={2} aria-hidden />
        </button>
        <button
          onClick={() => openModal('options')}
          className="text-[color:var(--accent)] hover:text-[color:var(--accent-soft)] p-2 transition-colors pointer-events-auto"
          title="Opciones"
          aria-label="Opciones"
        >
          <Settings size={18} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </nav>
  );
}
