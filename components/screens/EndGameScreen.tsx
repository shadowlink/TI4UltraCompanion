'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { formatTime } from '@/lib/timeUtils';
import { clearSavedGame } from '@/lib/persistence';
import Button from '@/components/ui/Button';
import { Crown, Trophy, Power } from '@/components/ui/icons';

export default function EndGameScreen() {
  const router = useRouter();
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const gameDuration = useGameStore((s) => s.gameDuration);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const startNewGame = useGameStore((s) => s.startNewGame);

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
        <div className="w-24 h-24 relative mx-auto mb-3 drop-shadow-[0_0_18px_var(--accent-glow)]">
          <Image
            src={winnerFaction.iconPath}
            alt={winnerFaction.nameEn}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Trophy size={26} className="text-[color:var(--vp-gold)]" strokeWidth={2} aria-hidden />
          <h1
            className="text-3xl text-[color:var(--vp-gold)] text-shadow"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {winnerFaction.nameEs}
          </h1>
        </div>
        <p className="text-lg text-[color:var(--accent-soft)] text-shadow">
          {'Una Nueva Era Comienza...'}
        </p>
      </div>

      {/* Stats */}
      <div className="text-center text-sm text-[color:var(--text-secondary)]" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
        <p>{`Duración: ${formatTime(gameDuration)}`}</p>
        <p>{`Rondas: ${turnCounter}`}</p>
      </div>

      {/* Rankings table */}
      <div className="w-full max-w-md rounded-[var(--radius)] border border-[color:var(--accent-border-faint)] bg-[var(--bg-surface)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr
              className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] border-b border-[color:var(--accent-border-faint)]"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              <th className="py-2 pl-3 text-left">#</th>
              <th className="py-2 text-left">{'Facción'}</th>
              <th className="py-2 text-right">VP</th>
              <th className="py-2 text-right">{'Tiempo'}</th>
              <th className="py-2 pr-3 text-right">
                <Crown size={12} className="inline" strokeWidth={2} aria-label="speaker" />
              </th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((player, rank) => {
              const faction = FACTIONS[player.faction];
              const colorValue = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
              const isSpeaker = player.originalIdx === speakerIdx;
              const isWinner = rank === 0;
              return (
                <tr
                  key={player.originalIdx}
                  className={`border-b border-white/5 last:border-b-0 ${isWinner ? 'bg-[color:var(--accent)]/8' : 'odd:bg-white/[0.02]'} hover:bg-white/5 transition-colors`}
                  style={{ borderLeft: `3px solid ${colorValue}` }}
                >
                  <td className="py-2 pl-3 text-sm text-[color:var(--text-muted)]">{rank + 1}</td>
                  <td className="py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 relative flex-shrink-0">
                        <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                      </div>
                      <span className="text-white text-shadow">{faction.shortName}</span>
                      {isSpeaker && (
                        <Crown size={12} className="text-[color:var(--warning)]" strokeWidth={2} aria-label="Speaker" />
                      )}
                    </div>
                  </td>
                  <td
                    className="py-2 text-right font-bold"
                    style={{
                      fontFamily: 'var(--font-share-tech-mono)',
                      color: isWinner ? 'var(--vp-gold)' : 'var(--text-primary)',
                    }}
                  >
                    {player.vp}
                  </td>
                  <td
                    className="py-2 text-right text-xs text-[color:var(--text-muted)]"
                    style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                  >
                    {formatTime(player.clock)}
                  </td>
                  <td className="py-2 pr-3 text-right text-xs text-[color:var(--text-muted)]">
                    {player.nbSpeaker}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Button onClick={handleNewGame} variant="primary" size="lg" icon={Power}>
        {'Nueva Partida'}
      </Button>
    </div>
  );
}
