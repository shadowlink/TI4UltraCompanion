'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import MobileFactionSheet from './MobileFactionSheet';
import type { MobileCommand } from '@/lib/sync/types';

interface Props {
  myFactionIdx: number | null;
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

export default function MobileFactionsView({ myFactionIdx, myPlayerIdx, sendCommand }: Props) {
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);

  const activePlayers = players.slice(0, nbPlayers);
  const [selectedFactionIdx, setSelectedFactionIdx] = useState<number>(() => {
    if (myFactionIdx !== null) return myFactionIdx;
    return activePlayers[0]?.faction ?? 0;
  });

  // Reset selection if our paired faction changes
  useEffect(() => {
    if (myFactionIdx !== null) setSelectedFactionIdx(myFactionIdx);
  }, [myFactionIdx]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Faction selector */}
      <div className="border-b border-gray-800 bg-black/40 flex-shrink-0">
        <div className="flex gap-1.5 overflow-x-auto px-2 py-2 scrollbar-hide">
          {activePlayers.map((player) => {
            const faction = FACTIONS[player.faction];
            if (!faction) return null;
            const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
            const isSelected = selectedFactionIdx === player.faction;
            const isMine = myFactionIdx === player.faction;
            return (
              <button
                key={player.faction}
                onClick={() => setSelectedFactionIdx(player.faction)}
                className={`relative flex-shrink-0 px-2 py-1.5 rounded border-2 flex items-center gap-1.5 pointer-events-auto ${
                  isSelected ? 'ring-2 ring-orange-400 bg-orange-500/10' : 'bg-gray-900/40'
                }`}
                style={{ borderColor: color }}
              >
                <div className="w-7 h-7 relative">
                  <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                </div>
                <span
                  className="text-xs text-white whitespace-nowrap"
                  style={{ color: isSelected ? '#fff' : color }}
                >
                  {faction.shortName}
                </span>
                {isMine && <span className="text-[10px] text-yellow-300">★</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sheet (scroll) */}
      <div className="flex-1 overflow-y-auto pointer-events-auto">
        <MobileFactionSheet
          factionIdx={selectedFactionIdx}
          viewingPlayerIdx={activePlayers.findIndex((p) => p.faction === selectedFactionIdx)}
          myPlayerIdx={myPlayerIdx}
          sendCommand={sendCommand}
        />
      </div>

      {/* Footer note */}
      <div className="px-3 py-1 border-t border-gray-800 bg-black/40 flex-shrink-0">
        <p className="text-[10px] text-gray-500 text-center">
          {'Información pública — todos los jugadores pueden consultarla'}
        </p>
      </div>
    </div>
  );
}
