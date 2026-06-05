/**
 * Detección (no destructiva) de las condiciones de fin de partida de TI4.
 *
 * La partida "habría terminado" si: (a) algún jugador alcanza el objetivo de PV, o
 * (b) ya no quedan objetivos públicos por revelar. NO se fuerza el fin: solo se
 * anuncia y se permite seguir jugando ("prórroga").
 */
import type { PlayerData } from '@/types/game';

export interface EndStateInput {
  players: PlayerData[];
  nbPlayers: number;
  objectiveDeck: string[];
  revealedCount: number;
  vpWinGoal: number;
}

export interface EndState {
  /** Algún jugador activo (no abandonado) ha alcanzado el objetivo de PV. */
  vpReached: boolean;
  /** Todos los objetivos públicos ya están revelados (mazo agotado). */
  objectivesExhausted: boolean;
  /** Se cumple alguna condición de fin. */
  anyEnd: boolean;
  /** Índice del líder provisional (-1 si no hay jugadores activos). */
  leaderIdx: number;
}

export function computeEndState({
  players,
  nbPlayers,
  objectiveDeck,
  revealedCount,
  vpWinGoal,
}: EndStateInput): EndState {
  const active = players
    .slice(0, nbPlayers)
    .map((p, idx) => ({ p, idx }))
    .filter(({ p }) => !p.abandoned);

  const vpReached = active.some(({ p }) => p.vp >= vpWinGoal);
  const objectivesExhausted = objectiveDeck.length > 0 && revealedCount >= objectiveDeck.length;

  // Líder provisional: más PV y, a igualdad, menor tiempo de reloj (igual que EndGameScreen).
  const ranked = [...active].sort((a, b) => b.p.vp - a.p.vp || a.p.clock - b.p.clock);
  const leaderIdx = ranked.length > 0 ? ranked[0].idx : -1;

  return {
    vpReached,
    objectivesExhausted,
    anyEnd: vpReached || objectivesExhausted,
    leaderIdx,
  };
}
