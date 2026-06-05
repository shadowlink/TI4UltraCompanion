'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { formatTime } from '@/lib/timeUtils';
import { useActiveDecisionPlayer } from '@/hooks/useActiveDecisionPlayer';
import { useVisualEffects } from '@/hooks/useVisualEffects';
import AnimatedVP from '@/components/shared/AnimatedVP';

export default function MobileVPRow() {
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const vpGoal = useGameStore((s) => s.options.vpWinGoal);
  const showFactionClock = useGameStore((s) => s.options.showFactionClock);
  const activeDecisionIdx = useActiveDecisionPlayer();
  const fx = useVisualEffects();

  return (
    <div className="border-t border-gray-800 bg-black/60">
      <div className="flex gap-1.5 overflow-x-auto px-2 py-2 scrollbar-hide">
        {players.slice(0, nbPlayers).map((p, i) => {
          const faction = FACTIONS[p.faction];
          if (!faction) return null;
          const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[p.color]];
          const isSpeaker = i === speakerIdx;
          const isAbandoned = p.abandoned;
          const isActivePlayer = activeDecisionIdx === i;
          const liveClock = p.clock ?? 0;
          return (
            <div
              key={i}
              className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-1 rounded border bg-gray-900/60 ${isAbandoned ? 'opacity-40 grayscale' : ''} ${isActivePlayer ? `bg-[color:var(--accent)]/15 ring-1 ring-inset ring-[color:var(--accent-border-strong)] ${fx ? 'turn-active' : ''}` : ''}`}
              style={{ borderColor: isActivePlayer ? 'var(--accent)' : color }}
            >
              <div className="w-5 h-5 relative flex-shrink-0">
                <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] text-gray-400 truncate max-w-[70px]" style={{ color }}>
                  {faction.shortName}{isSpeaker ? ' 👑' : ''}{isAbandoned ? ' ✖' : ''}
                </span>
                <span
                  className={`text-lg font-bold leading-tight ${p.vp >= vpGoal ? 'text-yellow-400' : 'text-white'}`}
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  <AnimatedVP value={p.vp} />
                  <span className="text-[9px] text-gray-500"> /{vpGoal}</span>
                </span>
                {showFactionClock && (
                  <span
                    className={`text-[11px] leading-none ${isActivePlayer ? 'text-orange-300 font-bold' : 'text-gray-400'}`}
                    style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                  >
                    {formatTime(liveClock)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
