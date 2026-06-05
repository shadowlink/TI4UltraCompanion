import { PHASE_STRATEGY, PHASE_ACTION, PHASE_AGENDA, NO_PLAYER } from '@/lib/constants';
import type { PlayerData, StrategyEntry, AgendaStage } from '@/types/game';

export interface TurnInfoState {
  phase: number;
  players: PlayerData[];
  nbPlayers: number;
  speakerIdx: number;
  strategies: StrategyEntry[];
  activeStrategyIdx: number;
  votingPlayerIdx: number;
  agendaStage: AgendaStage;
}

/** Jugador al que le toca elegir carta de estrategia (NO_PLAYER si ya eligieron todos). */
export function strategyPickerIdx(s: {
  players: PlayerData[];
  nbPlayers: number;
  speakerIdx: number;
  strategies: StrategyEntry[];
}): number {
  const { players, nbPlayers, speakerIdx, strategies } = s;
  // Los jugadores que han abandonado no entran en el orden de selección.
  const pickOrder = Array.from({ length: nbPlayers }, (_, i) => (speakerIdx + i) % nbPlayers).filter(
    (pIdx) => !players[pIdx]?.abandoned,
  );
  const count: Record<number, number> = {};
  strategies.forEach((st) => {
    if (st.playerIdx !== NO_PLAYER && st.playerIdx < 8) count[st.playerIdx] = (count[st.playerIdx] ?? 0) + 1;
    if (st.secondPickPlayerIdx !== undefined && st.secondPickPlayerIdx < 8) {
      count[st.secondPickPlayerIdx] = (count[st.secondPickPlayerIdx] ?? 0) + 1;
    }
  });
  const maxPicks = nbPlayers <= 4 ? 2 : 1;
  return pickOrder.find((pIdx) => (count[pIdx] ?? 0) < maxPicks) ?? NO_PLAYER;
}

/**
 * Devuelve el índice del jugador que tiene que actuar AHORA (resolver un turno),
 * o NO_PLAYER si en este momento no le toca a nadie (p. ej. ya eligieron todos su
 * carta, fase de Estado, resultados de agenda…). Es la base para que la cuenta
 * atrás y el tiempo por jugador solo corran cuando alguien debe decidir.
 */
export function getActiveDecisionPlayer(s: TurnInfoState): number {
  switch (s.phase) {
    case PHASE_STRATEGY:
      return strategyPickerIdx(s);
    case PHASE_ACTION: {
      const p = s.strategies[s.activeStrategyIdx]?.playerIdx ?? NO_PLAYER;
      return p !== NO_PLAYER && p < 8 ? p : NO_PLAYER;
    }
    case PHASE_AGENDA:
      if (s.agendaStage === 'voting') {
        return s.votingPlayerIdx >= 0 && s.votingPlayerIdx < 8 ? s.votingPlayerIdx : NO_PLAYER;
      }
      if (s.agendaStage === 'type_select') {
        return s.speakerIdx >= 0 && s.speakerIdx < 8 ? s.speakerIdx : NO_PLAYER;
      }
      return NO_PLAYER;
    default:
      return NO_PLAYER;
  }
}
