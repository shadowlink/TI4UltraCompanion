'use client';

import { create } from 'zustand';
import {
  PHASE_INIT,
  PHASE_STRATEGY,
  PHASE_ACTION,
  PHASE_STATUS,
  PHASE_AGENDA,
  PHASE_END,
  PHASE_GALAXY,
  NO_PLAYER,
  STRATEGY_AVAILABLE,
  STRATEGY_DISABLED,
  STRATEGY_PLAYED,
  STRATEGY_PASSED,
  STRATEGY_PICKED,
  NAALU_FACTION,
} from '@/lib/constants';
import {
  makeDefaultPlayer,
  makeDefaultStrategies,
  DEFAULT_OPTIONS,
  type GamePhase,
  type ClockRun,
  type Lang,
  type ModalType,
  type TransitionText,
  type PlayerData,
  type StrategyEntry,
  type StrategyStatus,
  type VoteRecord,
  type GameOptions,
  type SaveState,
  type SyncState,
  type AgendaStage,
  type AgendaVoteType,
} from '@/types/game';
import { saveGame, clearSavedGame } from '@/lib/persistence';
import { STAGE_I_OBJECTIVES, STAGE_II_OBJECTIVES, OBJECTIVES_BY_ID } from '@/data/publicObjectives';
import { TECH_BY_ID, canResearch } from '@/data/technologies';

// ─── State shape ─────────────────────────────────────────────────────────────

interface GameState {
  // Setup
  nbPlayers: number;
  players: PlayerData[];
  speakerIdx: number;
  previousSpeakerIdx: number;

  // Phase
  phase: GamePhase;
  turnCounter: number;
  roundCounter: number;

  // Strategy phase
  strategies: StrategyEntry[];
  activeStrategyIdx: number;
  playerChooseCount: number;
  naaluStrategyIdx: number;
  telephaticPlayerIdx: number;
  endOfStrategyPhase: boolean;

  // Agenda / voting
  votes: VoteRecord[];
  votingPlayerIdx: number;
  agendaStep: 1 | 2;
  agendaPhase: 0 | 1;
  agendaStage: AgendaStage;
  agendaVoteType: AgendaVoteType | null;
  agendaColumns: string[];
  statusStep: 0 | 1;

  // Public objectives
  objectiveDeck: string[];
  revealedCount: number;
  objectivesScoredBy: Record<string, number[]>;

  // Technologies
  researchedTechs: Record<number, string[]>;
  exhaustedTechs: Record<number, string[]>;

  // Options
  options: GameOptions;

  // Clock
  gameDuration: number;
  clockRun: ClockRun;
  currentPlayerTimer: number;
  lastActivity: number;
  decisionTimerRemaining: number;

  // UI
  lang: Lang;
  activeModal: ModalType;
  showTransition: boolean;
  transitionText: TransitionText;

  // Sync
  roomCode: string | null;

  // ─── Actions ───────────────────────────────────────────────────────────────

  // Setup
  setNbPlayers: (n: number) => void;
  setPlayerFaction: (playerIdx: number, factionIdx: number) => void;
  setPlayerColor: (playerIdx: number, colorIdx: number) => void;
  setPlayerName: (playerIdx: number, name: string) => void;
  startNewGame: () => void;

  // Phase management
  setPhase: (phase: GamePhase, label?: string) => void;
  startFirstRound: () => void;
  newTurn: () => void;

  // Speaker
  setSpeaker: (playerIdx: number) => void;

  // Strategy phase
  assignStrategy: (stratIdx: number, playerIdx: number) => void;
  setNaaluTarget: (playerIdx: number) => void;
  swapStrategies: (idxA: number, idxB: number) => void;
  endStrategyPhase: () => void;
  finalizeStrategyPhase: () => void;
  resetStrategyPhase: () => void;

  // Action phase
  nextPlayerAction: () => void;
  resolveAction: (actions: { s1: boolean; s2: boolean; pass: boolean }) => void;

  // VP
  incrementVP: (playerIdx: number, delta: number) => void;

  // Status
  setStatusStep: (step: 0 | 1) => void;
  setAgendaPhase: (phase: 0 | 1) => void;

