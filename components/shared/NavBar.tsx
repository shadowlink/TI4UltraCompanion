'use client';

import { useGameStore } from '@/store/gameStore';
import { formatTime } from '@/lib/timeUtils';
import {
  PHASE_STRATEGY,
  PHASE_ACTION,
  PHASE_STATUS,
  PHASE_AGENDA,
} from '@/lib/constants';

const PHASE_LABELS: Record<number, { en: string; es: string }> = {
  2: { en: 'Strategy Phase', es: 'Fase de Estrategia' },
  3: { en: 'Action Phase', es: 'Fase de Acción' },
  4: { en: 'Status Phase', es: 'Fase de Estado' },
  5: { en: 'Agenda Phase', es: 'Fase de Consejo Galáctico' },
};

export default function NavBar() {
  const gameDuration = useGameStore((s) => s.gameDuration);
  const clockRun = useGameStore((s) => s.clockRun);
  const phase = useGameStore((s) => s.phase);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const lang = useGameStore((s) => s.lang);
  const decisionTimerRemaining = useGameStore((s) => s.decisionTimerRemaining);
  const decisionTimerLimit = useGameStore((s) => s.options.decisionTimerLimit);
  const setClock = useGameStore((s) => s.setClock);
  const openModal = useGameStore((s) => s.openModal);

  const phaseLabel = PHASE_LABELS[phase]?.[lang] ?? '';
  const progressPct = Math.max(0, (decisionTimerRemaining / decisionTimerLimit) * 100);
  const isDecisionRed = decisionTimerRemaining <= 5;

  const handleClockClick = () => {
    setClock(clockRun === 1 ? -1 : 1);
  };

  return (
    <nav className="flex items-center justify-between px-3 py-2 border-b border-orange-500/30 bg-black/40">
      {/* Clock */}
      <button
        onClick={handleClockClick}
        className="flex items-center gap-2 text-xl"
        style={{ fontFamily: 'var(--font-share-tech-mono)' }}
        title={clockRun === 1 ? 'Pause' : 'Resume'}
      >
        <span className="text-orange-400">⏱</span>
        <span className={clockRun !== 1 ? 'text-gray-500' : 'text-white'}>
          {clockRun === 0 ? '—Pause—' : formatTime(gameDuration)}
        </span>
      </button>

      {/* Center: phase + decision timer */}
      <div className="flex flex-col items-center gap-1 flex-1 mx-4">
        {phaseLabel ? (
          <span
            className="text-base text-orange-300 text-shadow"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {lang === 'es' ? `Ronda ${turnCounter}` : `Round ${turnCounter}`} — {phaseLabel}
          </span>
        ) : null}
        {/* Decision timer progress bar */}
        <div className="w-full max-w-md h-3 bg-gray-700 rounded overflow-hidden">
          <div
            className={`h-full progress-bar rounded ${isDecisionRed ? 'bg-red-500' : 'bg-orange-400'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span
          className={`text-2xl font-bold ${isDecisionRed ? 'text-red-400' : 'text-gray-300'}`}
          style={{ fontFamily: 'var(--font-share-tech-mono)' }}
        >
          {decisionTimerRemaining > 0 ? decisionTimerRemaining : lang === 'es' ? '¡Decide!' : 'Decide!'}
        </span>
      </div>

      {/* Broadcast + Options */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => openModal('broadcast')}
          className="text-orange-400 hover:text-orange-200 text-xl px-2"
          title={lang === 'es' ? 'Compartir partida' : 'Share game'}
        >
          📡
        </button>
        <button
          onClick={() => openModal('options')}
          className="text-orange-400 hover:text-orange-200 text-xl px-2"
          title="Options"
        >
          ⚙
        </button>
      </div>
    </nav>
  );
}
