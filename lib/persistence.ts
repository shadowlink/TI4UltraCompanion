import { APP_VERSION } from '@/lib/constants';
import type { SaveState } from '@/types/game';

const SAVE_KEY = 'ti4_extracomputer_v8';
const MAGIC = 'NEKROVIRUS_010000100101010101000111';

interface SavePayload {
  magic: string;
  version: number;
  savedAt: number;
  state: SaveState;
}

/** Pick only the SaveState fields from a larger state object (e.g. the store). */
export function extractSaveState<T extends SaveState>(s: T): SaveState {
  return {
    nbPlayers: s.nbPlayers,
    players: s.players,
    speakerIdx: s.speakerIdx,
    previousSpeakerIdx: s.previousSpeakerIdx,
    phase: s.phase,
    turnCounter: s.turnCounter,
    roundCounter: s.roundCounter,
    gameDuration: s.gameDuration,
    strategies: s.strategies,
    activeStrategyIdx: s.activeStrategyIdx,
    playerChooseCount: s.playerChooseCount,
    naaluStrategyIdx: s.naaluStrategyIdx,
    telephaticPlayerIdx: s.telephaticPlayerIdx,
    agendaStep: s.agendaStep,
    agendaPhase: s.agendaPhase,
    statusStep: s.statusStep,
    options: s.options,
    objectiveDeck: s.objectiveDeck,
    revealedCount: s.revealedCount,
    objectivesScoredBy: s.objectivesScoredBy,
    endNotified: s.endNotified,
    researchedTechs: s.researchedTechs,
    exhaustedTechs: s.exhaustedTechs,
    nekroAssimilated: s.nekroAssimilated,
    votes: s.votes,
    votingPlayerIdx: s.votingPlayerIdx,
    agendaStage: s.agendaStage,
    agendaVoteType: s.agendaVoteType,
    agendaColumns: s.agendaColumns,
    clockRun: s.clockRun,
    clockStarted: s.clockStarted,
    currentPlayerTimer: s.currentPlayerTimer,
    lastActivity: s.lastActivity,
  };
}

/**
 * Comprobación mínima de integridad estructural de un SaveState. Evita que un
 * guardado parseable pero mal formado (p.ej. `players` no es un array) haga
 * lanzar a `hydrateFromSave` en cada arranque (bucle irrecuperable).
 */
export function isValidSaveState(state: unknown): state is SaveState {
  if (!state || typeof state !== 'object') return false;
  const s = state as Partial<SaveState>;
  if (typeof s.nbPlayers !== 'number' || s.nbPlayers < 1 || s.nbPlayers > 8) return false;
  if (!Array.isArray(s.players) || s.players.length < s.nbPlayers) return false;
  if (!Array.isArray(s.strategies)) return false;
  if (typeof s.phase !== 'number') return false;
  return true;
}

/** Serializa el estado al formato de guardado (con cabecera magic/version). */
export function serializeSaveState(state: SaveState): string {
  const payload: SavePayload = {
    magic: MAGIC,
    version: APP_VERSION,
    savedAt: Date.now(),
    state,
  };
  return JSON.stringify(payload);
}

/** Parsea una cadena de guardado validando magic, versión y estructura. */
export function parseSavePayload(raw: string): SaveState | null {
  try {
    const payload: SavePayload = JSON.parse(raw);
    if (payload.magic !== MAGIC) return null;
    if (Math.floor(payload.version / 100) < Math.floor(APP_VERSION / 100)) return null;
    if (!isValidSaveState(payload.state)) return null;
    return payload.state;
  } catch {
    return null;
  }
}

export function saveGame(state: SaveState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVE_KEY, serializeSaveState(state));
  } catch {
    // localStorage full or unavailable
  }
}

export function loadGame(): SaveState | null {
  if (typeof window === 'undefined') return null;
  const raw = (() => {
    try {
      return localStorage.getItem(SAVE_KEY);
    } catch {
      return null;
    }
  })();
  if (!raw) return null;
  return parseSavePayload(raw);
}

export function hasSavedGame(): boolean {
  return loadGame() !== null;
}

export function clearSavedGame(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SAVE_KEY);
}
