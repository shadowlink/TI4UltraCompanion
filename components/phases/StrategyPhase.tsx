'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLOR_VALUES, PLAYER_COLORS } from '@/data/factions';
import {
  NO_PLAYER,
  STRATEGY_AVAILABLE,
  NAALU_FACTION,
  HACAN_FACTION,
  WINNU_FACTION,
} from '@/lib/constants';
import StrategyCard from '@/components/shared/StrategyCard';
import SpeakerModal from '@/components/shared/SpeakerModal';

export default function StrategyPhase() {
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const strategies = useGameStore((s) => s.strategies);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const playerChooseCount = useGameStore((s) => s.playerChooseCount);
  const naaluStrategyIdx = useGameStore((s) => s.naaluStrategyIdx);
  const telephaticPlayerIdx = useGameStore((s) => s.telephaticPlayerIdx);
  const activeModal = useGameStore((s) => s.activeModal);
  const openModal = useGameStore((s) => s.openModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const assignStrategy = useGameStore((s) => s.assignStrategy);
  const setNaaluTarget = useGameStore((s) => s.setNaaluTarget);
  const swapStrategies = useGameStore((s) => s.swapStrategies);
  const endStrategyPhase = useGameStore((s) => s.endStrategyPhase);
  const finalizeStrategyPhase = useGameStore((s) => s.finalizeStrategyPhase);
  const resetStrategyPhase = useGameStore((s) => s.resetStrategyPhase);

  const [swapMode, setSwapMode] = useState(false);
  const [swapFirstIdx, setSwapFirstIdx] = useState<number | null>(null);

  const activePlayers = players.slice(0, nbPlayers);
  const naaluInGame = activePlayers.some((p) => p.faction === NAALU_FACTION);
  const swapInGame = activePlayers.some(
    (p) => p.faction === HACAN_FACTION || p.faction === WINNU_FACTION
  );

  const picksNeeded = nbPlayers <= 4 ? nbPlayers * 2 : nbPlayers;
  const allPicked = playerChooseCount >= picksNeeded;

  // Determine current picker
  const pickOrder = Array.from({ length: nbPlayers }, (_, i) => (speakerIdx + i) % nbPlayers);
  const playerPickCount: Record<number, number> = {};
  strategies.forEach((st) => {
    if (st.playerIdx !== NO_PLAYER && st.playerIdx < 8) {
      playerPickCount[st.playerIdx] = (playerPickCount[st.playerIdx] ?? 0) + 1;
    }
    if (st.secondPickPlayerIdx !== undefined && st.secondPickPlayerIdx < 8) {
      playerPickCount[st.secondPickPlayerIdx] = (playerPickCount[st.secondPickPlayerIdx] ?? 0) + 1;
    }
  });
  const maxPicksPerPlayer = nbPlayers <= 4 ? 2 : 1;
  const currentPickerIdx =
    pickOrder.find((pIdx) => (playerPickCount[pIdx] ?? 0) < maxPicksPerPlayer) ?? NO_PLAYER;

  const currentPicker = currentPickerIdx !== NO_PLAYER ? players[currentPickerIdx] : null;
  const currentFaction = currentPicker ? FACTIONS[currentPicker.faction] : null;

  const handleCardClick = (stratIdx: number) => {
    if (swapMode) {
      const st = strategies[stratIdx];
      if (st.playerIdx === NO_PLAYER || st.playerIdx >= 8) return;
      if (swapFirstIdx === null) {
        setSwapFirstIdx(stratIdx);
      } else if (swapFirstIdx !== stratIdx) {
        swapStrategies(swapFirstIdx, stratIdx);
        setSwapFirstIdx(null);
        setSwapMode(false);
        openModal('strategyEnd');
      }
      return;
    }
    if (allPicked || currentPickerIdx === NO_PLAYER) return;
    const st = strategies[stratIdx];
    if (st.status !== STRATEGY_AVAILABLE || st.isNaaluSlot) return;
    assignStrategy(stratIdx, currentPickerIdx);
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl text-orange-400 text-shadow"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {`Ronda ${turnCounter} — Fase de Estrategia`}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={resetStrategyPhase}
            className="text-sm px-4 py-2 border border-gray-600 text-gray-400 hover:text-white rounded transition-colors"
          >
            {'Reiniciar'}
          </button>
          {allPicked && !swapMode && (
            <button
              onClick={endStrategyPhase}
              className="text-sm px-4 py-2 border border-orange-500 bg-orange-500/20 text-orange-300 hover:bg-orange-500/40 rounded transition-colors"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {'Efectos de Fase ⚡'}
            </button>
          )}
        </div>
      </div>

      {/* Current picker */}
      {!allPicked && currentFaction && currentPickerIdx !== NO_PLAYER && (
        <div className="flex items-center gap-4 p-4 rounded border border-orange-500/30 bg-orange-500/5">
          <div className="w-20 h-20 relative flex-shrink-0">
            <Image
              src={currentFaction.iconPath}
              alt={currentFaction.shortName}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div>
            <p className="text-2xl text-white text-shadow">
              {currentFaction.nameEs} ({currentPicker!.name})
            </p>
            <p className="text-base text-orange-300">
              {'selecciona tu Estrategia'}
            </p>
          </div>
        </div>
      )}

      {/* Swap mode banner */}
      {swapMode && (
        <div className="flex items-center justify-between px-3 py-2 rounded border border-blue-500/40 bg-blue-500/10">
          <p className="text-sm text-blue-300">
            {swapFirstIdx !== null
              ? 'Selecciona la segunda carta para intercambiar'
              : 'Selecciona la primera carta para intercambiar'}
          </p>
          <button
            onClick={() => {
              setSwapMode(false);
              setSwapFirstIdx(null);
              openModal('strategyEnd');
            }}
            className="text-xs px-3 py-1 border border-blue-500/50 text-blue-300 hover:bg-blue-500/20 rounded"
          >
            {'Hecho'}
          </button>
        </div>
      )}

      {/* Strategy grid (slots 1-8) */}
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {strategies.slice(1).map((st, i) => {
          const stratIdx = i + 1;
          const isSwapFirst = swapMode && swapFirstIdx === stratIdx;
          const isSwappable = swapMode && st.playerIdx !== NO_PLAYER && st.playerIdx < 8;
          return (
            <div
              key={stratIdx}
              className={isSwapFirst ? 'ring-2 ring-blue-400 rounded' : ''}
            >
              <StrategyCard
                strategy={st}
                stratIdx={stratIdx}
                rank={stratIdx}
                isActive={st.playerIdx !== NO_PLAYER}
                isCurrent={st.playerIdx === currentPickerIdx && !allPicked}
                isHighlighted={isSwappable}
                onClick={() => handleCardClick(stratIdx)}
                showTG={true}
                size="md"
              />
            </div>
          );
        })}
      </div>

      {/* Speaker selection if needed (first round) */}
      {turnCounter === 1 && speakerIdx === NO_PLAYER && (
        <button
          onClick={() => openModal('speaker')}
          className="mt-2 px-4 py-2 text-sm border border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10 rounded"
        >
          👑 {'Seleccionar Portavoz'}
        </button>
      )}

      {activeModal === 'speaker' && <SpeakerModal />}

      {/* End Phase Effects modal */}
      {activeModal === 'strategyEnd' && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-gray-900 border border-orange-500/40 rounded-lg w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-gray-700">
              <h2
                className="text-base text-orange-400 text-shadow"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                {'Efectos de Fin de Fase'}
              </h2>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
              {naaluInGame && (
                <button
                  onClick={() => openModal('naalu')}
                  className="w-full py-2.5 text-sm border border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded transition-all flex items-center justify-center gap-2"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  <span>🧠 {'Naalu Telepática'}</span>
                  {telephaticPlayerIdx !== NO_PLAYER && (
                    <span className="text-xs text-green-400">
                      ✓ {FACTIONS[players[telephaticPlayerIdx].faction].nameEs}
                    </span>
                  )}
                </button>
              )}
              {swapInGame && (
                <button
                  onClick={() => {
                    closeModal();
                    setSwapMode(true);
                    setSwapFirstIdx(null);
                  }}
                  className="w-full py-2.5 text-sm border border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 rounded transition-all"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  🔄 {'Intercambiar Estrategias'}
                </button>
              )}
              {!naaluInGame && !swapInGame && (
                <p className="text-sm text-gray-400 text-center py-2">
                  {'No hay efectos especiales disponibles.'}
                </p>
              )}
            </div>
            <div className="px-5 py-3 border-t border-gray-700 flex justify-end">
              <button
                onClick={finalizeStrategyPhase}
                className="px-5 py-2 text-sm border border-orange-500 bg-orange-500/10 hover:bg-orange-500/30 text-orange-300 rounded transition-all"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                {'Iniciar Fase de Acción →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Naalu Telepathic target picker */}
      {activeModal === 'naalu' && (
        <div className="modal-overlay">
          <div className="bg-gray-900 border border-purple-500/40 rounded-lg w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-gray-700">
              <h2
                className="text-base text-purple-400 text-shadow"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                {'Telepática: Elegir Objetivo'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {'El jugador elegido actuará con iniciativa 0'}
              </p>
            </div>
            <div className="px-5 py-4 flex flex-col gap-2 max-h-80 overflow-y-auto">
              {players.slice(0, nbPlayers).map((player, i) => {
                const faction = FACTIONS[player.faction];
                const playerStrat = strategies.find(
                  (st) => st.playerIdx === i && !st.isNaaluSlot
                );
                if (!playerStrat) return null;
                const colorVal = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
                const isSelected = telephaticPlayerIdx === i;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setNaaluTarget(i);
                      openModal('strategyEnd');
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded border text-left transition-all ${
                      isSelected
                        ? 'border-purple-400 bg-purple-500/20'
                        : 'border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/10'
                    }`}
                  >
                    <div
                      className="w-1 self-stretch rounded-full flex-shrink-0"
                      style={{ backgroundColor: colorVal }}
                    />
                    <div className="w-8 h-8 relative flex-shrink-0">
                      <Image
                        src={faction.iconPath}
                        alt={faction.shortName}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {faction.nameEs}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {playerStrat.nameEs}
                      </p>
                    </div>
                    {isSelected && <span className="text-purple-400 text-lg">✓</span>}
                  </button>
                );
              })}
            </div>
            <div className="px-5 py-3 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => openModal('strategyEnd')}
                className="px-5 py-2 text-sm border border-gray-600 text-gray-300 hover:border-white rounded"
              >
                {'Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
