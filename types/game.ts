import {
  PHASE_INIT,
  PHASE_GALAXY,
  PHASE_STRATEGY,
  PHASE_ACTION,
  PHASE_STATUS,
  PHASE_AGENDA,
  PHASE_END,
  STRATEGY_DISABLED,
  STRATEGY_AVAILABLE,
  STRATEGY_PLAYED,
  STRATEGY_PASSED,
  STRATEGY_PICKED,
  NO_PLAYER,
} from '@/lib/constants';

export type GamePhase =
  | typeof PHASE_INIT
  | typeof PHASE_GALAXY
  | typeof PHASE_STRATEGY
  | typeof PHASE_ACTION
  | typeof PHASE_STATUS
  | typeof PHASE_AGENDA
  | typeof PHASE_END;

export type StrategyStatus =
  | typeof STRATEGY_DISABLED
  | typeof STRATEGY_AVAILABLE
  | typeof STRATEGY_PLAYED
  | typeof STRATEGY_PASSED
  | typeof STRATEGY_PICKED;

export type Lang = 'en' | 'es';

export type ClockRun = -1 | 0 | 1;

export interface CommandTokenPools {
  tactic: number;
  fleet: number;
  strategy: number;
}

export type CommandPool = keyof CommandTokenPools;

export interface PlayerData {
  faction: number;
  color: number;
  name: string;
  clock: number;
  nbSpeaker: number;
  influence: number;
  vp: number;
  commandTokens: CommandTokenPools;
  commodities: number;
  tradeGoods: number;
}

export interface StrategyEntry {
  nameEn: string;
  nameEs: string;
  playerIdx: number;
  status: StrategyStatus;
  color: string;
  tradeGoods: number;
  isNaaluSlot: boolean;
  secondPickPlayerIdx?: number;
}

export interface VoteRecord {
  playerIdx: number;
  voteColumnIdx: number;
  influenceAmount: number | null;
}

export interface GameOptions {
  vpWinGoal: number;
  decisionTimerLimit: number;
  inactivityMinutes: number;
  showVPBar: boolean;
  showFactionClock: boolean;
  detailedAgenda: boolean;
}

export type ModalType =
  | 'speaker'
  | 'naalu'
  | 'swap'
  | 'strategyEnd'
  | 'factionPicker'
  | 'planet'
  | 'law'
  | 'objective'
  | 'strategy'
  | 'other'
  | 'options'
  | 'inactivity'
  | 'pauseAlert'
  | 'instructions'
  | 'broadcast'
  | null;

export interface TransitionText {
  turn: string;
  phase: string;
}

// Agenda voting context (shared so mobile can see what's being voted)
export type AgendaStage = 'type_select' | 'voting' | 'results';
export type AgendaVoteType =
  | 'ForAgainst'
  | 'ElectPlayer'
  | 'ElectPlanet'
  | 'ElectLaw'
  | 'ElectObjective'
  | 'ElectStrategy'
  | 'ElectOther';

// Real-time sync state (SaveState + transient fields needed for live viewer)
export interface SyncState extends SaveState {
  votes: VoteRecord[];
  votingPlayerIdx: number;
  clockRun: ClockRun;
  currentPlayerTimer: number;
  agendaStage: AgendaStage;
  agendaVoteType: AgendaVoteType | null;
  agendaColumns: string[];
}

// Serializable save state (subset of full state, without DOM/timer values)
export interface SaveState {
  nbPlayers: number;
  players: PlayerData[];
  speakerIdx: number;
  previousSpeakerIdx: number;
  phase: GamePhase;
  turnCounter: number;
  roundCounter: number;
  gameDuration: number;
  strategies: StrategyEntry[];
  activeStrategyIdx: number;
  playerChooseCount: number;
  naaluStrategyIdx: number;
  telephaticPlayerIdx: number;
  agendaStep: 1 | 2;
  agendaPhase: 0 | 1;
  statusStep: 0 | 1;
  options: GameOptions;
  lang: Lang;
  objectiveDeck: string[];
  revealedCount: number;
  objectivesScoredBy: Record<string, number[]>;
  researchedTechs: Record<number, string[]>;
  exhaustedTechs: Record<number, string[]>;
}

