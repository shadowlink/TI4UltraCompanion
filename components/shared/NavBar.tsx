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
    <nav className="flex items-center justify-between px-3 py-2 border-b border-[color:var(--accent-border-faint)] bg-[var(--bg-surface)]">
      {/* Clock */}
      <button
        onClick={handleClockClick}
        className="flex items-center gap-2 pointer-events-auto"
        style={{ fontFamily: 'var(--font-share-tech-mono)' }}
        title={clockRun === 1 ? 'Pause' : 'Resume'}
      >
        <Timer size={18} className="text-[color:var(--accent)]" strokeWidth={2} aria-hidden />
        <span className={`text-lg ${clockRun !== 1 ? 'text-[color:var(--text-muted)]' : 'text-white'}`}>
          {clockRun === 0 ? '—Pausa—' : formatTime(gameDuration)}
        </span>
      </button>

      {/* Center: phase + decision timer */}
      <div className="flex flex-col items-center gap-1 flex-1 mx-4">
        {phaseLabel ? (
          <span
            className="text-base text-[color:var(--accent-soft)] text-shadow"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {`Ronda ${turnCounter}`} — {phaseLabel}
          </span>
        ) : null}
        {/* Decision timer progress bar */}
        <div className="w-full max-w-md h-2.5 bg-white/5 rounded-[var(--radius-sm)] overflow-hidden">
          <div
            className="h-full rounded-[var(--radius-sm)] transition-[width,background-color] duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              background: isDecisionRed ? 'var(--danger)' : 'var(--accent)',
            }}
          />
        </div>
        <span
          className="text-2xl font-bold transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-share-tech-mono)',
            color: isDecisionRed ? 'var(--danger)' : 'var(--text-secondary)',
          }}
        >
          {decisionTimerRemaining > 0 ? decisionTimerRemaining : '¡Decide!'}
        </span>
      </div>

      {/* Broadcast + Options */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => openModal('broadcast')}
          className="text-[color:var(--accent)] hover:text-[color:var(--accent-soft)] p-2 transition-colors pointer-events-auto"
          title="Compartir partida"
          aria-label="Compartir partida"
        >
          <Radio size={20} strokeWidth={2} aria-hidden />
        </button>
        <button
          onClick={() => openModal('options')}
          className="text-[color:var(--accent)] hover:text-[color:var(--accent-soft)] p-2 transition-colors pointer-events-auto"
          title="Opciones"
          aria-label="Opciones"
        >
          <Settings size={20} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </nav>
  );
}
