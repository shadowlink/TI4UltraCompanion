'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { PendingCommand, MobileCommand } from '@/lib/sync/types';
import {
  NO_PLAYER,
  PHASE_STRATEGY,
  PHASE_ACTION,
  PHASE_STATUS,
  PHASE_AGENDA,
  VOTE_PASS,
  STRATEGY_AVAILABLE,
  STRATEGY_PLAYED,
  STRATEGY_PASSED,
} from '@/lib/constants';

function findCurrentPicker(): number {
  const s = useGameStore.getState();
  const pickOrder = Array.from({ length: s.nbPlayers }, (_, i) => (s.speakerIdx + i) % s.nbPlayers);
  const counts: Record<number, number> = {};
  s.strategies.forEach((st) => {
    if (st.playerIdx !== NO_PLAYER && st.playerIdx < 8) {
      counts[st.playerIdx] = (counts[st.playerIdx] ?? 0) + 1;
    }
    if (st.secondPickPlayerIdx !== undefined && st.secondPickPlayerIdx < 8) {
      counts[st.secondPickPlayerIdx] = (counts[st.secondPickPlayerIdx] ?? 0) + 1;
    }
  });
  const max = s.nbPlayers <= 4 ? 2 : 1;
  return pickOrder.find((idx) => (counts[idx] ?? 0) < max) ?? NO_PLAYER;
}

function findPlayerIdxOfFaction(factionIdx: number): number {
  const s = useGameStore.getState();
  return s.players.slice(0, s.nbPlayers).findIndex((p) => p.faction === factionIdx);
}

function processCommand(cmd: PendingCommand): void {
  const store = useGameStore.getState();
  const playerIdx = findPlayerIdxOfFaction(cmd.factionIdx);
  if (playerIdx < 0) return;

  switch (cmd.command.type) {
    case 'pickStrategy': {
      if (store.phase !== PHASE_STRATEGY) return;
      if (findCurrentPicker() !== playerIdx) return;
      const strat = store.strategies[cmd.command.stratIdx];
      if (!strat || strat.status !== STRATEGY_AVAILABLE || strat.isNaaluSlot) return;
      store.assignStrategy(cmd.command.stratIdx, playerIdx);
      return;
    }
    case 'takeAction': {
      if (store.phase !== PHASE_ACTION) return;
      const activeStrat = store.strategies[store.activeStrategyIdx];
      if (!activeStrat || activeStrat.playerIdx !== playerIdx) return;
      const { s1, s2, pass } = cmd.command;
      if (pass) {
        // Same rule as host: must have played all my strategy cards before passing
        const myMain = store.strategies.find(
          (st) => st.playerIdx === playerIdx && !st.isNaaluSlot
        );
        const mySecond = store.strategies.find(
          (st) => st.secondPickPlayerIdx === playerIdx
        );
        const mainDone = !myMain ||
          myMain.status === STRATEGY_PLAYED ||
          myMain.status === STRATEGY_PASSED;
        const secondDone = !mySecond ||
          mySecond.status === STRATEGY_PLAYED ||
          mySecond.status === STRATEGY_PASSED;
        if (!mainDone || !secondDone) return; // silently reject
      }
      store.resolveAction({ s1, s2, pass });
      return;
    }
    case 'incrementVP': {
      if (store.phase !== PHASE_STATUS && store.phase !== PHASE_ACTION) return;
      const delta = cmd.command.delta;
      if (delta !== 1 && delta !== -1) return;
      store.incrementVP(playerIdx, delta);
      return;
    }
    case 'castVote': {
      if (store.phase !== PHASE_AGENDA) return;
      if (store.votingPlayerIdx !== playerIdx) return;
      const { voteColumnIdx, amount } = cmd.command;
      if (amount < 0) return;
      store.setVote({ playerIdx, voteColumnIdx, influenceAmount: amount });
      if (amount > 0) store.addInfluence(playerIdx, amount);
      store.nextVotingPlayer();
      return;
    }
    case 'abstain': {
      if (store.phase !== PHASE_AGENDA) return;
      if (store.votingPlayerIdx !== playerIdx) return;
      store.setVote({ playerIdx, voteColumnIdx: VOTE_PASS, influenceAmount: null });
      store.nextVotingPlayer();
      return;
    }
    case 'scoreObjective': {
      const { objectiveId } = cmd.command;
      // Must be revealed (its position in the deck < revealedCount)
      const deckIdx = store.objectiveDeck.indexOf(objectiveId);
      if (deckIdx < 0 || deckIdx >= store.revealedCount) return;
      store.scoreObjective(objectiveId, playerIdx);
      return;
    }
    case 'unscoreObjective': {
      const { objectiveId } = cmd.command;
      const deckIdx = store.objectiveDeck.indexOf(objectiveId);
      if (deckIdx < 0 || deckIdx >= store.revealedCount) return;
      store.unscoreObjective(objectiveId, playerIdx);
      return;
    }
    case 'researchTech': {
      store.researchTech(playerIdx, cmd.command.techId);
      return;
    }
    case 'unresearchTech': {
      store.unresearchTech(playerIdx, cmd.command.techId);
      return;
    }
    case 'exhaustTech': {
      store.exhaustTech(playerIdx, cmd.command.techId);
      return;
    }
    case 'readyTech': {
      store.readyTech(playerIdx, cmd.command.techId);
      return;
    }
    case 'readyAllMyTechs': {
      store.readyAllMyTechs(playerIdx);
      return;
    }
  }
}

export function useCommandProcessor(roomCode: string | null, pushNow?: () => void) {
  const inFlightRef = useRef(false);
  const pushNowRef = useRef(pushNow);
  pushNowRef.current = pushNow;

  useEffect(() => {
    if (!roomCode) return;
    let active = true;

    const poll = async () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      try {
        const res = await fetch(`/api/room/${roomCode}/commands?t=${Date.now()}`);
        if (!active) return;
        if (!res.ok) return;
        const body: { commands: PendingCommand[] } = await res.json();
        const commands = body.commands ?? [];
        for (const cmd of commands) {
          processCommand(cmd);
        }
        // Force immediate push after applying commands so mobiles see results ASAP
        if (commands.length > 0 && pushNowRef.current) {
          pushNowRef.current();
        }
      } catch { /* ignore */ }
      finally {
        inFlightRef.current = false;
      }
    };

    const id = setInterval(poll, 200);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [roomCode]);
}
