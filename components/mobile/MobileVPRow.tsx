'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';

export default function MobileVPRow() {
  const lang = useGameStore((s) => s.lang);
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const vpGoal = useGameStore((s) => s.options.vpWinGoal);

  return (
    <div className="border-t border-gray-800 bg-black/60">
      <div className="flex gap-1.5 overflow-x-auto px-2 py-2 scrollbar-hide">
        {players.slice(0, nbPlayers).map((p, i) => {
          const faction = FACTIONS[p.faction];
          const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[p.color]];
          const isSpeaker = i === speakerIdx;
          return (
            <div
              key={i}
              className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 rounded border bg-gray-900/60"
              style={{ borderColor: color }}
            >
              <div className="w-5 h-5 relative flex-shrink-0">
                <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] text-gray-400 truncate max-w-[70px]" style={{ color }}>
                  {faction.shortName}{isSpeaker ? ' 👑' : ''}
                </span>
                <span
                  className={`text-lg font-bold leading-tight ${p.vp >= vpGoal ? 'text-yellow-400' : 'text-white'}`}
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  {p.vp}
                  <span className="text-[9px] text-gray-500"> /{vpGoal}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