  // Agenda / voting
  newAgenda: () => void;
  setVote: (record: VoteRecord) => void;
  clearVote: (playerIdx: number) => void;
  nextVotingPlayer: () => void;
  advanceAgendaStep: () => void;
  setAgendaStage: (stage: AgendaStage) => void;
  setAgendaVoteType: (type: AgendaVoteType | null) => void;
  setAgendaColumns: (cols: string[]) => void;
  addAgendaColumn: (label: string) => void;
  resetAgendaContext: () => void;

  // Public objectives
  initializePublicObjectives: () => void;
  revealNextObjective: () => void;
  scoreObjective: (objectiveId: string, playerIdx: number) => void;
  unscoreObjective: (objectiveId: string, playerIdx: number) => void;
  researchTech: (playerIdx: number, techId: string) => void;
  unresearchTech: (playerIdx: number, techId: string) => void;
  exhaustTech: (playerIdx: number, techId: string) => void;
  readyTech: (playerIdx: number, techId: string) => void;
  readyAllMyTechs: (playerIdx: number) => void;
  readyAllTechs: () => void;

  // Clock
  tick: () => void;
  setClock: (run: ClockRun) => void;
  resetDecisionTimer: () => void;
  updateLastActivity: () => void;
  addPlayerClock: (playerIdx: number, seconds: number) => void;
  resetCurrentPlayerTimer: () => void;

  // Player stats
  addInfluence: (playerIdx: number, amount: number) => void;

  // UI
  setLang: (lang: Lang) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  setOptions: (opts: Partial<GameOptions>) => void;

  // Sync
  setRoomCode: (code: string | null) => void;

