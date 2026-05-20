'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { NO_PLAYER, STRATEGY_PLAYED, STRATEGY_PASSED, STRATEGY_DISABLED } from '@/lib/constants';
import { Check, RefreshCw } from '@/components/ui/icons';
import { getStrategyActions } from '@/data/strategyActions';
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
  stratIdx: _stratIdx,
  rank,
  isActive = false,
  isCurrent = false,
  isHighlighted = false,
  onClick,
  showTG = true,
  size = 'md',
}: StrategyCardProps) {
  void _stratIdx;
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

  const cardName = strategy.nameEs;
  const cardColor = strategy.color;
  const actions = getStrategyActions(strategy.nameEn);

  if (size === 'sm') {
    return (
      <div
        onClick={!isDisabled ? onClick : undefined}
        className={`
          flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius)] border transition-all select-none
          ${isDisabled ? 'opacity-20 cursor-not-allowed border-white/8' : 'cursor-pointer pointer-events-auto'}
          ${isCurrent ? 'ring-2 ring-[color:var(--accent)] bg-[color:var(--accent)]/10' : ''}
          ${isActive && !isCurrent ? 'bg-white/5' : ''}
          ${!isDisabled && !isCurrent ? 'hover:bg-white/5' : ''}
          ${isPlayed ? 'opacity-50' : ''}
          ${isPassed ? 'opacity-30' : ''}
        `}
        style={{ borderColor: playerColorValue ?? cardColor, borderWidth: isCurrent ? 2 : 1 }}
      >
        <span
          className="text-xl font-bold leading-none flex-shrink-0"
          style={{ fontFamily: 'var(--font-share-tech-mono)', color: cardColor }}
        >
          {rank}
        </span>
        {faction && (
          <div className="w-9 h-9 relative flex-shrink-0">
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
              className="text-[11px] block truncate"
              style={{ color: playerColorValue, fontFamily: 'var(--font-aldrich)' }}
            >
              {faction?.shortName}{assignedPlayer.name ? ` (${assignedPlayer.name})` : ''}
            </span>
          )}
        </div>
        {isPlayed && <Check size={14} className="text-[color:var(--text-muted)] flex-shrink-0" strokeWidth={2} aria-label="Jugada" />}
        {isPassed && <RefreshCw size={14} className="text-[color:var(--text-muted)] flex-shrink-0" strokeWidth={2} aria-label="Pasada" />}
      </div>
    );
  }

  return (
    <div
      onClick={!isDisabled ? onClick : undefined}
      className={`
        relative flex flex-col h-full rounded-[var(--radius-lg)] border-2 transition-all select-none overflow-hidden pointer-events-auto
        ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
        ${isCurrent ? 'ring-2 ring-white/70 scale-[1.02]' : ''}
        ${isHighlighted && !isCurrent ? 'ring-1 ring-[color:var(--info)]/60' : ''}
        ${!isDisabled && !isCurrent ? 'hover:brightness-110' : ''}
        ${isPlayed ? 'opacity-60 grayscale-[30%]' : ''}
        ${isPassed ? 'opacity-40 grayscale-[50%]' : ''}
      `}
      style={{
        borderColor: isCurrent ? 'white' : cardColor,
        background: `linear-gradient(180deg, ${cardColor}22 0%, ${cardColor}08 40%, rgba(0,0,0,0.65) 100%)`,
        boxShadow: isCurrent
          ? `0 0 20px ${cardColor}80, inset 0 0 30px ${cardColor}15`
          : isAssigned
          ? `inset 0 0 20px ${cardColor}10`
          : `inset 0 0 15px ${cardColor}08`,
      }}
    >
      {/* Rank — large background watermark */}
      <span
        className="absolute top-1 right-3 text-6xl font-bold leading-none pointer-events-none"
        style={{ fontFamily: 'var(--font-audiowide)', color: cardColor, opacity: 0.5 }}
      >
        {rank}
      </span>

      {/* Header — heights are reserved so all cards in a row stay aligned */}
      <div className="flex flex-col items-center pt-3 px-3 z-10">
        {/* Avatar — fixed 64px tall regardless of content */}
        <div className="w-16 h-16 relative flex items-center justify-center">
          {faction ? (
            <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain drop-shadow-lg" unoptimized />
          ) : (
            <span
              className="text-5xl font-bold leading-none"
              style={{ fontFamily: 'var(--font-audiowide)', color: cardColor }}
            >
              {rank}
            </span>
          )}
        </div>

        {/* Strategy name */}
        <span
          className={`text-lg font-semibold text-center text-shadow leading-tight mt-1.5 ${isPlayed ? 'line-through' : ''}`}
          style={{ fontFamily: 'var(--font-electrolize)', color: 'white' }}
        >
          {cardName}
        </span>

        {/* Player line — always reserved */}
        <span
          className="text-sm text-center mt-0.5 truncate max-w-full min-h-[1.25rem] leading-tight"
          style={{
            color: assignedPlayer ? playerColorValue : 'transparent',
            fontFamily: 'var(--font-aldrich)',
          }}
        >
          {assignedPlayer
            ? `${faction?.shortName}${assignedPlayer.name ? ` (${assignedPlayer.name})` : ''}`
            : ' '}
        </span>

        {/* BC line — always reserved */}
        <span
          className="text-base font-bold mt-1 text-center min-h-[1.25rem] leading-tight"
          style={{
            color: showTG && strategy.tradeGoods > 0 ? 'var(--vp-gold)' : 'transparent',
            fontFamily: 'var(--font-share-tech-mono)',
          }}
        >
          {showTG && strategy.tradeGoods > 0 ? `+${strategy.tradeGoods} BC` : ' '}
        </span>
      </div>

      {/* Action texts */}
      {actions && (
        <div className="px-3 pt-3 pb-3 mt-2 flex-1 flex flex-col gap-2 z-10 border-t border-white/10 bg-black/30">
          <div>
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: cardColor, fontFamily: 'var(--font-aldrich)' }}
            >
              {'Principal'}
            </span>
            <p
              className="text-[13px] text-[color:var(--text-secondary)] leading-snug mt-0.5"
              style={{ fontFamily: 'var(--font-electrolize)' }}
            >
              {actions.primaryEs}
            </p>
          </div>
          <div>
            <span
              className="text-xs uppercase tracking-wider text-[color:var(--text-muted)]"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {'Secundaria'}
            </span>
            <p
              className="text-[13px] text-[color:var(--text-secondary)] leading-snug mt-0.5"
              style={{ fontFamily: 'var(--font-electrolize)' }}
            >
              {actions.secondaryEs}
            </p>
          </div>
        </div>
      )}

      {/* Status overlay */}
      {isPlayed && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
          <Check size={48} className="text-white/80" strokeWidth={2} aria-label="Jugada" />
        </div>
      )}
      {isPassed && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
          <span
            className="text-2xl text-[color:var(--text-muted)] uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            Pasada
          </span>
        </div>
      )}
    </div>
  );
}
