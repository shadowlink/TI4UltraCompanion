'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';

export default function VPBar() {
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const showVPBar = useGameStore((s) => s.options.showVPBar);
  const vpWinGoal = useGameStore((s) => s.options.vpWinGoal);
  const incrementVP = useGameStore((s) => s.incrementVP);

  if (!showVPBar) return null;

  return (
    <div
      className="flex items-stretch border-b border-orange-500/30 bg-black/60"
      style={{ minHeight: '88px' }}
    >
      {players.slice(0, nbPlayers).map((player, i) => {
        const faction = FACTIONS[player.faction];
        const colorName = PLAYER_COLORS[player.color];
        const colorValue = PLAYER_COLOR_VALUES[colorName];
        const isSpeaker = speakerIdx === i;
        const isWinner = player.vp >= vpWinGoal;

        const tokens = player.commandTokens ?? { tactic: 0, fleet: 0, strategy: 0 };

        return (
          <div
            key={i}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-2 border-r border-gray-700/50 last:border-r-0 cursor-pointer select-none hover:bg-white/5 transition-colors"
            style={{ borderBottomWidth: 3, borderBottomColor: colorValue, borderBottomStyle: 'solid' }}
            onClick={() => incrementVP(i, 1)}
            title={`${faction.shortName} — Táctica ${tokens.tactic} / Flota ${tokens.fleet} / Estrategia ${tokens.strategy}`}
          >
            {/* Faction icon */}
            <div className="w-14 h-14 relative flex-shrink-0">
              <Image
                src={faction.iconPath}
                alt={faction.shortName}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Name + VP */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                {isSpeaker && <span className="text-base text-yellow-400 leading-none">👑</span>}
                <span
                  className="text-sm text-white text-shadow truncate"
                  style={{ fontFamily: 'var(--font-electrolize)' }}
                >
                  {faction.shortName} ({player.name})
                </span>
              </div>
              <span
                className="text-5xl font-bold leading-none text-shadow"
                style={{
                  fontFamily: 'var(--font-share-tech-mono)',
                  color: isWinner ? '#ffd700' : '#ff6666',
                }}
              >
                {player.vp}
              </span>
            </div>

            {/* Command tokens (Tactic / Fleet / Strategy) */}
            <div className="flex flex-col justify-center gap-0.5 ml-auto flex-shrink-0">
              <div className="flex items-center justify-end gap-1">
                <span className="text-base leading-none" style={{ color: '#f97316' }}>⚔</span>
                <span
                  className="text-sm font-bold text-white leading-none min-w-[14px] text-right"
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  {tokens.tactic}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="#3b82f6"
                  aria-hidden
                  style={{ display: 'block' }}
                >
                  <path d="M8 1 L11.2 11.5 L8 9.3 L4.8 11.5 Z" />
                </svg>
                <span
                  className="text-sm font-bold text-white leading-none min-w-[14px] text-right"
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  {tokens.fleet}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <span className="text-base leading-none" style={{ color: '#10b981' }}>★</span>
                <span
                  className="text-sm font-bold text-white leading-none min-w-[14px] text-right"
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  {tokens.strategy}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
