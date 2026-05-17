'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { NO_PLAYER, STRATEGY_DISABLED, STRATEGY_AVAILABLE, STRATEGY_PICKED } from '@/lib/constants';
import type { MobileCommand } from '@/lib/sync/types';

interface Props {
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

export default function MobileStrategyPhase({ myPlayerIdx, sendCommand }: Props) {
  const lang = useGameStore((s) => s.lang);
  const players = useGameStore((s) => s.players);
  const strategies = useGameStore((s) => s.strategies);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const [busy, setBusy] = useState(false);

  // Determine current picker (same logic as host StrategyPhase)
  const pickOrder = Array.from({ length: nbPlayers }, (_, i) => (speakerIdx + i) % nbPlayers);
  const counts: Record<number, number> = {};
  strategies.forEach((st) => {
    if (st.playerIdx !== NO_PLAYER && st.playerIdx < 8) counts[st.playerIdx] = (counts[st.playerIdx] ?? 0) + 1;
    if (st.secondPickPlayerIdx !== undefined && st.secondPickPlayerIdx < 8) counts[st.secondPickPlayerIdx] = (counts[st.secondPickPlayerIdx] ?? 0) + 1;
  });
  const maxPicks = nbPlayers <= 4 ? 2 : 1;
  const currentPickerIdx = pickOrder.find((idx) => (counts[idx] ?? 0) < maxPicks) ?? NO_PLAYER;
  const isMyTurn = myPlayerIdx >= 0 && currentPickerIdx === myPlayerIdx;

  const handlePick = async (stratIdx: number) => {
    if (!isMyTurn || busy) return;
    setBusy(true);
    await sendCommand({ type: 'pickStrategy', stratIdx });
    setBusy(false);
  };

  return (
    <div className="flex flex-col">
      {isMyTurn && (
        <div className="bg-orange-500/15 border-y border-orange-500/40 px-3 py-2 text-center pointer-events-auto">
          <p className="text-sm text-orange-300" style={{ fontFamily: 'var(--font-audiowide)' }}>
            {lang === 'es' ? '¡Tu turno! Elige una estrategia' : 'Your turn! Pick a strategy'}
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 p-2">
        {strategies.slice(1).map((st, i) => {
          const stratIdx = i + 1;
          if (st.status === STRATEGY_DISABLED) return null;
          const isAvailable = st.status === STRATEGY_AVAILABLE && !st.isNaaluSlot;
          const isAssigned = st.playerIdx !== NO_PLAYER && st.playerIdx < 8;
          const isPicked = st.status === STRATEGY_PICKED;
          const player = isAssigned ? players[st.playerIdx] : null;
          const faction = player ? FACTIONS[player.faction] : null;
          const playerColor = player ? PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]] : undefined;
          const stratName = lang === 'es' ? st.nameEs : st.nameEn;
          const canClick = isMyTurn && isAvailable;

          return (
            <button
              key={stratIdx}
              onClick={() => handlePick(stratIdx)}
              disabled={!canClick || busy}
              className={`relative rounded-lg border-2 p-2 flex flex-col items-center text-left ${
                canClick ? 'pointer-events-auto active:scale-95 ring-2 ring-orange-400/50' : ''
              }`}
              style={{
                borderColor: st.color,
                background: `linear-gradient(180deg, ${st.color}22 0%, ${st.color}08 60%, rgba(0,0,0,0.5) 100%)`,
                minHeight: 130,
              }}
            >
              <span
                className="absolute top-1 right-2 text-3xl font-bold opacity-60 leading-none"
                style={{ fontFamily: 'var(--font-audiowide)', color: st.color }}
              >
                {stratIdx}
              </span>
              {faction ? (
                <div className="w-12 h-12 relative mb-1 z-10">
                  <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                </div>
              ) : (
                <div className="h-12 flex items-center justify-center z-10">
                  <span
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-audiowide)', color: st.color }}
                  >
                    {stratIdx}
                  </span>
                </div>
              )}
              <span className="text-xs text-white text-center leading-tight z-10 mt-0.5" style={{ fontFamily: 'var(--font-electrolize)' }}>
                {stratName}
              </span>
              {player && (
                <span
                  className="text-[10px] text-center truncate max-w-full mt-0.5 z-10"
                  style={{ color: playerColor, fontFamily: 'var(--font-aldrich)' }}
                >
                  {faction?.shortName}{player.name ? ` (${player.name})` : ''}
                </span>
              )}
              {st.tradeGoods > 0 && !isPicked && (
                <span
                  className="text-[10px] font-bold z-10 mt-0.5"
                  style={{ color: '#ffe41f', fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  +{st.tradeGoods} TG
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
