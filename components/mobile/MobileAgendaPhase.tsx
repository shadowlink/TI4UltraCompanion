'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { NO_PLAYER, VOTE_PASS, STRATEGY_DISABLED } from '@/lib/constants';
import { Crown } from '@/components/ui/icons';
import { PLANETS } from '@/data/planets';
import { LAWS } from '@/data/laws';
import { OBJECTIVES_BY_ID } from '@/data/publicObjectives';
import type { MobileCommand } from '@/lib/sync/types';
import type { AgendaVoteType } from '@/types/game';

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
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const agendaStep = useGameStore((s) => s.agendaStep);
  const votes = useGameStore((s) => s.votes);
  const votingPlayerIdx = useGameStore((s) => s.votingPlayerIdx);
  const agendaStage = useGameStore((s) => s.agendaStage);
  const agendaVoteType = useGameStore((s) => s.agendaVoteType);
  const agendaColumns = useGameStore((s) => s.agendaColumns);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const strategies = useGameStore((s) => s.strategies);
  const objectiveDeck = useGameStore((s) => s.objectiveDeck);
  const revealedCount = useGameStore((s) => s.revealedCount);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [amount, setAmount] = useState(0);
  const [busy, setBusy] = useState(false);
  // Speaker-only state for vote setup
  const [selectedVoteType, setSelectedVoteType] = useState<AgendaVoteType | null>(null);
  const [setupColumns, setSetupColumns] = useState<string[]>([]);
  const [pickerSearch, setPickerSearch] = useState('');
  const [planetTypeFilter, setPlanetTypeFilter] = useState<string | null>(null);

  const isSpeaker = myPlayerIdx >= 0 && myPlayerIdx === speakerIdx;

  const agendaLabel =
    agendaStep === 1
      ? 'Primer Consejo'
      : 'Segundo Consejo';

  const voteTypeLabel = agendaVoteType ? VOTE_TYPE_LABELS[agendaVoteType]?.es : '';

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

  const handleSelectVoteType = (voteType: AgendaVoteType) => {
    setSelectedVoteType(voteType);
    setPickerSearch('');
    setPlanetTypeFilter(null);
    if (voteType === 'ForAgainst') {
      setSetupColumns(['A Favor', 'En Contra']);
    } else if (voteType === 'ElectPlayer') {
      setSetupColumns(players.slice(0, nbPlayers).map((p) => FACTIONS[p.faction].nameEs));
    } else if (voteType === 'ElectStrategy') {
      setSetupColumns(
        strategies.slice(1).filter((st) => st.status !== STRATEGY_DISABLED && !st.isNaaluSlot).map((st) => st.nameEs)
      );
    } else if (voteType === 'ElectOther') {
      setSetupColumns(['', '']);
    } else {
      // ElectPlanet, ElectLaw, ElectObjective — picker-based, start empty
      setSetupColumns([]);
    }
  };

  const handleSubmitVoteSetup = async () => {
    if (!selectedVoteType || busy) return;
    const cols = setupColumns.filter((c) => c.trim());
    if (cols.length === 0) return;
    setBusy(true);
    await sendCommand({ type: 'setupAgendaVote', voteType: selectedVoteType, columns: cols });
    setBusy(false);
  };

  const handleAdvanceStep = async () => {
    if (busy) return;
    setBusy(true);
    await sendCommand({ type: 'advanceAgendaStep' });
    // Reset vote setup for next step
    setSelectedVoteType(null);
    setSetupColumns(['', '']);
    setBusy(false);
  };

  const handleStartNewRound = async () => {
    if (busy) return;
    setBusy(true);
    await sendCommand({ type: 'startNewRound' });
    setBusy(false);
  };

  // ── Type select stage ──────────────────────────────────────────────────────
  if (agendaStage === 'type_select') {
    if (isSpeaker) {
      const isPickerType = selectedVoteType === 'ElectPlanet' || selectedVoteType === 'ElectLaw' || selectedVoteType === 'ElectObjective';
      const isAutoType = selectedVoteType === 'ForAgainst' || selectedVoteType === 'ElectPlayer' || selectedVoteType === 'ElectStrategy';
      const isTextType = selectedVoteType === 'ElectOther';
      const canSubmit = setupColumns.filter((c) => c.trim()).length > 0;

      // Build picker candidate list (unselected items only)
      const allPickerItems: string[] = (() => {
        if (selectedVoteType === 'ElectPlanet') {
          const filtered = planetTypeFilter
            ? PLANETS.filter((p) => p.type === planetTypeFilter)
            : PLANETS;
          return filtered.map((p) => p.name).filter((n) =>
            n.toLowerCase().includes(pickerSearch.toLowerCase())
          );
        }
        if (selectedVoteType === 'ElectLaw') {
          return LAWS.map((l) => l.es).filter((n) =>
            n.toLowerCase().includes(pickerSearch.toLowerCase())
          );
        }
        if (selectedVoteType === 'ElectObjective') {
          return objectiveDeck
            .slice(0, revealedCount)
            .map((id) => OBJECTIVES_BY_ID[id]?.nameEn)
            .filter((n): n is string => !!n && n.toLowerCase().includes(pickerSearch.toLowerCase()));
        }
        return [];
      })();
      const pickerItems = allPickerItems.filter((item) => !setupColumns.includes(item));

      return (
        <div className="flex flex-col gap-3 p-3 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Crown size={14} className="text-[color:var(--warning)]" strokeWidth={2} aria-hidden />
            <span className="text-xs text-orange-300 uppercase tracking-wider" style={{ fontFamily: 'var(--font-aldrich)' }}>
              {`Portavoz — ${agendaLabel}`}
            </span>
          </div>
          <p className="text-xs text-gray-400">{'Elige el tipo de votación de la carta de agenda:'}</p>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(VOTE_TYPE_LABELS) as AgendaVoteType[]).map((vt) => (
              <button
                key={vt}
                onClick={() => handleSelectVoteType(vt)}
                className={`px-2.5 py-1.5 rounded-full border text-xs ${
                  selectedVoteType === vt
                    ? 'border-orange-400 bg-orange-500/30 text-white'
                    : 'border-gray-600 text-gray-300 bg-gray-900/40'
                }`}
              >
                {VOTE_TYPE_LABELS[vt].es}
              </button>
            ))}
          </div>

          {/* ── Per-type column setup ── */}
          {selectedVoteType && (
            <div className="flex flex-col gap-2 mt-1">

              {/* Auto-populated: read-only preview chips */}
              {isAutoType && (
                <>
                  <p className="text-xs text-gray-400">{'Columnas:'}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {setupColumns.map((col, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-gray-700 border border-gray-600 text-xs text-white">
                        {col}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Free text inputs (ElectOther) */}
              {isTextType && (
                <>
                  <p className="text-xs text-gray-400">{'Etiquetas de columna:'}</p>
                  {setupColumns.map((col, i) => (
                    <input
                      key={i}
                      type="text"
                      value={col}
                      onChange={(e) => {
                        const next = [...setupColumns];
                        next[i] = e.target.value;
                        setSetupColumns(next);
                      }}
                      placeholder={`Columna ${i + 1}`}
                      className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-900 text-white text-sm outline-none focus:border-orange-400"
                    />
                  ))}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSetupColumns([...setupColumns, ''])}
                      disabled={setupColumns.length >= 8}
                      className="text-xs text-blue-400 underline disabled:opacity-30"
                    >
                      {'+ Añadir columna'}
                    </button>
                    {setupColumns.length > 2 && (
                      <button
                        onClick={() => setSetupColumns(setupColumns.slice(0, -1))}
                        className="text-xs text-red-400 underline"
                      >
                        {'− Quitar'}
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Picker (ElectPlanet / ElectLaw / ElectObjective) */}
              {isPickerType && (
                <>
                  {/* Selected chips */}
                  {setupColumns.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {setupColumns.map((col, i) => (
                        <button
                          key={i}
                          onClick={() => setSetupColumns(setupColumns.filter((_, j) => j !== i))}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/30 border border-blue-500/60 text-xs text-blue-200 active:bg-blue-600/50"
                        >
                          <span>{col}</span>
                          <span className="text-blue-400 leading-none">×</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Planet type filter */}
                  {selectedVoteType === 'ElectPlanet' && (
                    <div className="flex gap-1.5 flex-wrap">
                      {(['cultural', 'hazardous', 'industrial', 'homeworld'] as const).map((pt) => (
                        <button
                          key={pt}
                          onClick={() => setPlanetTypeFilter(planetTypeFilter === pt ? null : pt)}
                          className={`px-2 py-0.5 rounded border text-[10px] capitalize ${
                            planetTypeFilter === pt
                              ? 'border-blue-400 bg-blue-500/30 text-white'
                              : 'border-gray-600 text-gray-400 bg-gray-900/40'
                          }`}
                        >
                          {pt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Search */}
                  <input
                    type="text"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder={'Buscar...'}
                    className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-900 text-white text-sm outline-none focus:border-orange-400"
                  />

                  {/* Item list */}
                  <div className="max-h-44 overflow-y-auto flex flex-col gap-0.5 rounded border border-gray-700 bg-gray-950/60 p-1">
                    {pickerItems.length > 0 ? pickerItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setSetupColumns([...setupColumns, item])}
                        className="text-left px-3 py-1.5 rounded text-xs text-gray-200 hover:bg-gray-800 active:bg-gray-700"
                      >
                        {item}
                      </button>
                    )) : (
                      <p className="text-xs text-gray-500 italic text-center py-3">
                        {setupColumns.length > 0 && allPickerItems.length === pickerItems.length + setupColumns.length
                          ? 'Todo seleccionado'
                          : 'Sin resultados'}
                      </p>
                    )}
                  </div>
                </>
              )}

              <button
                onClick={handleSubmitVoteSetup}
                disabled={!canSubmit || busy}
                className="w-full py-3 rounded-lg border-2 border-orange-500/60 bg-orange-500/15 text-orange-200 text-sm active:bg-orange-500/30 disabled:opacity-30 mt-1"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                {'Iniciar votación →'}
              </button>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-400 rounded-full animate-spin" />
        <p className="text-base text-orange-300" style={{ fontFamily: 'var(--font-audiowide)' }}>
          {agendaLabel}
        </p>
        <p className="text-xs text-gray-400">
          {'Esperando a que el portavoz elija el tipo de votación...'}
        </p>
      </div>
    );
  }

  // ── Results stage ──────────────────────────────────────────────────────────
  if (agendaStage === 'results') {
    return (
      <div className="flex flex-col gap-3 p-3">
        <div className="text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">{'Resultados'}</p>
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
              {'🏆 Ganador'}
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
              {'Detalle'}
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
                      <span className="text-gray-500 italic">{'abst.'}</span>
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

        {/* Speaker advance controls */}
        {isSpeaker && (
          <SpeakerAdvancePanel
            agendaStep={agendaStep}
            busy={busy}
            onAdvance={handleAdvanceStep}
            onSkipToNewRound={handleStartNewRound}
          />
        )}
      </div>
    );
  }

  // ── Voting stage ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wider">
          {'Fase de Consejo Galáctico'}
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
              {isMyTurn ? ('¡Te toca votar!') : ('Votando ahora')}
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
            {'Selecciona y vota'}
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
            <span>{'Votos'}: <strong className="text-white text-base">{amount}</strong></span>
            <button onClick={() => setAmount(0)} className="text-gray-400 underline">
              {'Reset'}
            </button>
          </div>
          <div className="flex gap-2 mt-1">
            <button
              onClick={submitVote}
              disabled={busy || selectedColumn === null || amount === 0}
              className="flex-1 py-2.5 rounded border-2 border-green-500/60 bg-green-500/15 text-green-200 text-sm active:bg-green-500/30 disabled:opacity-30"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {'Votar'}
            </button>
            <button
              onClick={submitAbstain}
              disabled={busy}
              className="flex-1 py-2.5 rounded border-2 border-gray-600 bg-gray-800/40 text-gray-300 text-sm active:bg-gray-700"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {'Abstenerse'}
            </button>
          </div>
        </div>
      )}

      {isMyTurn && agendaColumns.length === 0 && (
        <p className="text-xs text-gray-500 italic text-center">
          {'Esperando que el host añada opciones para votar...'}
        </p>
      )}

      {/* Totals */}
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
          {'Recuento'}
        </p>
        {sortedColumns.length === 0 ? (
          <p className="text-xs text-gray-500 italic px-2">
            {'Sin votos aún'}
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
            {'Votos'}
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
                    <span className="text-gray-500 italic">{'abst.'}</span>
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

      {/* Speaker advance controls */}
      {isSpeaker && (
        <SpeakerAdvancePanel
          agendaStep={agendaStep}
          busy={busy}
          onAdvance={handleAdvanceStep}
          onSkipToNewRound={handleStartNewRound}
        />
      )}
    </div>
  );
}

// ─── Reusable speaker advance panel ─────────────────────────────────────────

function SpeakerAdvancePanel({
  agendaStep,
  busy,
  onAdvance,
  onSkipToNewRound,
}: {
  agendaStep: number;
  busy: boolean;
  onAdvance: () => void;
  onSkipToNewRound: () => void;
}) {
  return (
    <div className="rounded-lg border-2 border-orange-500/40 bg-orange-500/5 px-3 py-3 flex flex-col gap-2 pointer-events-auto mt-2">
      <div className="flex items-center gap-2">
        <Crown size={14} className="text-[color:var(--warning)]" strokeWidth={2} aria-hidden />
        <span className="text-xs text-orange-300 uppercase tracking-wider" style={{ fontFamily: 'var(--font-aldrich)' }}>
          {'Portavoz'}
        </span>
      </div>
      <button
        onClick={onAdvance}
        disabled={busy}
        className="w-full py-2.5 rounded-lg border-2 border-orange-500/60 bg-orange-500/15 text-orange-200 text-sm active:bg-orange-500/30 disabled:opacity-30"
        style={{ fontFamily: 'var(--font-aldrich)' }}
      >
        {agendaStep === 1 ? 'Avanzar al paso 2 →' : 'Finalizar agenda → Nueva ronda →'}
      </button>
      <button
        onClick={onSkipToNewRound}
        disabled={busy}
        className="w-full py-2 rounded-lg border border-gray-500/50 bg-gray-700/20 text-gray-400 text-xs active:bg-gray-700/40 disabled:opacity-30"
        style={{ fontFamily: 'var(--font-aldrich)' }}
      >
        {'Saltar directamente a nueva ronda'}
      </button>
    </div>
  );
}
