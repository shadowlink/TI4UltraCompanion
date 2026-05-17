'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { NO_PLAYER, VOTE_PASS } from '@/lib/constants';
import type { MobileCommand } from '@/lib/sync/types';

interface Props {
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

const KEYPAD_VALUES = [1, 2, 3, 4, 5, 6, 8, 10];

const VOTE_TYPE_LABELS: Record<string, { en: string; es: string }> = {
  ForAgainst: { en: 'For / Against', es: 'A Favor / En Contra' },
  ElectPlayer: { en: 'Elect Player', es: 'Elegir Jugador' },
  ElectPlanet: { en: 'Elect Planet', es: 'Elegir Planeta' },
  ElectLaw: { en: 'Elect Law', es: 'Elegir Ley' },
  ElectObjective: { en: 'Elect Objective', es: 'Elegir Objetivo' },
  ElectStrategy: { en: 'Strategy Card', es: 'Carta de Estrategia' },
  ElectOther: { en: 'Generic Proposal', es: 'Propuesta Genérica' },
};

export default function MobileAgendaPhase({ myPlayerIdx, sendCommand }: Props) {
  const lang = useGameStore((s) => s.lang);
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const agendaStep = useGameStore((s) => s.agendaStep);
  const votes = useGameStore((s) => s.votes);
  const votingPlayerIdx = useGameStore((s) => s.votingPlayerIdx);
  const agendaStage = useGameStore((s) => s.agendaStage);
  const agendaVoteType = useGameStore((s) => s.agendaVoteType);
  const agendaColumns = useGameStore((s) => s.agendaColumns);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [amount, setAmount] = useState(0);
  const [busy, setBusy] = useState(false);

  const agendaLabel =
    agendaStep === 1
      ? lang === 'es' ? 'Primer Consejo' : 'First Agenda'
      : lang === 'es' ? 'Segundo Consejo' : 'Second Agenda';

  const voteTypeLabel = agendaVoteType ? VOTE_TYPE_LABELS[agendaVoteType]?.[lang] : '';

  const columnTotals: Record<number, number> = {};
  votes.forEach((v) => {
    if (v.influenceAmount !== null && v.voteColumnIdx !== VOTE_PASS) {
      columnTotals[v.voteColumnIdx] = (columnTotals[v.voteColumnIdx] ?? 0) + v.influenceAmount;
    }
  });

  // Winner = column with max total
  const maxTotal = Math.max(0, ...Object.values(columnTotals));
  const winnerIdx = maxTotal > 0
    ? Object.entries(columnTotals).find(([, v]) => v === maxTotal)?.[0]
    : null;

  const sortedColumns = Object.entries(columnTotals)
    .map(([k, v]) => ({ idx: Number(k), total: v }))
    .sort((a, b) => b.total - a.total);

  const currentVoter = votingPlayerIdx !== NO_PLAYER && votingPlayerIdx < nbPlayers ? players[votingPlayerIdx] : null;
  const voterFaction = currentVoter ? FACTIONS[currentVoter.faction] : null;
  const voterColor = currentVoter ? PLAYER_COLOR_VALUES[PLAYER_COLORS[currentVoter.color]] : undefined;

  const isMyTurn = myPlayerIdx >= 0 && votingPlayerIdx === myPlayerIdx;

  const columnLabel = (idx: number): string => agendaColumns[idx] ?? `#${idx + 1}`;

  const submitVote = async () => {
    if (!isMyTurn || busy || selectedColumn === null) return;
    setBusy(true);
    await sendCommand({ type: 'castVote', voteColumnIdx: selectedColumn, amount });
    setSelectedColumn(null);
    setAmount(0);
    setBusy(false);
  };

  const submitAbstain = async () => {
    if (!isMyTurn || busy) return;
    setBusy(true);
    await sendCommand({ type: 'abstain' });
    setSelectedColumn(null);
    setAmount(0);
    setBusy(false);
  };

  // ── Type select stage ──────────────────────────────────────────────────────
  if (agendaStage === 'type_select') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-400 rounded-full animate-spin" />
        <p className="text-base text-orange-300" style={{ fontFamily: 'var(--font-audiowide)' }}>
          {agendaLabel}
        </p>
        <p className="text-xs text-gray-400">
          {lang === 'es'
            ? 'Esperando a que el host elija el tipo de votación...'
            : 'Waiting for host to choose vote type...'}
        </p>
      </div>
    );
  }

  // ── Results stage ──────────────────────────────────────────────────────────
  if (agendaStage === 'results') {
    return (
      <div className="flex flex-col gap-3 p-3">
        <div className="text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">{lang === 'es' ? 'Resultados' : 'Results'}</p>
          <p className="text-base text-orange-300 mt-1" style={{ fontFamily: 'var(--font-audiowide)' }}>
            {agendaLabel}
          </p>
          {voteTypeLabel && (
            <p className="text-[11px] text-gray-500 mt-0.5">{voteTypeLabel}</p>
          )}
        </div>

        {/* Winner highlight */}
        {winnerIdx !== null && (
          <div className="rounded-lg border-2 border-yellow-500/70 bg-yellow-500/10 p-3 text-center">
            <p className="text-[10px] text-yellow-400 uppercase tracking-wider">
              {lang === 'es' ? '🏆 Ganador' : '🏆 Winner'}
            </p>
            <p className="text-lg text-yellow-200 mt-1" style={{ fontFamily: 'var(--font-audiowide)' }}>
              {columnLabel(Number(winnerIdx))}
            </p>
            <p className="text-3xl font-bold text-yellow-300 mt-1" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
              {maxTotal}
            </p>
          </div>
        )}

        {/* All column totals */}
        <div className="flex flex-col gap-1">
          {sortedColumns.map(({ idx, total }, rank) => (
            <div
              key={idx}
              className={`flex items-center gap-2 px-3 py-2 rounded border ${
                rank === 0 ? 'border-yellow-500/60 bg-yellow-500/5' : 'border-gray-700 bg-gray-900/40'
              }`}
            >
              <span className="flex-1 text-xs text-white truncate">{columnLabel(idx)}</span>
              <span
                className={`text-xl font-bold ${rank === 0 ? 'text-yellow-300' : 'text-white'}`}
                style={{ fontFamily: 'var(--font-share-tech-mono)' }}
              >
                {total}
              </span>
            </div>
          ))}
        </div>

        {/* Per-player votes */}
        {votes.length > 0 && (
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 mt-2">
              {lang === 'es' ? 'Detalle' : 'Detail'}
            </p>
            <div className="flex flex-col gap-1">
              {votes.map((v, i) => {
                const player = players[v.playerIdx];
                if (!player) return null;
                const faction = FACTIONS[player.faction];
                const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
                const isAbstain = v.voteColumnIdx === VOTE_PASS;
                return (
                  <div key={i} className="flex items-center gap-2 px-2 py-1 text-xs">
                    <div className="w-5 h-5 relative flex-shrink-0">
                      <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                    </div>
                    <span className="text-gray-300 truncate flex-1" style={{ color }}>
                      {faction.shortName}
                    </span>
                    {isAbstain ? (
                      <span className="text-gray-500 italic">{lang === 'es' ? 'abst.' : 'abstain'}</span>
                    ) : (
                      <span className="text-white truncate max-w-[140px]">
                        {v.influenceAmount} → {columnLabel(v.voteColumnIdx)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Voting stage ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wider">
          {lang === 'es' ? 'Fase de Consejo Galáctico' : 'Galactic Council'}
        </p>
        <p className="text-base text-orange-300 mt-1" style={{ fontFamily: 'var(--font-audiowide)' }}>
          {agendaLabel}
        </p>
        {voteTypeLabel && (
          <p className="text-[11px] text-gray-500 mt-0.5">{voteTypeLabel}</p>
        )}
      </div>

      {currentVoter && voterFaction && (
        <div
          className="rounded border-2 p-3 flex items-center gap-3"
          style={{ borderColor: voterColor, background: `${voterColor}10` }}
        >
          <div className="w-14 h-14 relative flex-shrink-0">
            <Image src={voterFaction.iconPath} alt={voterFaction.shortName} fill className="object-contain" unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              {isMyTurn ? (lang === 'es' ? '¡Te toca votar!' : 'Your vote!') : (lang === 'es' ? 'Votando ahora' : 'Voting now')}
            </p>
            <p className="text-sm text-white truncate" style={{ color: voterColor }}>
              {voterFaction.shortName}{currentVoter.name ? ` (${currentVoter.name})` : ''}
            </p>
          </div>
        </div>
      )}

      {/* Voting UI for my turn — only when columns exist */}
      {isMyTurn && agendaColumns.length > 0 && (
        <div className="rounded border border-orange-500/40 bg-orange-500/5 p-3 flex flex-col gap-2 pointer-events-auto">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider">
            {lang === 'es' ? 'Selecciona y vota' : 'Select and vote'}
          </p>
          {/* Columns */}
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            {agendaColumns.map((label, colIdx) => {
              const selected = selectedColumn === colIdx;
              return (
                <button
                  key={colIdx}
                  onClick={() => setSelectedColumn(colIdx)}
                  className={`px-3 py-2 rounded border text-sm text-left ${
                    selected ? 'border-orange-400 bg-orange-500/30 text-white' : 'border-gray-600 text-gray-300'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {/* Keypad */}
          <div className="grid grid-cols-4 gap-1.5">
            {KEYPAD_VALUES.map((v) => (
              <button
                key={v}
                onClick={() => setAmount((a) => a + v)}
                className="py-2 rounded border border-gray-600 bg-gray-900/40 text-white text-sm active:bg-gray-700"
              >
                +{v}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span>{lang === 'es' ? 'Votos' : 'Votes'}: <strong className="text-white text-base">{amount}</strong></span>
            <button onClick={() => setAmount(0)} className="text-gray-400 underline">
              {lang === 'es' ? 'Reset' : 'Reset'}
            </button>
          </div>
          <div className="flex gap-2 mt-1">
            <button
              onClick={submitVote}
              disabled={busy || selectedColumn === null || amount === 0}
              className="flex-1 py-2.5 rounded border-2 border-green-500/60 bg-green-500/15 text-green-200 text-sm active:bg-green-500/30 disabled:opacity-30"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {lang === 'es' ? 'Votar' : 'Vote'}
            </button>
            <button
              onClick={submitAbstain}
              disabled={busy}
              className="flex-1 py-2.5 rounded border-2 border-gray-600 bg-gray-800/40 text-gray-300 text-sm active:bg-gray-700"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {lang === 'es' ? 'Abstenerse' : 'Abstain'}
            </button>
          </div>
        </div>
      )}

      {isMyTurn && agendaColumns.length === 0 && (
        <p className="text-xs text-gray-500 italic text-center">
          {lang === 'es'
            ? 'Esperando que el host añada opciones para votar...'
            : 'Waiting for host to add vote options...'}
        </p>
      )}

      {/* Totals */}
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
          {lang === 'es' ? 'Recuento' : 'Tally'}
        </p>
        {sortedColumns.length === 0 ? (
          <p className="text-xs text-gray-500 italic px-2">
            {lang === 'es' ? 'Sin votos aún' : 'No votes yet'}
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {sortedColumns.map(({ idx, total }, rank) => (
              <div
                key={idx}
                className={`flex items-center gap-2 px-3 py-1.5 rounded border ${
                  rank === 0 ? 'border-yellow-500/60 bg-yellow-500/10' : 'border-gray-700 bg-gray-900/40'
                }`}
              >
                <span className="flex-1 text-xs text-white truncate">{columnLabel(idx)}</span>
                <span
                  className={`text-xl font-bold ${rank === 0 ? 'text-yellow-300' : 'text-white'}`}
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  {total}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {votes.length > 0 && (
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
            {lang === 'es' ? 'Votos' : 'Votes'}
          </p>
          <div className="flex flex-col gap-1">
            {votes.map((v, i) => {
              const player = players[v.playerIdx];
              if (!player) return null;
              const faction = FACTIONS[player.faction];
              const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
              const isAbstain = v.voteColumnIdx === VOTE_PASS;
              return (
                <div key={i} className="flex items-center gap-2 px-2 py-1 text-xs">
                  <div className="w-5 h-5 relative flex-shrink-0">
                    <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                  </div>
                  <span className="text-gray-300 truncate flex-1" style={{ color }}>
                    {faction.shortName}
                  </span>
                  {isAbstain ? (
                    <span className="text-gray-500 italic">{lang === 'es' ? 'abst.' : 'abstain'}</span>
                  ) : (
                    <span className="text-white truncate max-w-[140px]">
                      {v.influenceAmount} → {columnLabel(v.voteColumnIdx)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
