'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import {
  NO_PLAYER,
  STRATEGY_PLAYED,
  STRATEGY_PASSED,
  STRATEGY_DISABLED,
  PHASE_ACTION,
} from '@/lib/constants';

export default function MobileStrategiesStrip() {
  const phase = useGameStore((s) => s.phase);
  const players = useGameStore((s) => s.players);
  const strategies = useGameStore((s) => s.strategies);
  const activeStrategyIdx = useGameStore((s) => s.activeStrategyIdx);

  return (
    <div className="border-b border-gray-800 bg-black/40">
      <div className="flex gap-1.5 overflow-x-auto px-2 py-2 scrollbar-hide">
        {strategies.slice(1).map((st, i) => {
          const stratIdx = i + 1;
          if (st.status === STRATEGY_DISABLED) return null;
          const isPlayed = st.status === STRATEGY_PLAYED;
          const isPassed = st.status === STRATEGY_PASSED;
          const isAssigned = st.playerIdx !== NO_PLAYER && st.playerIdx < 8;
          const isActive = phase === PHASE_ACTION && stratIdx === activeStrategyIdx;
          const player = isAssigned ? players[st.playerIdx] : null;
          const faction = player ? FACTIONS[player.faction] : null;
          const playerColor = player
            ? PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]]
            : undefined;
          const stratName = st.nameEs;

          return (
            <div
              key={stratIdx}
              className={`flex-shrink-0 w-14 rounded border-2 flex flex-col items-center justify-center py-1.5 px-1 ${
                isActive ? 'ring-2 ring-white shadow-lg' : ''
              } ${isPlayed ? 'opacity-40' : ''} ${isPassed ? 'opacity-30' : ''}`}
              style={{
                borderColor: playerColor ?? st.color,
                background: `linear-gradient(180deg, ${st.color}30 0%, ${st.color}10 100%)`,
              }}
              title={stratName}
            >
              <span
                className={`text-lg font-bold leading-none ${isPlayed ? 'line-through' : ''}`}
                style={{ fontFamily: 'var(--font-audiowide)', color: st.color }}
              >
                {stratIdx}
              </span>
              {faction ? (
                <div className="w-6 h-6 relative mt-1">
                  <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                </div>
              ) : (
                <div className="w-6 h-6 mt-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
