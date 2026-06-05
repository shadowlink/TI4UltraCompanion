'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { getFactionSheet } from '@/data/factionSheets';
import { useIsViewOnly } from '@/lib/viewOnlyContext';
import { formatTime } from '@/lib/timeUtils';
import { useActiveDecisionPlayer } from '@/hooks/useActiveDecisionPlayer';
import { useVisualEffects } from '@/hooks/useVisualEffects';
import Badge from '@/components/ui/Badge';
import AnimatedVP from '@/components/shared/AnimatedVP';
import { Crown, Swords, Rocket, Star, Timer } from '@/components/ui/icons';

export default function VPBar() {
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const showVPBar = useGameStore((s) => s.options.showVPBar);
  const showFactionClock = useGameStore((s) => s.options.showFactionClock);
  const vpWinGoal = useGameStore((s) => s.options.vpWinGoal);
  const incrementVP = useGameStore((s) => s.incrementVP);
  const activeDecisionIdx = useActiveDecisionPlayer();
  const fx = useVisualEffects();
  const viewOnly = useIsViewOnly();

  if (!showVPBar) return null;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden border-b border-[color:var(--accent-border-faint)] bg-[var(--bg-surface)]">
      {players.slice(0, nbPlayers).map((player, i) => {
        const faction = FACTIONS[player.faction];
        if (!faction) return null;
        const colorName = PLAYER_COLORS[player.color];
        const colorValue = PLAYER_COLOR_VALUES[colorName];
        const isSpeaker = speakerIdx === i;
        const isWinner = player.vp >= vpWinGoal;
        const isAbandoned = player.abandoned;
        const tokens = player.commandTokens ?? { tactic: 0, fleet: 0, strategy: 0 };
        const commodities = player.commodities ?? 0;
        const tradeGoods = player.tradeGoods ?? 0;
        const maxCommodities = getFactionSheet(player.faction)?.commodities ?? 0;
        const isActivePlayer = activeDecisionIdx === i;
        const liveClock = player.clock ?? 0;

        return (
          <div
            key={i}
            className={`relative flex flex-col flex-1 justify-center gap-1.5 px-2.5 py-2 border-b border-white/5 last:border-b-0 select-none transition-colors ${viewOnly ? '' : 'cursor-pointer hover:bg-white/5'} ${isAbandoned ? 'opacity-45 grayscale' : ''} ${isActivePlayer ? `bg-[color:var(--accent)]/10 ring-1 ring-inset ring-[color:var(--accent-border-strong)] ${fx ? 'turn-active' : ''}` : ''}`}
            style={{ borderLeftWidth: 3, borderLeftColor: colorValue, borderLeftStyle: 'solid' }}
            onClick={viewOnly ? undefined : () => incrementVP(i, 1)}
            title={`${faction.shortName}${player.name ? ` (${player.name})` : ''} — Táctica ${tokens.tactic} / Flota ${tokens.fleet} / Estrategia ${tokens.strategy} · Exportaciones ${commodities}${maxCommodities > 0 ? `/${maxCommodities}` : ''} / Mercancías ${tradeGoods}`}
          >
            {/* Top: icon + faction/name + VP */}
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 relative flex-shrink-0">
                <Image
                  src={faction.iconPath}
                  alt={faction.shortName}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  {isSpeaker && (
                    <Crown
                      size={12}
                      className="text-[color:var(--warning)] flex-shrink-0"
                      strokeWidth={2}
                      aria-label="Speaker"
                    />
                  )}
                  <span
                    className="text-[11px] uppercase tracking-wider text-[color:var(--text-secondary)] leading-none truncate"
                    style={{ fontFamily: 'var(--font-aldrich)' }}
                  >
                    {faction.shortName}
                  </span>
                  {isAbandoned && (
                    <Badge tone="danger" size="xs" className="flex-shrink-0">
                      Abandonó
                    </Badge>
                  )}
                  {isActivePlayer && !isAbandoned && (
                    <span
                      className="flex-shrink-0 text-[9px] uppercase tracking-wider px-1 py-0.5 rounded leading-none bg-[color:var(--accent)]/20 text-[color:var(--accent-soft)] border border-[color:var(--accent-border)]"
                      style={{ fontFamily: 'var(--font-aldrich)' }}
                    >
                      En turno
                    </span>
                  )}
                </div>
                {player.name && (
                  <span
                    className="text-lg font-bold text-white text-shadow leading-tight truncate"
                    style={{ fontFamily: 'var(--font-electrolize)' }}
                  >
                    {player.name}
                  </span>
                )}
                {showFactionClock && (
                  <span
                    className={`flex items-center gap-1 text-sm leading-none mt-0.5 ${isActivePlayer ? 'text-[color:var(--accent-soft)] font-bold' : 'text-[color:var(--text-secondary)]'}`}
                    style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                  >
                    <Timer size={13} strokeWidth={2} aria-hidden />
                    {formatTime(liveClock)}
                  </span>
                )}
              </div>

              <AnimatedVP
                value={player.vp}
                className="text-3xl font-bold leading-none text-shadow flex-shrink-0"
                style={{
                  fontFamily: 'var(--font-share-tech-mono)',
                  color: isWinner ? 'var(--vp-gold)' : 'var(--text-primary)',
                }}
              />
            </div>

            {/* Bottom strip: command tokens (left) + economy (right) */}
            <div className="flex items-center gap-2 pl-0.5">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1">
                  <Swords size={15} className="text-[color:var(--accent)]" strokeWidth={2} aria-hidden />
                  <span className="text-sm font-bold text-white leading-none" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{tokens.tactic}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Rocket size={15} className="text-[color:var(--info)]" strokeWidth={2} aria-hidden />
                  <span className="text-sm font-bold text-white leading-none" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{tokens.fleet}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Star size={15} className="text-[color:var(--success)]" strokeWidth={2} aria-hidden />
                  <span className="text-sm font-bold text-white leading-none" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{tokens.strategy}</span>
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2.5">
                <span className="flex items-center gap-1">
                  <span className="text-[10px] uppercase tracking-wider leading-none" style={{ color: '#06b6d4', fontFamily: 'var(--font-aldrich)' }}>Exp</span>
                  <span className="text-sm font-bold text-white leading-none" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                    {commodities}{maxCommodities > 0 && <span className="text-[10px] text-gray-400">/{maxCommodities}</span>}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-[10px] uppercase tracking-wider leading-none" style={{ color: '#fbbf24', fontFamily: 'var(--font-aldrich)' }}>Mer</span>
                  <span className="text-sm font-bold text-white leading-none" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{tradeGoods}</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
