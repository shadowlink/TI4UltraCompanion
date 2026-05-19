'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';

export default function MobileEndGameScreen() {
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);

  const sorted = players
    .slice(0, nbPlayers)
    .map((p, i) => ({ p, i }))
    .sort((a, b) => b.p.vp - a.p.vp);

  const winner = sorted[0];
  const winnerFaction = winner ? FACTIONS[winner.p.faction] : null;
  const winnerColor = winner
    ? PLAYER_COLOR_VALUES[PLAYER_COLORS[winner.p.color]]
    : undefined;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wider">
        {'Fin de la partida'}
      </p>
      {winner && winnerFaction && (
        <>
          <div className="w-32 h-32 relative">
            <Image src={winnerFaction.iconPath} alt={winnerFaction.shortName} fill className="object-contain drop-shadow-lg" unoptimized />
          </div>
          <p
            className="text-2xl text-yellow-300 text-center text-shadow"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {'¡Victoria!'}
          </p>
          <p className="text-lg" style={{ color: winnerColor, fontFamily: 'var(--font-aldrich)' }}>
            {winnerFaction.nameEs}
            {winner.p.name ? ` — ${winner.p.name}` : ''}
          </p>
          <p className="text-4xl font-bold text-yellow-400" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
            {winner.p.vp} VP
          </p>
        </>
      )}

      <div className="w-full mt-4">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 px-1">
          {'Clasificación final'}
        </p>
        <div className="flex flex-col gap-1.5">
          {sorted.map(({ p, i }, rank) => {
            const faction = FACTIONS[p.faction];
            const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[p.color]];
            return (
              <div
                key={i}
                className="flex items-center gap-2 px-2 py-1.5 rounded border bg-gray-900/40"
                style={{ borderColor: color }}
              >
                <span className="text-xs text-gray-400 font-mono w-5">#{rank + 1}</span>
                <div className="w-7 h-7 relative flex-shrink-0">
                  <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                </div>
                <span className="flex-1 text-sm text-white truncate" style={{ color }}>
                  {faction.shortName}{p.name ? ` (${p.name})` : ''}
                </span>
                <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                  {p.vp}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
