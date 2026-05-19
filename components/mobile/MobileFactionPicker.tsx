'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS } from '@/data/factions';
import type { RoomPairing } from '@/lib/sync/types';

interface Props {
  serverPairings: RoomPairing[];
  myDeviceId: string;
  onPick: (factionIdx: number) => Promise<{ ok: boolean; error?: string }>;
}

export default function MobileFactionPicker({ serverPairings, myDeviceId, onPick }: Props) {
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePick = async (factionIdx: number) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    const result = await onPick(factionIdx);
    if (!result.ok) {
      setError(result.error ?? 'Failed');
    }
    setBusy(false);
  };

  // Factions actually in the game (active players)
  const activePlayers = players.slice(0, nbPlayers);

  return (
    <div className="flex flex-col min-h-screen bg-black p-4">
      <div className="text-center mb-4">
        <h1
          className="text-2xl text-orange-300"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {'Escoge tu Facción'}
        </h1>
        <p className="text-xs text-gray-400 mt-2">
          {'Te emparejarás con esta facción para controlarla desde tu móvil'}
        </p>
      </div>

      {error && (
        <div className="text-red-400 text-sm text-center mb-3 px-3 py-2 bg-red-900/20 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 flex-1">
        {activePlayers.map((player, playerIdx) => {
          const faction = FACTIONS[player.faction];
          const pairedTo = serverPairings.find((p) => p.factionIdx === player.faction);
          const taken = pairedTo && pairedTo.deviceId !== myDeviceId;
          return (
            <button
              key={playerIdx}
              onClick={() => handlePick(player.faction)}
              disabled={!!taken || busy}
              className={`p-3 rounded-lg border-2 flex flex-col items-center transition-all ${
                taken
                  ? 'border-gray-700 bg-gray-800/40 opacity-40 cursor-not-allowed'
                  : 'border-orange-500/40 bg-gray-900/60 active:bg-orange-500/20'
              }`}
            >
              <div className="w-16 h-16 relative">
                <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
              </div>
              <p className="text-sm text-white mt-2 text-center" style={{ fontFamily: 'var(--font-audiowide)' }}>
                {faction.shortName}
              </p>
              <p className="text-[11px] text-gray-400 text-center mt-0.5">
                {player.name || '—'}
              </p>
              {taken && (
                <p className="text-[10px] text-red-400 mt-1">
                  {'Ocupada'}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
