'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { formatTime } from '@/lib/timeUtils';
import { clearSavedGame } from '@/lib/persistence';
import { NO_PLAYER } from '@/lib/constants';

export default function EndGameScreen() {
  const router = useRouter();
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const gameDuration = useGameStore((s) => s.gameDuration);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const startNewGame = useGameStore((s) => s.startNewGame);

  // Sort players by VP desc, then by clock asc (tiebreak)
  const ranking = players
    .slice(0, nbPlayers)
    .map((p, i) => ({ ...p, originalIdx: i }))
    .sort((a, b) => b.vp - a.vp || a.clock - b.clock);

  const winner = ranking[0];
  const winnerFaction = FACTIONS[winner.faction];

  const handleNewGame = () => {
    clearSavedGame();
    startNewGame();
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 gap-6">
      {/* Winner announcement */}
      <div className="text-center">
        <div className="w-24 h-24 relative mx-auto mb-3">
          <Image
            src={winnerFaction.iconPath}
            alt={winnerFaction.nameEn}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <h1
          className="text-3xl text-yellow-400 text-shadow mb-1"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {winnerFaction.nameEs}
        </h1>
        <p className="text-lg text-orange-300 text-shadow">
          {'Una Nueva Era Comienza...'}
        </p>
      </div>

      {/* Stats */}
      <div className="text-center text-sm text-gray-400" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
        <p>{`Duración: ${formatTime(gameDuration)}`}</p>
        <p>{`Rondas: ${turnCounter}`}</p>
      </div>

      {/* Rankings table */}
      <div className="w-full max-w-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-700">
              <th className="py-1 text-left">#</th>
              <th className="py-1 text-left">{'Facción'}</th>
              <th className="py-1 text-right">VP</th>
              <th className="py-1 text-right">{'Tiempo'}</th>
              <th className="py-1 text-right">👑</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((player, rank) => {
              const faction = FACTIONS[player.faction];
              const colorValue = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
              const isSpeaker = player.originalIdx === speakerIdx;
              return (
                <tr
                  key={player.originalIdx}
                  className="border-b border-gray-800"
                  style={{ borderLeft: `3px solid ${colorValue}` }}
                >
                  <td className="py-2 pl-2 text-sm text-gray-400">{rank + 1}</td>
                  <td className="py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 relative flex-shrink-0">
                        <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                      </div>
                      <span className="text-white text-shadow">{faction.shortName}</span>
                      {isSpeaker && <span className="text-xs text-yellow-400">👑</span>}
                    </div>
                  </td>
                  <td className="py-2 text-right font-bold text-yellow-400" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                    {player.vp}
                  </td>
                  <td className="py-2 text-right text-xs text-gray-400" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                    {formatTime(player.clock)}
                  </td>
                  <td className="py-2 text-right text-xs text-gray-400">
                    {player.nbSpeaker}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* New game button */}
      <button
        onClick={handleNewGame}
        className="px-8 py-3 text-lg border-2 border-orange-500 bg-orange-500/10 hover:bg-orange-500/30 text-orange-300 rounded transition-all"
        style={{ fontFamily: 'var(--font-aldrich)' }}
      >
        {'Nueva Partida'}
      </button>
    </div>
  );
}
