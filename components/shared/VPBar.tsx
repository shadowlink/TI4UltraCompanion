'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { Crown, Swords, Rocket, Star } from '@/components/ui/icons';

export default function VPBar() {
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const showVPBar = useGameStore((s) => s.options.showVPBar);
  const vpWinGoal = useGameStore((s) => s.options.vpWinGoal);
  const incrementVP = useGameStore((s) => s.incrementVP);

  if (!showVPBar) return null;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto border-b border-[color:var(--accent-border-faint)] bg-[var(--bg-surface)]">
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
            className="flex flex-1 items-center gap-2 px-2 py-2 border-b border-white/5 last:border-b-0 cursor-pointer select-none hover:bg-white/5 transition-colors"
            style={{ borderLeftWidth: 3, borderLeftColor: colorValue, borderLeftStyle: 'solid' }}
            onClick={() => incrementVP(i, 1)}
            title={`${faction.shortName} — Táctica ${tokens.tactic} / Flota ${tokens.fleet} / Estrategia ${tokens.strategy}`}
          >
            {/* Faction icon */}
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image
                src={faction.iconPath}
                alt={faction.shortName}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Name + VP */}
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
                  className="text-xs text-white text-shadow truncate"
                  style={{ fontFamily: 'var(--font-electrolize)' }}
                >
                  {faction.shortName}{player.name ? ` (${player.name})` : ''}
                </span>
              </div>
              <span
                className="text-3xl font-bold leading-none text-shadow"
                style={{
                  fontFamily: 'var(--font-share-tech-mono)',
                  color: isWinner ? 'var(--vp-gold)' : 'var(--text-primary)',
                }}
              >
                {player.vp}
              </span>
            </div>

            {/* Command tokens */}
            <div className="flex flex-col justify-center gap-2 flex-shrink-0">
              <div className="flex items-center justify-end gap-1">
                <Swords size={20} className="text-[color:var(--accent)]" strokeWidth={2} aria-hidden />
                <span
                  className="text-xl font-bold text-white leading-none min-w-[22px] text-right"
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  {tokens.tactic}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <Rocket size={20} className="text-[color:var(--info)]" strokeWidth={2} aria-hidden />
                <span
                  className="text-xl font-bold text-white leading-none min-w-[22px] text-right"
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  {tokens.fleet}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <Star size={20} className="text-[color:var(--success)]" strokeWidth={2} aria-hidden />
                <span
                  className="text-xl font-bold text-white leading-none min-w-[22px] text-right"
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
