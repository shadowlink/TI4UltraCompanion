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

        return (
          <div
            key={i}
            className="flex-1 flex items-center justify-center gap-3 py-2 px-3 border-r border-gray-700/50 last:border-r-0 cursor-pointer select-none hover:bg-white/5 transition-colors"
            style={{ borderBottomWidth: 3, borderBottomColor: colorValue, borderBottomStyle: 'solid' }}
            onClick={() => incrementVP(i, 1)}
            title={`${faction.shortName} — click para añadir VP`}
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
          </div>
        );
      })}
    </div>
  );
}
