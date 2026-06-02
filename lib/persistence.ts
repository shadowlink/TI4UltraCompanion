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
    researchedTechs: s.researchedTechs,
    exhaustedTechs: s.exhaustedTechs,
    nekroAssimilated: s.nekroAssimilated,
    votes: s.votes,
    votingPlayerIdx: s.votingPlayerIdx,
    agendaStage: s.agendaStage,
    agendaVoteType: s.agendaVoteType,
    agendaColumns: s.agendaColumns,
    clockRun: s.clockRun,
    currentPlayerTimer: s.currentPlayerTimer,
    lastActivity: s.lastActivity,
  };
}

export function saveGame(state: SaveState): void {
  if (typeof window === 'undefined') return;
  const payload: SavePayload = {
    magic: MAGIC,
    version: APP_VERSION,
    savedAt: Date.now(),
    state,
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage full or unavailable
  }
}

export function loadGame(): SaveState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const payload: SavePayload = JSON.parse(raw);
    if (payload.magic !== MAGIC) return null;
    if (Math.floor(payload.version / 100) < Math.floor(APP_VERSION / 100)) return null;
    return payload.state;
  } catch {
    return null;
  }
}

export function hasSavedGame(): boolean {
  return loadGame() !== null;
}

export function clearSavedGame(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SAVE_KEY);
}
