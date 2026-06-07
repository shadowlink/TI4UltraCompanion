'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { PendingCommand, MobileCommand } from '@/lib/sync/types';
import {
  AI_DEV_ALGORITHM_ID,
  TECH_BY_ID,
  missingPrereqCount,
} from '@/data/technologies';
import {
  JOL_NAR_FACTION,
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
  // Los jugadores abandonados no eligen carta; excluirlos (igual que StrategyPhase)
  // para que no bloqueen el turno de selección ni el rechazo de pickStrategy.
  const pickOrder = Array.from({ length: s.nbPlayers }, (_, i) => (s.speakerIdx + i) % s.nbPlayers)
    .filter((idx) => !s.players[idx]?.abandoned);
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

/** true si estamos en Fase de Acción y es el turno de acción de este jugador. */
function isActiveStrategyPlayer(
  store: ReturnType<typeof useGameStore.getState>,
  playerIdx: number,
): boolean {
  if (store.phase !== PHASE_ACTION) return false;
  return store.strategies[store.activeStrategyIdx]?.playerIdx === playerIdx;
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
    case 'researchTechWithBypass': {
      const { techId, bypassTechId } = cmd.command;
      const tech = TECH_BY_ID[techId];
      if (!tech || tech.category !== 'unitUpgrade') return;
      // Bypass must be AI Dev Algorithm, researched and not exhausted by this player
      if (bypassTechId !== AI_DEV_ALGORITHM_ID) return;
      const owned = store.researchedTechs[playerIdx] ?? [];
      if (!owned.includes(bypassTechId)) return;
      const exhausted = store.exhaustedTechs[playerIdx] ?? [];
      if (exhausted.includes(bypassTechId)) return;
      // Must be missing exactly 1 prereq to use the bypass
      if (missingPrereqCount(owned, tech) !== 1) return;
      // Apply: exhaust AI Dev + force research
      store.exhaustTech(playerIdx, bypassTechId);
      store.forceResearchTech(playerIdx, techId);
      return;
    }
    case 'researchTechAnalytical': {
      // Jol-Nar "MENTE ANALÍTICA": ignore 1 prereq when researching a non-unit-upgrade tech.
      const player = store.players[playerIdx];
      if (!player || player.faction !== JOL_NAR_FACTION) return;
      const tech = TECH_BY_ID[cmd.command.techId];
      if (!tech || tech.category === 'unitUpgrade') return;
      const owned = store.researchedTechs[playerIdx] ?? [];
      if (owned.includes(cmd.command.techId)) return;
      // Must be missing exactly 1 prereq for the ability to enable the research.
      if (missingPrereqCount(owned, tech) !== 1) return;
      store.forceResearchTech(playerIdx, cmd.command.techId);
      return;
    }
    case 'researchTechOverride': {
      // Override manual: el jugador declara un recurso no rastreado (especialidad
      // de planeta, nota de promesa, reliquia…) que cubre los prerrequisitos que
      // faltan. forceResearchTech ya valida que la tech existe y no está investigada.
      const tech = TECH_BY_ID[cmd.command.techId];
      if (!tech) return;
      const owned = store.researchedTechs[playerIdx] ?? [];
      if (owned.includes(cmd.command.techId)) return;
      store.forceResearchTech(playerIdx, cmd.command.techId);
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
    case 'adjustTokens': {
      const { pool, delta } = cmd.command;
      if (delta !== 1 && delta !== -1) return;
      if (pool !== 'tactic' && pool !== 'fleet' && pool !== 'strategy') return;
      store.adjustTokens(playerIdx, pool, delta);
      return;
    }
    case 'adjustCommodities': {
      const { delta } = cmd.command;
      if (delta !== 1 && delta !== -1) return;
      store.adjustCommodities(playerIdx, delta);
      return;
    }
    case 'adjustTradeGoods': {
      const { delta } = cmd.command;
      if (delta !== 1 && delta !== -1) return;
      store.adjustTradeGoods(playerIdx, delta);
      return;
    }

    // ── Acciones rápidas del ayudante de estrategia ─────────────────────────
    // Solo durante la Fase de Acción y solo el jugador cuyo turno está activo.
    case 'gainTokens': {
      if (!isActiveStrategyPlayer(store, playerIdx)) return;
      const { pool, amount } = cmd.command;
      if (pool !== 'tactic' && pool !== 'fleet' && pool !== 'strategy') return;
      if (!Number.isInteger(amount) || amount < 1 || amount > 3) return;
      store.adjustTokens(playerIdx, pool, amount);
      return;
    }
    case 'gainTradeGoods': {
      if (!isActiveStrategyPlayer(store, playerIdx)) return;
      const { amount } = cmd.command;
      if (!Number.isInteger(amount) || amount < 1 || amount > 3) return;
      store.adjustTradeGoods(playerIdx, amount);
      return;
    }
    case 'gainCommodities': {
      if (!isActiveStrategyPlayer(store, playerIdx)) return;
      const { amount } = cmd.command;
      if (!Number.isInteger(amount) || amount < 1 || amount > 3) return;
      store.adjustCommodities(playerIdx, amount);
      return;
    }
    case 'replenishCommodities': {
      if (!isActiveStrategyPlayer(store, playerIdx)) return;
      store.replenishCommodities(playerIdx);
      return;
    }
    case 'assimilateTech': {
      const { techId } = cmd.command;
      // Only Nekro Virus (factionIdx 10) can assimilate.
      const player = store.players[playerIdx];
      if (!player || player.faction !== 10) return;
      const tech = TECH_BY_ID[techId];
      if (!tech || tech.factionIdx === undefined) return;
      store.assimilateTech(playerIdx, techId);
      return;
    }
    case 'unassimilateTech': {
      const { techId } = cmd.command;
      const player = store.players[playerIdx];
      if (!player || player.faction !== 10) return;
      store.unassimilateTech(playerIdx, techId);
      return;
    }
    case 'nekroGainTech': {
      const player = store.players[playerIdx];
      if (!player || player.faction !== 10) return;
      store.forceResearchTech(playerIdx, cmd.command.techId);
      return;
    }
    case 'nekroUngainTech': {
      const player = store.players[playerIdx];
      if (!player || player.faction !== 10) return;
      store.unresearchTech(playerIdx, cmd.command.techId);
      return;
    }

    // ── Speaker-only game flow ──────────────────────────────────────────────
    case 'finalizeStrategyPhase': {
      if (store.phase !== PHASE_STRATEGY) return;
      if (playerIdx !== store.speakerIdx) return;
      // Require all players to have picked their cards
      const counts: Record<number, number> = {};
      store.strategies.forEach((st) => {
        if (st.playerIdx !== NO_PLAYER && st.playerIdx < 8) counts[st.playerIdx] = (counts[st.playerIdx] ?? 0) + 1;
        if (st.secondPickPlayerIdx !== undefined && st.secondPickPlayerIdx < 8) counts[st.secondPickPlayerIdx] = (counts[st.secondPickPlayerIdx] ?? 0) + 1;
      });
      const maxPicks = store.nbPlayers <= 4 ? 2 : 1;
      // Excluir abandonados (no eligen carta) y exigir al menos un jugador activo,
      // igual que el guard `allPicked` de StrategyPhase.
      const pickOrder = Array.from({ length: store.nbPlayers }, (_, i) => (store.speakerIdx + i) % store.nbPlayers)
        .filter((idx) => !store.players[idx]?.abandoned);
      if (pickOrder.length === 0) return;
      if (!pickOrder.every((idx) => (counts[idx] ?? 0) >= maxPicks)) return;
      store.finalizeStrategyPhase();
      return;
    }
    case 'startAgenda': {
      if (store.phase !== PHASE_STATUS) return;
      if (playerIdx !== store.speakerIdx) return;
      if (store.revealedCount < store.objectiveDeck.length) store.revealNextObjective();
      store.newAgenda();
      return;
    }
    case 'startNewRound': {
      if (store.phase !== PHASE_STATUS && store.phase !== PHASE_AGENDA) return;
      if (playerIdx !== store.speakerIdx) return;
      if (store.phase === PHASE_STATUS && store.revealedCount < store.objectiveDeck.length) store.revealNextObjective();
      store.newTurn();
      return;
    }
    case 'advanceAgendaStep': {
      if (store.phase !== PHASE_AGENDA) return;
      if (playerIdx !== store.speakerIdx) return;
      store.advanceAgendaStep();
      return;
    }
    case 'setupAgendaVote': {
      if (store.phase !== PHASE_AGENDA) return;
      if (playerIdx !== store.speakerIdx) return;
      store.setAgendaVoteType(cmd.command.voteType);
      store.setAgendaColumns(cmd.command.columns);
      // Igual que el flujo de escritorio (startVoting): limpia votos previos y fija
      // votingPlayerIdx al primer jugador activo tras el portavoz, para que el turno
      // de votación nunca quede obsoleto al iniciar el voto desde el móvil.
      store.resetVoting();
      store.setAgendaStage('voting');
      return;
    }
    case 'setSpeaker': {
      if (playerIdx !== store.speakerIdx) return;
      const newIdx = cmd.command.playerIdx;
      if (newIdx < 0 || newIdx >= store.nbPlayers) return;
      store.setSpeaker(newIdx);
      return;
    }
  }
}

// Sondeo de comandos del anfitrión. Configurable para serverless; ver useSyncViewer.
const HOST_POLL_MS = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_MS) || 200;

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

    const id = setInterval(poll, HOST_POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [roomCode]);
}
