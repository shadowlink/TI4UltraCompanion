'use client';

import { useGameStore } from '@/store/gameStore';
import { getActiveDecisionPlayer } from '@/lib/turnInfo';

/** Índice del jugador que debe actuar ahora (NO_PLAYER si no le toca a nadie). */
export function useActiveDecisionPlayer(): number {
  const phase = useGameStore((s) => s.phase);
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const strategies = useGameStore((s) => s.strategies);
  const activeStrategyIdx = useGameStore((s) => s.activeStrategyIdx);
  const votingPlayerIdx = useGameStore((s) => s.votingPlayerIdx);
  const agendaStage = useGameStore((s) => s.agendaStage);
  return getActiveDecisionPlayer({
    phase,
    players,
    nbPlayers,
    speakerIdx,
    strategies,
    activeStrategyIdx,
    votingPlayerIdx,
    agendaStage,
  });
}
