import type { SyncState, AgendaVoteType } from '@/types/game';

export interface RoomPairing {
  factionIdx: number;
  deviceId: string;
}

export type MobileCommand =
  | { type: 'pickStrategy'; stratIdx: number }
  | { type: 'takeAction'; s1: boolean; s2: boolean; pass: boolean }
  | { type: 'incrementVP'; delta: number }
  | { type: 'castVote'; voteColumnIdx: number; amount: number }
  | { type: 'abstain' }
  | { type: 'scoreObjective'; objectiveId: string }
  | { type: 'unscoreObjective'; objectiveId: string }
  | { type: 'researchTech'; techId: string }
  | { type: 'researchTechWithBypass'; techId: string; bypassTechId: string }
  | { type: 'unresearchTech'; techId: string }
  | { type: 'exhaustTech'; techId: string }
  | { type: 'readyTech'; techId: string }
  | { type: 'readyAllMyTechs' }
  | { type: 'adjustTokens'; pool: 'tactic' | 'fleet' | 'strategy'; delta: number }
  | { type: 'adjustCommodities'; delta: number }
  | { type: 'adjustTradeGoods'; delta: number }
  | { type: 'assimilateTech'; techId: string }
  | { type: 'unassimilateTech'; techId: string }
  | { type: 'nekroGainTech'; techId: string }
  | { type: 'nekroUngainTech'; techId: string }
  // Speaker-only game flow commands
  | { type: 'finalizeStrategyPhase' }
  | { type: 'startAgenda' }
  | { type: 'startNewRound' }
  | { type: 'advanceAgendaStep' }
  | { type: 'setupAgendaVote'; voteType: AgendaVoteType; columns: string[] }
  | { type: 'setSpeaker'; playerIdx: number };

export interface PendingCommand {
  deviceId: string;
  factionIdx: number;
  command: MobileCommand;
  ts: number;
}

export interface RoomFileSchema {
  state: SyncState | null;
  pairings: RoomPairing[];
  pendingCommands: PendingCommand[];
}
