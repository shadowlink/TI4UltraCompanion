'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import {
  PHASE_INIT,
  PHASE_GALAXY,
  PHASE_STRATEGY,
  PHASE_ACTION,
  PHASE_STATUS,
  PHASE_AGENDA,
  PHASE_END,
  NO_PLAYER,
  STRATEGY_AVAILABLE,
  STRATEGY_PICKED,
} from '@/lib/constants';

const PHASE_LABELS: Record<number, { en: string; es: string }> = {
  [PHASE_INIT]: { en: 'Setup', es: 'Configuración' },
  [PHASE_GALAXY]: { en: 'Galaxy', es: 'Galaxia' },
  [PHASE_STRATEGY]: { en: 'Strategy', es: 'Estrategia' },
  [PHASE_ACTION]: { en: 'Action', es: 'Acción' },
  [PHASE_STATUS]: { en: 'Status', es: 'Estado' },
  [PHASE_AGENDA]: { en: 'Agenda', es: 'Consejo' },
  [PHASE_END]: { en: 'End', es: 'Fin' },
};

export default function MobilePhaseHeader() {
  const lang = useGameStore((s) => s.lang);
  const phase = useGameStore((s) => s.phase);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const strategies = useGameStore((s) => s.strategies);
  const activeStrategyIdx = useGameStore((s) => s.activeStrategyIdx);
  const votingPlayerIdx = useGameStore((s) => s.votingPlayerIdx);

  const phaseLabel = PHASE_LABELS[phase]?.[lang] ?? '';

  // Determine active player & verb based on phase
  let activePlayerIdx = NO_PLAYER;
  let actionLabel = '';

  if (phase === PHASE_STRATEGY) {
    // Find current picker (same logic as StrategyPhase)
    const pickOrder = Array.from({ length: nbPlayers }, (_, i) => (speakerIdx + i) % nbPlayers);
    const playerPickCount: Record<number, number> = {};
    strategies.forEach((st) => {
      if (st.playerIdx !== NO_PLAYER && st.playerIdx < 8) {
        playerPickCount[st.playerIdx] = (playerPickCount[st.playerIdx] ?? 0) + 1;
      }
      if (st.secondPickPlayerIdx !== undefined && st.secondPickPlayerIdx < 8) {
        playerPickCount[st.secondPickPlayerIdx] = (playerPickCount[st.secondPickPlayerIdx] ?? 0) + 1;
      }
    });
    const maxPicksPerPlayer = nbPlayers <= 4 ? 2 : 1;
    activePlayerIdx =
      pickOrder.find((pIdx) => (playerPickCount[pIdx] ?? 0) < maxPicksPerPlayer) ?? NO_PLAYER;
    // Check if all picked - if so, show phase effects state
    const anyAvailable = strategies.some((st) => st.status === STRATEGY_AVAILABLE && !st.isNaaluSlot);
    const anyPicked = strategies.some((st) => st.status === STRATEGY_PICKED);
    if (activePlayerIdx === NO_PLAYER && (anyPicked || !anyAvailable)) {
      actionLabel = lang === 'es' ? 'esperando inicio de fase de acción' : 'awaiting action phase';
    } else {
      actionLabel = lang === 'es' ? 'elige estrategia' : 'choosing strategy';
    }
  } else if (phase === PHASE_ACTION) {
    const activeStrat = strategies[activeStrategyIdx];
    if (activeStrat && activeStrat.playerIdx !== NO_PLAYER && activeStrat.playerIdx < 8) {
      activePlayerIdx = activeStrat.playerIdx;
    }
    actionLabel = lang === 'es' ? 'su turno' : 'their turn';
  } else if (phase === PHASE_AGENDA) {
    if (votingPlayerIdx !== NO_PLAYER && votingPlayerIdx < nbPlayers) {
      activePlayerIdx = votingPlayerIdx;
    }
    actionLabel = lang === 'es' ? 'vota' : 'voting';
  } else if (phase === PHASE_STATUS) {
    actionLabel = lang === 'es' ? 'fase de estado' : 'status phase';
  }

  const activePlayer = activePlayerIdx !== NO_PLAYER ? players[activePlayerIdx] : null;
  const activeFaction = activePlayer ? FACTIONS[activePlayer.faction] : null;
  const activeColor = activePlayer
    ? PLAYER_COLOR_VALUES[PLAYER_COLORS[activePlayer.color]]
    : undefined;

  return (
    <div className="sticky top-0 z-30 bg-black/85 backdrop-blur border-b border-orange-500/30 px-3 py-2">
      <div className="flex items-baseline gap-2">
        <span
          className="text-base text-orange-300 text-shadow"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {phaseLabel}
        </span>
        {phase !== PHASE_INIT && phase !== PHASE_END && (
          <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
            R{turnCounter}
          </span>
        )}
      </div>
      {activeFaction ? (
        <div className="flex items-center gap-2 mt-1">
          <div className="w-7 h-7 relative flex-shrink-0">
            <Image src={activeFaction.iconPath} alt={activeFaction.shortName} fill className="object-contain" unoptimized />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white truncate" style={{ color: activeColor }}>
              {activeFaction.shortName}{activePlayer!.name ? ` (${activePlayer!.name})` : ''}
            </p>
            <p className="text-[11px] text-gray-400 truncate">{actionLabel}</p>
          </div>
        </div>
      ) : (
        actionLabel && (
          <p className="text-xs text-gray-400 mt-1">{actionLabel}</p>
        )
      )}
    </div>
  );
}
