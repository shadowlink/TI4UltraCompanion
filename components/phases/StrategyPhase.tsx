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
import Panel from '@/components/ui/Panel';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import {
  Zap,
  Brain,
  RefreshCw,
  Crown,
  Check,
  ArrowRight,
  RotateCcw,
} from '@/components/ui/icons';

export default function StrategyPhase() {
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const strategies = useGameStore((s) => s.strategies);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const playerChooseCount = useGameStore((s) => s.playerChooseCount);
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
          className="text-2xl text-[color:var(--accent-soft)] text-shadow"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {`Ronda ${turnCounter} — Fase de Estrategia`}
        </h2>
        <div className="flex gap-2">
          <Button onClick={resetStrategyPhase} variant="ghost" size="sm" icon={RotateCcw}>
            {'Reiniciar'}
          </Button>
          {allPicked && !swapMode && (
            <Button onClick={endStrategyPhase} variant="primary" size="sm" icon={Zap}>
              {'Efectos de Fase'}
            </Button>
          )}
        </div>
      </div>

      {/* Picker box — always mounted to avoid layout jump when selection completes */}
      <Panel
        variant={allPicked ? 'surface' : 'accent'}
        className="flex items-center gap-4 p-4 transition-colors"
      >
        {!allPicked && currentFaction && currentPicker ? (
          <>
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
                {currentFaction.nameEs} ({currentPicker.name})
              </p>
              <p className="text-base text-[color:var(--accent-soft)]">
                {'selecciona tu Estrategia'}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Zap size={32} className="text-[color:var(--accent-soft)]" strokeWidth={2} aria-hidden />
            <div>
              <p
                className="text-xl text-white"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                {'Selección completa'}
              </p>
              <p className="text-sm text-[color:var(--text-secondary)]">
                {'Continúa con los efectos de fase.'}
              </p>
            </div>
          </div>
        )}
      </Panel>

      {/* Swap mode banner */}
      {swapMode && (
        <div className="flex items-center justify-between px-3 py-2 rounded-[var(--radius)] border border-[color:var(--info)]/40 bg-[color:var(--info)]/10">
          <p className="text-sm text-[color:var(--info)]">
            {swapFirstIdx !== null
              ? 'Selecciona la segunda carta para intercambiar'
              : 'Selecciona la primera carta para intercambiar'}
          </p>
          <Button
            onClick={() => {
              setSwapMode(false);
              setSwapFirstIdx(null);
              openModal('strategyEnd');
            }}
            variant="secondary"
            size="sm"
          >
            {'Hecho'}
          </Button>
        </div>
      )}

      {/* Strategy grid (slots 1-8) */}
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {strategies.slice(1).map((st, i) => {
          const stratIdx = i + 1;
          const isSwapFirst = swapMode && swapFirstIdx === stratIdx;
          const isSwappable = swapMode && st.playerIdx !== NO_PLAYER && st.playerIdx < 8;
          return (
            <div
              key={stratIdx}
              className={isSwapFirst ? 'ring-2 ring-[color:var(--info)] rounded-[var(--radius)]' : ''}
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
        <Button onClick={() => openModal('speaker')} variant="warning" size="md" icon={Crown} className="mt-2 self-start">
          {'Seleccionar Portavoz'}
        </Button>
      )}

      {activeModal === 'speaker' && <SpeakerModal />}

      {/* End Phase Effects modal */}
      <Modal
        open={activeModal === 'strategyEnd'}
        onClose={closeModal}
        title="Efectos de Fin de Fase"
      >
        <div className="px-5 py-4 flex flex-col gap-3">
          {naaluInGame && (
            <Button
              onClick={() => openModal('naalu')}
              variant="secondary"
              size="md"
              icon={Brain}
              fullWidth
            >
              <span className="flex-1 text-left">{'Naalu Telepática'}</span>
              {telephaticPlayerIdx !== NO_PLAYER && (
                <span className="inline-flex items-center gap-1 text-xs text-[color:var(--success)] normal-case">
                  <Check size={12} strokeWidth={2} aria-hidden />
                  {FACTIONS[players[telephaticPlayerIdx].faction].nameEs}
                </span>
              )}
            </Button>
          )}
          {swapInGame && (
            <Button
              onClick={() => {
                closeModal();
                setSwapMode(true);
                setSwapFirstIdx(null);
              }}
              variant="secondary"
              size="md"
              icon={RefreshCw}
              fullWidth
            >
              {'Intercambiar Estrategias'}
            </Button>
          )}
          {!naaluInGame && !swapInGame && (
            <p className="text-sm text-[color:var(--text-muted)] text-center py-2">
              {'No hay efectos especiales disponibles.'}
            </p>
          )}
        </div>
        <div className="px-5 py-3 border-t border-[color:var(--accent-border-faint)] flex justify-end">
          <Button onClick={finalizeStrategyPhase} variant="primary" size="md" icon={ArrowRight} iconPosition="right">
            {'Iniciar Fase de Acción'}
          </Button>
        </div>
      </Modal>

      {/* Naalu Telepathic target picker */}
      <Modal
        open={activeModal === 'naalu'}
        onClose={() => openModal('strategyEnd')}
        title="Telepática: Elegir Objetivo"
      >
        <div className="px-5 pt-3 pb-2">
          <p className="text-xs text-[color:var(--text-muted)]">
            {'El jugador elegido actuará con iniciativa 0'}
          </p>
        </div>
        <div className="px-5 pb-4 flex flex-col gap-2">
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
                className={`flex items-center gap-3 p-2.5 rounded-[var(--radius)] border text-left transition-all pointer-events-auto ${
                  isSelected
                    ? 'border-[color:var(--accent-border-strong)] bg-[color:var(--accent)]/15'
                    : 'border-white/8 hover:border-[color:var(--accent-border)] hover:bg-white/5'
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
                  <p className="text-sm text-white truncate">{faction.nameEs}</p>
                  <p className="text-xs text-[color:var(--text-muted)] truncate">{playerStrat.nameEs}</p>
                </div>
                {isSelected && (
                  <Check size={16} className="text-[color:var(--accent-soft)]" strokeWidth={2} aria-hidden />
                )}
              </button>
            );
          })}
        </div>
        <div className="px-5 py-3 border-t border-[color:var(--accent-border-faint)] flex justify-end">
          <Button onClick={() => openModal('strategyEnd')} variant="ghost" size="md">
            {'Cancelar'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