  // Persistence
  hydrateFromSave: (saved: SaveState) => void;
  hydrateFromSync: (synced: SyncState) => void;
  extractSyncState: () => SyncState;
  persistGame: () => void;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_STATE = {
  nbPlayers: 6,
  players: Array.from({ length: 8 }, (_, i) => makeDefaultPlayer(i)),
  speakerIdx: NO_PLAYER,
  previousSpeakerIdx: NO_PLAYER,
  phase: PHASE_INIT as GamePhase,
  turnCounter: 0,
  roundCounter: 1,
  strategies: makeDefaultStrategies(),
  activeStrategyIdx: 0,
  playerChooseCount: 0,
  naaluStrategyIdx: NO_PLAYER,
  telephaticPlayerIdx: NO_PLAYER,
  endOfStrategyPhase: false,
  votes: [] as VoteRecord[],
  votingPlayerIdx: 0,
  agendaStep: 1 as 1 | 2,
  agendaPhase: 0 as 0 | 1,
  agendaStage: 'type_select' as AgendaStage,
  agendaVoteType: null as AgendaVoteType | null,
  agendaColumns: [] as string[],
  statusStep: 0 as 0 | 1,
  objectiveDeck: [] as string[],
  revealedCount: 0,
  objectivesScoredBy: {} as Record<string, number[]>,
  researchedTechs: {} as Record<number, string[]>,
  exhaustedTechs: {} as Record<number, string[]>,
  options: DEFAULT_OPTIONS,
  gameDuration: 0,
  clockRun: 0 as ClockRun,
  currentPlayerTimer: 0,
  lastActivity: 0,
  decisionTimerRemaining: DEFAULT_OPTIONS.decisionTimerLimit,
  lang: 'en' as Lang,
  activeModal: null as ModalType,
  showTransition: false,
  transitionText: { turn: '', phase: '' },
  roomCode: null,
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useGameStore = create<GameState>()((set, get) => ({
  ...INITIAL_STATE,

  // ── Setup ──────────────────────────────────────────────────────────────────

  setNbPlayers: (n) => set({ nbPlayers: n }),

  setPlayerFaction: (playerIdx, factionIdx) =>
    set((s) => {
      const players = [...s.players];
      players[playerIdx] = { ...players[playerIdx], faction: factionIdx };
      return { players };
    }),

  setPlayerColor: (playerIdx, colorIdx) =>
    set((s) => {
      const players = [...s.players];
      players[playerIdx] = { ...players[playerIdx], color: colorIdx };
      return { players };
    }),

  setPlayerName: (playerIdx, name) =>
    set((s) => {
      const players = [...s.players];
      players[playerIdx] = { ...players[playerIdx], name };
      return { players };
    }),

  startNewGame: () => {
    clearSavedGame();
    set({ ...INITIAL_STATE, players: Array.from({ length: 8 }, (_, i) => makeDefaultPlayer(i)) });
    get().initializePublicObjectives();
  },

  // ── Phase management ───────────────────────────────────────────────────────

  setPhase: (phase, label) => {
    const s = get();
    const turnLabel = `Round ${s.turnCounter}`;
    const phaseLabel = label ?? getPhaseName(phase, s.lang);
    set({
      phase,
      showTransition: true,
      transitionText: { turn: turnLabel, phase: phaseLabel },
      clockRun: phase === PHASE_END ? 0 : 1,
    });
    setTimeout(() => set({ showTransition: false }), 2000);
    get().persistGame();
  },

  startFirstRound: () => {
    set({ turnCounter: 1 });
    get().setPhase(PHASE_STRATEGY);
  },

  newTurn: () => {
    const s = get();
    const newTurn = s.turnCounter + 1;
    set({
      turnCounter: newTurn,
      roundCounter: 1,
      playerChooseCount: 0,
      naaluStrategyIdx: NO_PLAYER,
      telephaticPlayerIdx: NO_PLAYER,
      endOfStrategyPhase: false,
      statusStep: 0,
    });
    // Reset strategies for new turn (keep tradeGoods from unpicked)
    const strats: StrategyEntry[] = s.strategies.map((st) => ({
      ...st,
      playerIdx: NO_PLAYER,
      status: (st.isNaaluSlot ? STRATEGY_DISABLED : STRATEGY_AVAILABLE) as StrategyStatus,
      secondPickPlayerIdx: undefined,
    }));
    set({ strategies: strats });
    get().setPhase(PHASE_STRATEGY);
  },

  // ── Speaker ────────────────────────────────────────────────────────────────

  setSpeaker: (playerIdx) => {
    const s = get();
    const players = [...s.players];
    if (s.speakerIdx !== NO_PLAYER && s.speakerIdx !== playerIdx) {
      players[s.speakerIdx] = { ...players[s.speakerIdx] };
    }
    if (playerIdx !== NO_PLAYER) {
      players[playerIdx] = { ...players[playerIdx], nbSpeaker: players[playerIdx].nbSpeaker + 1 };
    }
    set({ speakerIdx: playerIdx, previousSpeakerIdx: s.speakerIdx, players });
  },

  // ── Strategy phase ─────────────────────────────────────────────────────────

  assignStrategy: (stratIdx, playerIdx) => {
    set((s) => {
      const strategies = [...s.strategies];
      strategies[stratIdx] = { ...strategies[stratIdx], playerIdx, status: STRATEGY_PICKED as StrategyStatus };
      const isNaalu = s.players[playerIdx]?.faction === NAALU_FACTION;
      return {
        strategies,
        playerChooseCount: s.playerChooseCount + 1,
        currentPlayerTimer: 0,
        decisionTimerRemaining: s.options.decisionTimerLimit,
        ...(isNaalu ? { naaluStrategyIdx: stratIdx } : {}),
      };
    });
    get().persistGame();
  },

  setNaaluTarget: (playerIdx) => {
    set((s) => {
      const stratIdx = s.strategies.findIndex(
        (st) => st.playerIdx === playerIdx && !st.isNaaluSlot
      );
      if (stratIdx === -1) return {};
      return { naaluStrategyIdx: stratIdx, telephaticPlayerIdx: playerIdx };
    });
  },

  swapStrategies: (idxA, idxB) => {
    set((s) => {
      const strategies = [...s.strategies];
      const playerA = strategies[idxA].playerIdx;
      const playerB = strategies[idxB].playerIdx;
      strategies[idxA] = { ...strategies[idxA], playerIdx: playerB };
      strategies[idxB] = { ...strategies[idxB], playerIdx: playerA };
      return { strategies };
    });
  },

  endStrategyPhase: () => {
    set({ endOfStrategyPhase: true });
    get().openModal('strategyEnd');
  },

  finalizeStrategyPhase: () => {
    const s = get();
    let strategies = s.strategies.map((st) => ({
      ...st,
      tradeGoods: st.playerIdx === NO_PLAYER && !st.isNaaluSlot ? st.tradeGoods + 1 : st.tradeGoods,
      status: (st.status === STRATEGY_PICKED ? STRATEGY_AVAILABLE : st.status) as StrategyStatus,
    }));
    // Apply Naalu Telepathic: copy chosen strategy to slot 0, disable original
    if (s.naaluStrategyIdx !== NO_PLAYER && s.naaluStrategyIdx < strategies.length) {
      const src = strategies[s.naaluStrategyIdx];
      strategies[0] = {
        ...strategies[0],
        nameEn: src.nameEn,
        nameEs: src.nameEs,
        color: src.color,
        playerIdx: src.playerIdx,
        status: STRATEGY_AVAILABLE,
      };
      strategies[s.naaluStrategyIdx] = {
        ...strategies[s.naaluStrategyIdx],
        status: STRATEGY_DISABLED,
        playerIdx: NO_PLAYER,
      };
    }
    const updatedStrategies = markSecondPicks(strategies, s.nbPlayers);
    // Find first valid primary strategy slot for the action phase start
    let initIdx = 0;
    while (
      initIdx < 9 &&
      (updatedStrategies[initIdx].playerIdx === NO_PLAYER ||
        updatedStrategies[initIdx].playerIdx >= 8 ||
        updatedStrategies[initIdx].secondPickPlayerIdx !== undefined ||
        (updatedStrategies[initIdx].status !== STRATEGY_AVAILABLE &&
          updatedStrategies[initIdx].status !== STRATEGY_PLAYED))
    ) {
      initIdx++;
    }
    set({ strategies: updatedStrategies, activeStrategyIdx: initIdx < 9 ? initIdx : 0 });
    get().closeModal();
    get().setPhase(PHASE_ACTION);
  },

  resetStrategyPhase: () => {
    set((s) => ({
      strategies: s.strategies.map((st) => ({
        ...st,
        playerIdx: NO_PLAYER,
        status: st.isNaaluSlot ? STRATEGY_DISABLED : STRATEGY_AVAILABLE,
        secondPickPlayerIdx: undefined,
      })),
      playerChooseCount: 0,
      activeStrategyIdx: 1,
      naaluStrategyIdx: NO_PLAYER,
    }));
  },

  // ── Action phase ───────────────────────────────────────────────────────────

  nextPlayerAction: () => {
    const s = get();
    let idx = s.activeStrategyIdx;
    let safety = 0;
    do {
      idx = (idx + 1) % 9;
      if (idx === 0) {
        set((st) => ({ roundCounter: st.roundCounter + 1 }));
      }
      safety++;
    } while (
      safety < 18 &&
      (s.strategies[idx].playerIdx === NO_PLAYER ||
        s.strategies[idx].playerIdx >= 8 ||
        s.strategies[idx].secondPickPlayerIdx !== undefined ||
        (s.strategies[idx].status !== STRATEGY_AVAILABLE &&
          s.strategies[idx].status !== STRATEGY_PLAYED))
    );

    if (safety >= 18) {
      // All players passed → go to status
      get().setPhase(PHASE_STATUS);
      return;
    }

    set({ activeStrategyIdx: idx, currentPlayerTimer: 0 });
    get().resetDecisionTimer();
    get().setClock(1);
    get().persistGame();
  },

  resolveAction: ({ s1, s2, pass }) => {
    const s = get();
    const idx = s.activeStrategyIdx;
    const playerIdx = s.strategies[idx].playerIdx;
    // Capture before state mutates (for Politics check)
    const politicsPlayed = s1 && idx === 3 && s.strategies[idx].status === STRATEGY_AVAILABLE;

    set((st) => {
      const strategies = [...st.strategies];

      if (s1 && strategies[idx].status === STRATEGY_AVAILABLE) {
        strategies[idx] = { ...strategies[idx], status: STRATEGY_PLAYED };
      }

      if (s2) {
        const secondIdx = strategies.findIndex(
          (st) => st.secondPickPlayerIdx === playerIdx
        );
        if (secondIdx !== -1 && strategies[secondIdx].status === STRATEGY_AVAILABLE) {
          strategies[secondIdx] = { ...strategies[secondIdx], status: STRATEGY_PLAYED };
        }
      }

      if (pass) {
        strategies[idx] = { ...strategies[idx], status: STRATEGY_PASSED };
        if (st.nbPlayers <= 4) {
          const secondIdx = strategies.findIndex(
            (strat) => strat.secondPickPlayerIdx === playerIdx
          );
          if (secondIdx !== -1) {
            strategies[secondIdx] = { ...strategies[secondIdx], status: STRATEGY_PASSED };
          }
        }
      }

      // Save player clock
      const players = [...st.players];
      if (playerIdx < 8) {
        players[playerIdx] = {
          ...players[playerIdx],
          clock: players[playerIdx].clock + st.currentPlayerTimer,
        };
      }

      return { strategies, players, currentPlayerTimer: 0 };
    });

    get().nextPlayerAction();
    // Politics card: let the current active player choose the new speaker
    if (politicsPlayed) {
      get().openModal('speaker');
    }
  },

  // ── VP ─────────────────────────────────────────────────────────────────────

  incrementVP: (playerIdx, delta) => {
    set((s) => {
      const players = [...s.players];
      const newVP = Math.max(0, players[playerIdx].vp + delta) % (s.options.vpWinGoal + 1);
      players[playerIdx] = { ...players[playerIdx], vp: newVP };
      return { players };
    });
    get().persistGame();
  },

  // ── Status ─────────────────────────────────────────────────────────────────

  setStatusStep: (step) => set({ statusStep: step }),

  setAgendaPhase: (phase) => set({ agendaPhase: phase }),

  // ── Agenda / voting ────────────────────────────────────────────────────────

  newAgenda: () => {
    set((s) => ({
      votes: [],
      votingPlayerIdx: (s.speakerIdx + 1) % s.nbPlayers,
    }));
    get().setPhase(PHASE_AGENDA);
  },

  setVote: (record) => {
    set((s) => {
      const votes = s.votes.filter(
        (v) => !(v.playerIdx === record.playerIdx && v.voteColumnIdx === record.voteColumnIdx)
      );
      return { votes: [...votes, record] };
    });
  },

  clearVote: (playerIdx) => {
    set((s) => ({ votes: s.votes.filter((v) => v.playerIdx !== playerIdx) }));
  },

  nextVotingPlayer: () => {
    set((s) => {
      // Speaker votes last → when speaker just voted, voting is done
      if (s.votingPlayerIdx === s.speakerIdx) {
        return { votingPlayerIdx: NO_PLAYER };
      }
      return { votingPlayerIdx: (s.votingPlayerIdx + 1) % s.nbPlayers };
    });
  },

  advanceAgendaStep: () => {
    const s = get();
    if (s.agendaStep === 1) {
      set({
        agendaStep: 2,
        votes: [],
        votingPlayerIdx: (s.speakerIdx + 1) % s.nbPlayers,
        agendaStage: 'type_select',
        agendaVoteType: null,
        agendaColumns: [],
      });
    } else {
      // Both agendas done → new turn
      set({
        agendaStep: 1,
        agendaStage: 'type_select',
        agendaVoteType: null,
        agendaColumns: [],
      });
      get().newTurn();
    }
  },

  setAgendaStage: (stage) => set({ agendaStage: stage }),
  setAgendaVoteType: (type) => set({ agendaVoteType: type }),
  setAgendaColumns: (cols) => set({ agendaColumns: cols }),
  addAgendaColumn: (label) => set((s) => ({ agendaColumns: [...s.agendaColumns, label] })),
  resetAgendaContext: () => set({
    agendaStage: 'type_select',
    agendaVoteType: null,
    agendaColumns: [],
  }),

  // ── Public objectives ──────────────────────────────────────────────────────

  initializePublicObjectives: () => {
    const shuffle = <T,>(arr: readonly T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };
    const s1 = shuffle(STAGE_I_OBJECTIVES).slice(0, 5).map((o) => o.id);
    const s2 = shuffle(STAGE_II_OBJECTIVES).slice(0, 5).map((o) => o.id);
    set({ objectiveDeck: [...s1, ...s2], revealedCount: 2, objectivesScoredBy: {} });
  },

  revealNextObjective: () => {
    set((s) => ({ revealedCount: Math.min(s.revealedCount + 1, 10) }));
  },

  scoreObjective: (objectiveId, playerIdx) => {
    set((s) => {
      const obj = OBJECTIVES_BY_ID[objectiveId];
      if (!obj) return {};
      const current = s.objectivesScoredBy[objectiveId] ?? [];
      if (current.includes(playerIdx)) return {};
      const players = [...s.players];
      players[playerIdx] = { ...players[playerIdx], vp: players[playerIdx].vp + obj.points };
      return {
        players,
        objectivesScoredBy: {
          ...s.objectivesScoredBy,
          [objectiveId]: [...current, playerIdx],
        },
      };
    });
    get().persistGame();
  },

  unscoreObjective: (objectiveId, playerIdx) => {
    set((s) => {
      const obj = OBJECTIVES_BY_ID[objectiveId];
      if (!obj) return {};
      const current = s.objectivesScoredBy[objectiveId] ?? [];
      if (!current.includes(playerIdx)) return {};
      const players = [...s.players];
      players[playerIdx] = {
        ...players[playerIdx],
        vp: Math.max(0, players[playerIdx].vp - obj.points),
      };
      const remaining = current.filter((p) => p !== playerIdx);
      const nextScoredBy = { ...s.objectivesScoredBy };
      if (remaining.length === 0) {
        delete nextScoredBy[objectiveId];
      } else {
        nextScoredBy[objectiveId] = remaining;
      }
      return { players, objectivesScoredBy: nextScoredBy };
    });
    get().persistGame();
  },

  researchTech: (playerIdx, techId) => {
    set((s) => {
      const tech = TECH_BY_ID[techId];
      if (!tech) return {};
      const current = s.researchedTechs[playerIdx] ?? [];
      if (current.includes(techId)) return {};
      // Enforce same-color prereqs (level N requires N already-researched of same color)
      if (!canResearch(current, tech)) return {};
      return {
        researchedTechs: {
          ...s.researchedTechs,
          [playerIdx]: [...current, techId],
        },
      };
    });
    get().persistGame();
  },

  unresearchTech: (playerIdx, techId) => {
    set((s) => {
      const current = s.researchedTechs[playerIdx] ?? [];
      if (!current.includes(techId)) return {};
      const remaining = current.filter((id) => id !== techId);
      const next = { ...s.researchedTechs };
      if (remaining.length === 0) {
        delete next[playerIdx];
      } else {
        next[playerIdx] = remaining;
      }
      // Also clear it from the exhausted list if present
      const currentExh = s.exhaustedTechs[playerIdx] ?? [];
      let nextExh = s.exhaustedTechs;
      if (currentExh.includes(techId)) {
        const remainingExh = currentExh.filter((id) => id !== techId);
        nextExh = { ...s.exhaustedTechs };
        if (remainingExh.length === 0) {
          delete nextExh[playerIdx];
        } else {
          nextExh[playerIdx] = remainingExh;
        }
      }
      return { researchedTechs: next, exhaustedTechs: nextExh };
    });
    get().persistGame();
  },

  exhaustTech: (playerIdx, techId) => {
    set((s) => {
      // Must be researched to exhaust
      const researched = s.researchedTechs[playerIdx] ?? [];
      if (!researched.includes(techId)) return {};
      const current = s.exhaustedTechs[playerIdx] ?? [];
      if (current.includes(techId)) return {};
      return {
        exhaustedTechs: {
          ...s.exhaustedTechs,
          [playerIdx]: [...current, techId],
        },
      };
    });
    get().persistGame();
  },

  readyTech: (playerIdx, techId) => {
    set((s) => {
      const current = s.exhaustedTechs[playerIdx] ?? [];
      if (!current.includes(techId)) return {};
      const remaining = current.filter((id) => id !== techId);
      const next = { ...s.exhaustedTechs };
      if (remaining.length === 0) {
        delete next[playerIdx];
      } else {
        next[playerIdx] = remaining;
      }
      return { exhaustedTechs: next };
    });
    get().persistGame();
  },

  readyAllMyTechs: (playerIdx) => {
    set((s) => {
      if (!(playerIdx in s.exhaustedTechs)) return {};
      const next = { ...s.exhaustedTechs };
      delete next[playerIdx];
      return { exhaustedTechs: next };
    });
    get().persistGame();
  },

  readyAllTechs: () => {
    set((s) => {
      if (Object.keys(s.exhaustedTechs).length === 0) return {};
      return { exhaustedTechs: {} };
    });
    get().persistGame();
  },

  // ── Clock ──────────────────────────────────────────────────────────────────

  tick: () => {
    set((s) => {
      if (s.clockRun !== 1) return {};
      return {
        gameDuration: s.gameDuration + 1,
        currentPlayerTimer: s.currentPlayerTimer + 1,
        decisionTimerRemaining: Math.max(0, s.decisionTimerRemaining - 1),
      };
    });
  },

  setClock: (run) => set({ clockRun: run }),

  resetDecisionTimer: () =>
    set((s) => ({ decisionTimerRemaining: s.options.decisionTimerLimit })),

  updateLastActivity: () => set((s) => ({ lastActivity: s.gameDuration })),

  addPlayerClock: (playerIdx, seconds) =>
    set((s) => {
      const players = [...s.players];
      players[playerIdx] = {
        ...players[playerIdx],
        clock: players[playerIdx].clock + seconds,
      };
      return { players };
    }),

  resetCurrentPlayerTimer: () => set({ currentPlayerTimer: 0 }),

  addInfluence: (playerIdx, amount) =>
    set((s) => {
      const players = [...s.players];
      players[playerIdx] = {
        ...players[playerIdx],
        influence: players[playerIdx].influence + amount,
      };
      return { players };
    }),

  // ── UI ──────────────────────────────────────────────────────────────────────

  setLang: (lang) => {
    set({ lang });
    if (typeof window !== 'undefined') {
      localStorage.setItem('ti4_lang', lang);
    }
  },

  openModal: (modal) => set({ activeModal: modal }),

  closeModal: () => set({ activeModal: null }),

  setOptions: (opts) => set((s) => ({ options: { ...s.options, ...opts } })),

  // ── Sync ────────────────────────────────────────────────────────────────────

  setRoomCode: (code) => set({ roomCode: code }),

  // ── Persistence ─────────────────────────────────────────────────────────────

  hydrateFromSave: (saved) => {
    set({
      nbPlayers: saved.nbPlayers,
      players: saved.players,
      speakerIdx: saved.speakerIdx,
      previousSpeakerIdx: saved.previousSpeakerIdx,
      phase: saved.phase,
      turnCounter: saved.turnCounter,
      roundCounter: saved.roundCounter,
      gameDuration: saved.gameDuration,
      strategies: saved.strategies,
      activeStrategyIdx: saved.activeStrategyIdx,
      playerChooseCount: saved.playerChooseCount,
      naaluStrategyIdx: saved.naaluStrategyIdx,
      telephaticPlayerIdx: saved.telephaticPlayerIdx,
      agendaStep: saved.agendaStep,
      agendaPhase: saved.agendaPhase,
      statusStep: saved.statusStep,
      options: saved.options,
      lang: saved.lang,
      objectiveDeck: saved.objectiveDeck ?? [],
      revealedCount: saved.revealedCount ?? 0,
      objectivesScoredBy: saved.objectivesScoredBy ?? {},
      researchedTechs: saved.researchedTechs ?? {},
      exhaustedTechs: saved.exhaustedTechs ?? {},
      decisionTimerRemaining: saved.options.decisionTimerLimit,
    });
  },

  hydrateFromSync: (synced) => {
    set({
      nbPlayers: synced.nbPlayers,
      players: synced.players,
      speakerIdx: synced.speakerIdx,
      previousSpeakerIdx: synced.previousSpeakerIdx,
      phase: synced.phase,
      turnCounter: synced.turnCounter,
      roundCounter: synced.roundCounter,
      gameDuration: synced.gameDuration,
      strategies: synced.strategies,
      activeStrategyIdx: synced.activeStrategyIdx,
      playerChooseCount: synced.playerChooseCount,
      naaluStrategyIdx: synced.naaluStrategyIdx,
      telephaticPlayerIdx: synced.telephaticPlayerIdx,
      agendaStep: synced.agendaStep,
      agendaPhase: synced.agendaPhase,
      statusStep: synced.statusStep,
      options: synced.options,
      lang: synced.lang,
      votes: synced.votes,
      votingPlayerIdx: synced.votingPlayerIdx,
      clockRun: synced.clockRun,
      currentPlayerTimer: synced.currentPlayerTimer,
      agendaStage: synced.agendaStage ?? 'type_select',
      agendaVoteType: synced.agendaVoteType ?? null,
      agendaColumns: synced.agendaColumns ?? [],
      objectiveDeck: synced.objectiveDeck ?? [],
      revealedCount: synced.revealedCount ?? 0,
      objectivesScoredBy: synced.objectivesScoredBy ?? {},
      researchedTechs: synced.researchedTechs ?? {},
      exhaustedTechs: synced.exhaustedTechs ?? {},
      decisionTimerRemaining: synced.options.decisionTimerLimit,
    });
  },

  extractSyncState: () => {
    const s = get();
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
      lang: s.lang,
      votes: s.votes,
      votingPlayerIdx: s.votingPlayerIdx,
      clockRun: s.clockRun,
      currentPlayerTimer: s.currentPlayerTimer,
      agendaStage: s.agendaStage,
      agendaVoteType: s.agendaVoteType,
      agendaColumns: s.agendaColumns,
      objectiveDeck: s.objectiveDeck,
      revealedCount: s.revealedCount,
      objectivesScoredBy: s.objectivesScoredBy,
      researchedTechs: s.researchedTechs,
      exhaustedTechs: s.exhaustedTechs,
    };
  },

  persistGame: () => {
    const s = get();
    saveGame({
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
      lang: s.lang,
      objectiveDeck: s.objectiveDeck,
      revealedCount: s.revealedCount,
      objectivesScoredBy: s.objectivesScoredBy,
      researchedTechs: s.researchedTechs,
      exhaustedTechs: s.exhaustedTechs,
    });
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function getPhaseName(phase: GamePhase, lang: Lang): string {
  const names: Record<number, { en: string; es: string }> = {
    [PHASE_GALAXY]: { en: 'Galaxy Phase', es: 'Fase de la Galaxia' },
    [PHASE_STRATEGY]: { en: 'Strategy Phase', es: 'Fase de Estrategia' },
    [PHASE_ACTION]: { en: 'Action Phase', es: 'Fase de Acción' },
    [PHASE_STATUS]: { en: 'Status Phase', es: 'Fase de Estado' },
    [PHASE_AGENDA]: { en: 'Agenda Phase', es: 'Fase de Consejo Galáctico' },
    [PHASE_END]: { en: 'Game ends', es: 'Fin del Juego' },
  };
  return names[phase]?.[lang] ?? '';
}

function markSecondPicks(strategies: StrategyEntry[], nbPlayers: number): StrategyEntry[] {
  if (nbPlayers > 4) return strategies;
  // For ≤4 players, each player has 2 strategies; mark the second one
  const playerCounts: Record<number, number[]> = {};
  strategies.forEach((st, i) => {
    if (st.playerIdx !== NO_PLAYER && st.playerIdx < 8) {
      if (!playerCounts[st.playerIdx]) playerCounts[st.playerIdx] = [];
      playerCounts[st.playerIdx].push(i);
    }
  });
  const result = [...strategies];
  Object.entries(playerCounts).forEach(([playerStr, indices]) => {
    if (indices.length >= 2) {
      const playerIdx = Number(playerStr);
      // Second strategy (higher index) gets the secondPickPlayerIdx marker
      result[indices[1]] = { ...result[indices[1]], secondPickPlayerIdx: playerIdx };
    }
  });
  return result;
}
