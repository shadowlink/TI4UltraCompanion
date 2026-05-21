'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { NO_PLAYER, STRATEGY_PLAYED, STRATEGY_PASSED } from '@/lib/constants';
import type { MobileCommand } from '@/lib/sync/types';

interface Props {
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

export default function MobileActionPhase({ myPlayerIdx, sendCommand }: Props) {
  const players = useGameStore((s) => s.players);
  const strategies = useGameStore((s) => s.strategies);
  const activeStrategyIdx = useGameStore((s) => s.activeStrategyIdx);
  const [busy, setBusy] = useState(false);

  const activeStrat = strategies[activeStrategyIdx];
  const activePlayerIdx =
    activeStrat?.playerIdx !== undefined && activeStrat.playerIdx !== NO_PLAYER && activeStrat.playerIdx < 8
      ? activeStrat.playerIdx
      : NO_PLAYER;
  const activePlayer = activePlayerIdx !== NO_PLAYER ? players[activePlayerIdx] : null;
  const activeFaction = activePlayer ? FACTIONS[activePlayer.faction] : null;
  const activeColor = activePlayer ? PLAYER_COLOR_VALUES[PLAYER_COLORS[activePlayer.color]] : undefined;
  const stratName = activeStrat ? (activeStrat.nameEs) : '';
  const isMyTurn = myPlayerIdx >= 0 && activePlayerIdx === myPlayerIdx;
  const stratIsPlayed = activeStrat?.status === STRATEGY_PLAYED;

  // Pass rules: my strategy card(s) must all be played/passed before I can pass
  const myMainStrategy = strategies.find(
    (st) => st.playerIdx === myPlayerIdx && !st.isNaaluSlot
  );
  const mySecondStrategy = strategies.find(
    (st) => st.secondPickPlayerIdx === myPlayerIdx
  );
  const s1Done = !myMainStrategy ||
    myMainStrategy.status === STRATEGY_PLAYED ||
    myMainStrategy.status === STRATEGY_PASSED;
  const s2Done = !mySecondStrategy ||
    mySecondStrategy.status === STRATEGY_PLAYED ||
    mySecondStrategy.status === STRATEGY_PASSED;
  const canPass = s1Done && s2Done;

  const handleAction = async (action: 'strat1' | 'strat2' | 'tactical' | 'pass') => {
    if (!isMyTurn || busy) return;
    setBusy(true);
    const payload = {
      strat1: { s1: true, s2: false, pass: false },
      strat2: { s1: false, s2: true, pass: false },
      tactical: { s1: false, s2: false, pass: false },
      pass: { s1: false, s2: false, pass: true },
    }[action];
    await sendCommand({ type: 'takeAction', ...payload });
    setBusy(false);
  };

  // Preserve actual strategy slot indices (1-8), filtering passed and unowned slots
  const remainingPlayers = strategies
    .map((st, idx) => ({ strategy: st, slotIdx: idx }))
    .filter(({ strategy, slotIdx }) =>
      slotIdx >= 1 &&
      strategy.playerIdx !== NO_PLAYER &&
      strategy.playerIdx < 8 &&
      strategy.status !== STRATEGY_PASSED,
    );

  return (
    <div className="flex flex-col gap-3 p-3">
      {activeFaction && activePlayer && (
        <div
          className="rounded-lg border-2 p-3 flex flex-col items-center"
          style={{
            borderColor: activeColor,
            background: `linear-gradient(180deg, ${activeColor}22 0%, ${activeColor}08 60%, rgba(0,0,0,0.6) 100%)`,
          }}
        >
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            {isMyTurn ? ('¡Tu turno!') : ('Turno activo')}
          </p>
          <div className="w-20 h-20 relative">
            <Image src={activeFaction.iconPath} alt={activeFaction.shortName} fill className="object-contain" unoptimized />
          </div>
          <p className="text-base text-white mt-2 text-center" style={{ fontFamily: 'var(--font-audiowide)' }}>
            {activeFaction.nameEs}
          </p>
          {activePlayer.name && (
            <p className="text-xs" style={{ color: activeColor, fontFamily: 'var(--font-aldrich)' }}>
              {activePlayer.name}
            </p>
          )}
          {activeStrat && (
            <div
              className="mt-2 px-2 py-1 rounded border flex items-center gap-2"
              style={{ borderColor: activeStrat.color, background: `${activeStrat.color}20` }}
            >
              <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-audiowide)', color: activeStrat.color }}>
                {activeStrategyIdx}
              </span>
              <span className="text-xs text-white">{stratName}</span>
              {stratIsPlayed && <span className="text-xs text-gray-400">✓</span>}
            </div>
          )}
        </div>
      )}

      {/* Action buttons — only for my turn */}
      {isMyTurn && activeStrat && (
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAction('strat1')}
              disabled={busy || s1Done}
              className={`py-3 text-sm rounded border-2 border-blue-500/60 bg-blue-500/15 text-blue-200 active:bg-blue-500/30 disabled:opacity-30 ${!mySecondStrategy ? 'col-span-2' : ''}`}
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {'Estratégica 1'}
            </button>
            {mySecondStrategy && (
              <button
                onClick={() => handleAction('strat2')}
                disabled={busy || s2Done}
                className="py-3 text-sm rounded border-2 border-blue-500/60 bg-blue-500/15 text-blue-200 active:bg-blue-500/30 disabled:opacity-30"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                {'Estratégica 2'}
              </button>
            )}
            <button
              onClick={() => handleAction('tactical')}
              disabled={busy}
              className="py-3 text-sm rounded border-2 border-green-500/60 bg-green-500/15 text-green-200 active:bg-green-500/30 disabled:opacity-30"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {'Táctica'}
            </button>
            <button
              onClick={() => handleAction('pass')}
              disabled={busy || !canPass}
              className="py-3 text-sm rounded border-2 border-red-500/60 bg-red-500/15 text-red-200 active:bg-red-500/30 disabled:opacity-30"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {'Pasar'}
            </button>
          </div>
          {!canPass && (
            <p className="text-[11px] text-gray-500 text-center">
              {'Juega tu(s) carta(s) de estrategia antes de pasar'}
            </p>
          )}
        </div>
      )}

      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 px-1">
          {'Orden de iniciativa'}
        </p>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {remainingPlayers.map(({ strategy, slotIdx }) => {
            const isActive = slotIdx === activeStrategyIdx;
            const player = players[strategy.playerIdx];
            const faction = FACTIONS[player.faction];
            const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
            const isPlayed = strategy.status === STRATEGY_PLAYED;
            return (
              <div
                key={slotIdx}
                className={`flex-shrink-0 flex flex-col items-center px-2 py-1.5 rounded border ${
                  isActive ? 'ring-2 ring-white' : ''
                } ${isPlayed ? 'opacity-40' : ''}`}
                style={{ borderColor: color, background: `${strategy.color}15` }}
              >
                <span className="text-xs font-bold leading-none" style={{ fontFamily: 'var(--font-audiowide)', color: strategy.color }}>
                  {slotIdx}
                </span>
                <div className="w-7 h-7 relative mt-0.5">
                  <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                </div>
              </div>
            );
          })}
          {remainingPlayers.length === 0 && (
            <p className="text-xs text-gray-500 italic">{'Todos pasaron'}</p>
          )}
        </div>
      </div>
    </div>
  );
}