export const DEFAULT_OPTIONS: GameOptions = {
  vpWinGoal: 10,
  decisionTimerLimit: 90,
  inactivityMinutes: 15,
  showVPBar: true,
  showFactionClock: false,
  detailedAgenda: false,
};

export function makeDefaultPlayer(idx: number): PlayerData {
  return {
    faction: idx,
    color: idx % 8,
    name: `Player ${idx + 1}`,
    clock: 0,
    nbSpeaker: 0,
    influence: 0,
    vp: 0,
    commandTokens: { tactic: 3, fleet: 3, strategy: 2 },
    commodities: 0,
    tradeGoods: 0,
  };
}

/** Normalize a possibly-old player object (from older saves) to current schema. */
export function normalizePlayer(p: PlayerData): PlayerData {
  const tokensOk = p && p.commandTokens && typeof p.commandTokens.tactic === 'number';
  const commoditiesOk = typeof p.commodities === 'number';
  const tradeGoodsOk = typeof p.tradeGoods === 'number';
  if (tokensOk && commoditiesOk && tradeGoodsOk) return p;
  return {
    ...p,
    commandTokens: tokensOk ? p.commandTokens : { tactic: 3, fleet: 3, strategy: 2 },
    commodities: commoditiesOk ? p.commodities : 0,
    tradeGoods: tradeGoodsOk ? p.tradeGoods : 0,
  };
}

export function makeDefaultStrategies(): StrategyEntry[] {
  return [
    // Slot 0: Naalu gift slot (special)
    { nameEn: 'Naalu Gift', nameEs: 'Regalo Naalu', playerIdx: NO_PLAYER, status: STRATEGY_DISABLED, color: 'red', tradeGoods: 0, isNaaluSlot: true },
    // Slots 1-8: regular strategy cards
    { nameEn: 'Leadership', nameEs: 'Liderazgo', playerIdx: NO_PLAYER, status: STRATEGY_AVAILABLE, color: 'red', tradeGoods: 0, isNaaluSlot: false },
    { nameEn: 'Diplomacy', nameEs: 'Diplomacia', playerIdx: NO_PLAYER, status: STRATEGY_AVAILABLE, color: 'blue', tradeGoods: 0, isNaaluSlot: false },
    { nameEn: 'Politics', nameEs: 'Política', playerIdx: NO_PLAYER, status: STRATEGY_AVAILABLE, color: 'yellow', tradeGoods: 0, isNaaluSlot: false },
    { nameEn: 'Construction', nameEs: 'Construcción', playerIdx: NO_PLAYER, status: STRATEGY_AVAILABLE, color: 'green', tradeGoods: 0, isNaaluSlot: false },
    { nameEn: 'Trade', nameEs: 'Comercio', playerIdx: NO_PLAYER, status: STRATEGY_AVAILABLE, color: 'orange', tradeGoods: 0, isNaaluSlot: false },
    { nameEn: 'Warfare', nameEs: 'Guerra', playerIdx: NO_PLAYER, status: STRATEGY_AVAILABLE, color: 'darkred', tradeGoods: 0, isNaaluSlot: false },
    { nameEn: 'Technology', nameEs: 'Tecnología', playerIdx: NO_PLAYER, status: STRATEGY_AVAILABLE, color: 'cyan', tradeGoods: 0, isNaaluSlot: false },
    { nameEn: 'Imperial', nameEs: 'Imperialismo', playerIdx: NO_PLAYER, status: STRATEGY_AVAILABLE, color: 'purple', tradeGoods: 0, isNaaluSlot: false },
  ];
}
