'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { NO_PLAYER, STRATEGY_AVAILABLE, STRATEGY_PLAYED, STRATEGY_PASSED, STRATEGY_DISABLED, STRATEGY_PICKED } from '@/lib/constants';
import type { StrategyEntry } from '@/types/game';

interface StrategyCardProps {
  strategy: StrategyEntry;
  stratIdx: number;
  rank: number;
  isActive?: boolean;
  isCurrent?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
  showTG?: boolean;
  size?: 'sm' | 'md';
}

export default function StrategyCard({
  strategy,
  stratIdx,
  rank,
  isActive = false,
  isCurrent = false,
  isHighlighted = false,
  onClick,
  showTG = true,
  size = 'md',
}: StrategyCardProps) {
  const lang = useGameStore((s) => s.lang);
  const players = useGameStore((s) => s.players);

  const isAssigned = strategy.playerIdx !== NO_PLAYER && strategy.playerIdx < 8;
  const isDisabled = strategy.status === STRATEGY_DISABLED;
  const isPlayed = strategy.status === STRATEGY_PLAYED;
  const isPassed = strategy.status === STRATEGY_PASSED;

  const assignedPlayer = isAssigned ? players[strategy.playerIdx] : null;
  const playerColorValue = assignedPlayer
    ? PLAYER_COLOR_VALUES[PLAYER_COLORS[assignedPlayer.color]]
    : undefined;
  const faction = assignedPlayer ? FACTIONS[assignedPlayer.faction] : null;

  const cardName = lang === 'es' ? strategy.nameEs : strategy.nameEn;
  const cardColor = strategy.color;

  if (size === 'sm') {
    return (
      <div
        onClick={!isDisabled ? onClick : undefined}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded border transition-all select-none
          ${isDisabled ? 'opacity-20 cursor-not-allowed border-gray-700' : 'cursor-pointer'}
          ${isCurrent ? 'ring-2 ring-orange-400 border-orange-400 bg-orange-500/10' : ''}
          ${isActive && !isCurrent ? 'bg-white/5' : ''}
          ${!isDisabled && !isCurrent ? 'hover:bg-white/5 hover:border-orange-500/50' : ''}
          ${isPlayed ? 'opacity-50' : ''}
          ${isPassed ? 'opacity-30' : ''}
        `}
        style={{ borderColor: playerColorValue ?? cardColor, borderWidth: isCurrent ? 2 : 1 }}
      >
        <span
          className="text-xl font-bold leading-none"
          style={{ fontFamily: 'var(--font-share-tech-mono)', color: cardColor }}
        >
          {rank}
        </span>
        {faction && (
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span
            className={`text-sm text-shadow leading-tight block truncate ${isPlayed ? 'line-through' : ''}`}
            style={{ fontFamily: 'var(--font-electrolize)' }}
          >
            {cardName}
          </span>
          {assignedPlayer && (
            <span
              className="text-xs block truncate"
              style={{ color: playerColorValue, fontFamily: 'var(--font-aldrich)' }}
            >
              {faction?.shortName}{assignedPlayer.name ? ` (${assignedPlayer.name})` : ''}
            </span>
          )}
        </div>
        {isPlayed && <span className="text-xs text-gray-500">✓</span>}
        {isPassed && <span className="text-xs text-gray-500">↷</span>}
      </div>
    );
  }

  return (
    <div
      onClick={!isDisabled ? onClick : undefined}
      className={`
        relative flex flex-col items-center justify-center rounded-lg border-2 transition-all select-none overflow-hidden
        ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
        ${isCurrent ? 'ring-2 ring-white/70 scale-[1.03]' : ''}
        ${isHighlighted && !isCurrent ? 'ring-1 ring-blue-400/60' : ''}
        ${!isDisabled && !isCurrent ? 'hover:scale-[1.02] hover:brightness-110' : ''}
        ${isPlayed ? 'opacity-50 grayscale-[30%]' : ''}
        ${isPassed ? 'opacity-30 grayscale-[50%]' : ''}
      `}
      style={{
        borderColor: isCurrent ? 'white' : cardColor,
        background: `linear-gradient(180deg, ${cardColor}22 0%, ${cardColor}08 50%, rgba(0,0,0,0.6) 100%)`,
        boxShadow: isCurrent
          ? `0 0 20px ${cardColor}80, inset 0 0 30px ${cardColor}15`
          : isAssigned
          ? `inset 0 0 20px ${cardColor}10`
          : `inset 0 0 15px ${cardColor}08`,
        minHeight: '200px',
      }}
    >
      {/* Rank — large background watermark */}
      <span
        className="absolute top-1 right-3 text-7xl font-bold leading-none"
        style={{ fontFamily: 'var(--font-audiowide)', color: cardColor, opacity: 0.7 }}
      >
        {rank}
      </span>

      {/* Faction icon or rank as main element */}
      {faction ? (
        <div className="w-20 h-20 relative z-10 mb-2">
          <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain drop-shadow-lg" unoptimized />
        </div>
      ) : (
        <span
          className="text-5xl font-bold z-10 mb-2"
          style={{ fontFamily: 'var(--font-audiowide)', color: cardColor }}
        >
          {rank}
        </span>
      )}

      {/* Strategy name */}
      <span
        className={`text-xl font-semibold text-center text-shadow leading-tight z-10 px-2 ${isPlayed ? 'line-through' : ''}`}
        style={{ fontFamily: 'var(--font-electrolize)', color: 'white' }}
      >
        {cardName}
      </span>

      {/* Assigned player name */}
      {assignedPlayer && (
        <span
          className="text-base text-center z-10 mt-1 truncate max-w-full px-2"
          style={{ color: playerColorValue, fontFamily: 'var(--font-aldrich)' }}
        >
          {faction?.shortName}{assignedPlayer.name ? ` (${assignedPlayer.name})` : ''}
        </span>
      )}

      {/* Trade goods badge */}
      {showTG && strategy.tradeGoods > 0 && (
        <span
          className="text-lg font-bold z-10 mt-1"
          style={{ color: '#ffe41f', fontFamily: 'var(--font-share-tech-mono)' }}
        >
          +{strategy.tradeGoods} TG
        </span>
      )}

      {/* Status overlay */}
      {isPlayed && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30">
          <span className="text-4xl text-gray-400">✓</span>
        </div>
      )}
      {isPassed && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30">
          <span className="text-2xl text-gray-500">PASS</span>
        </div>
      )}

    </div>
  );
}
