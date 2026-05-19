'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { PLANETS } from '@/data/planets';
import { LAWS, SECRET_OBJECTIVES, STRATEGY_CARD_NAMES, GENERIC_CHOICES } from '@/data/laws';
import { NEKRO_FACTION, VOTE_PASS, NO_PLAYER } from '@/lib/constants';

// ─── Types ────────────────────────────────────────────────────────────────────

type VoteType =
  | 'ForAgainst'
  | 'ElectPlayer'
  | 'ElectPlanet'
  | 'ElectLaw'
  | 'ElectObjective'
  | 'ElectStrategy'
  | 'ElectOther';

type Stage = 'type_select' | 'voting' | 'results';
type PlanetFilter = 'all' | 'cultural' | 'hazardous' | 'industrial' | 'homeworld';

interface PlayerVote {
  columnIdx: number | 'abstain';
  amount: number;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AgendaPhase() {
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const agendaStep = useGameStore((s) => s.agendaStep);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const currentPlayerTimer = useGameStore((s) => s.currentPlayerTimer);
  const advanceAgendaStep = useGameStore((s) => s.advanceAgendaStep);
  const addInfluence = useGameStore((s) => s.addInfluence);
  const addPlayerClock = useGameStore((s) => s.addPlayerClock);
  const resetCurrentPlayerTimer = useGameStore((s) => s.resetCurrentPlayerTimer);
  const resetDecisionTimer = useGameStore((s) => s.resetDecisionTimer);
  const setVote = useGameStore((s) => s.setVote);
  const nextVotingPlayer = useGameStore((s) => s.nextVotingPlayer);
  const votingPlayerIdx = useGameStore((s) => s.votingPlayerIdx);
  const stage = useGameStore((s) => s.agendaStage);
  const voteType = useGameStore((s) => s.agendaVoteType) as VoteType | null;
  const columns = useGameStore((s) => s.agendaColumns);
  const setAgendaStage = useGameStore((s) => s.setAgendaStage);
  const setAgendaVoteType = useGameStore((s) => s.setAgendaVoteType);
  const setAgendaColumns = useGameStore((s) => s.setAgendaColumns);
  const addAgendaColumn = useGameStore((s) => s.addAgendaColumn);
  const resetAgendaContext = useGameStore((s) => s.resetAgendaContext);

  const [playerVotes, setPlayerVotes] = useState<Record<number, PlayerVote>>({});
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [keypad, setKeypad] = useState(0);
  const [pickerOpen, setPickerOpen] = useState<
    'planet' | 'law' | 'obj' | 'strategy' | 'other' | null
  >(null);
  const [planetFilter, setPlanetFilter] = useState<PlanetFilter>('all');

  // Reset local UI state when agendaStep changes (agenda 1 → 2)
  useEffect(() => {
    setPlayerVotes({});
    setSelectedColumn(null);
    setKeypad(0);
    setPickerOpen(null);
    // Store-driven agenda context is reset by advanceAgendaStep itself
  }, [agendaStep]);

  // Auto-transition to results when voting is complete (store-driven, works for mobile too)
  useEffect(() => {
    if (stage === 'voting' && votingPlayerIdx === NO_PLAYER) {
      setAgendaStage('results');
    }
  }, [stage, votingPlayerIdx, setAgendaStage]);

  // Mirror store votes into local playerVotes for UI rendering (so mobile-driven votes update host display)
  const votes = useGameStore((s) => s.votes);
  useEffect(() => {
    const synced: Record<number, PlayerVote> = {};
    votes.forEach((v) => {
      synced[v.playerIdx] =
        v.voteColumnIdx === VOTE_PASS
          ? { columnIdx: 'abstain', amount: 0 }
          : { columnIdx: v.voteColumnIdx, amount: v.influenceAmount ?? 0 };
    });
    setPlayerVotes(synced);
  }, [votes]);

  const agendaLabel =
    agendaStep === 1
      ? 'Primera Carta del Consejo'
      : 'Segunda Carta del Consejo';

  // Speaker votes LAST: order is [speakerIdx+1, ..., speakerIdx] (used for display)
  const votingOrder = Array.from(
    { length: nbPlayers },
    (_, i) => (speakerIdx + 1 + i) % nbPlayers
  );
  // Store is source of truth for current voter — speaker votes last, NO_PLAYER means done
  const allVoted = votingPlayerIdx === NO_PLAYER;
  const currentVoterIdx = allVoted ? -1 : votingPlayerIdx;
  const currentPlayer = currentVoterIdx >= 0 ? players[currentVoterIdx] : null;
  const currentFaction = currentPlayer ? FACTIONS[currentPlayer.faction] : null;
  const isNekro = currentPlayer?.faction === NEKRO_FACTION;

  // Running totals per column
  const columnTotals = columns.map((_, colIdx) =>
    Object.values(playerVotes)
      .filter((v) => v.columnIdx === colIdx)
      .reduce((sum, v) => sum + v.amount, 0)
  );
  const maxTotal = columnTotals.length > 0 ? Math.max(...columnTotals) : 0;

  const isPicker =
    voteType === 'ElectPlanet' ||
    voteType === 'ElectLaw' ||
    voteType === 'ElectObjective' ||
    voteType === 'ElectStrategy' ||
    voteType === 'ElectOther';

  const startVoting = (type: VoteType) => {
    setAgendaVoteType(type);
    let cols: string[] = [];
    switch (type) {
      case 'ForAgainst':
        cols = [
          'A Favor',
          'En Contra',
        ];
        break;
      case 'ElectPlayer':
        cols = players.slice(0, nbPlayers).map((p) => `${FACTIONS[p.faction].shortName} (${p.name})`);
        break;
      default:
        cols = []; // populated dynamically via picker
    }
    setAgendaColumns(cols);
    // Clear any previous store votes + set first voter (speaker votes last)
    useGameStore.setState((s) => ({
      votes: [],
      votingPlayerIdx: (s.speakerIdx + 1) % s.nbPlayers,
    }));
    setAgendaStage('voting');
  };

  const addColumn = (label: string) => {
    addAgendaColumn(label);
    setPickerOpen(null);
  };

  const resolveVote = (isAbstain: boolean) => {
    if (!isAbstain && selectedColumn === null) return;
    const pIdx = currentVoterIdx;
    const vote: PlayerVote = isAbstain
      ? { columnIdx: 'abstain', amount: 0 }
      : { columnIdx: selectedColumn!, amount: keypad };
    setPlayerVotes((prev) => ({ ...prev, [pIdx]: vote }));
    // Mirror to store so it gets synced to mobile viewers
    setVote({
      playerIdx: pIdx,
      voteColumnIdx: isAbstain ? VOTE_PASS : selectedColumn!,
      influenceAmount: isAbstain ? null : keypad,
    });
    if (!isAbstain && keypad > 0) addInfluence(pIdx, keypad);
    addPlayerClock(pIdx, currentPlayerTimer);
    resetCurrentPlayerTimer();
    resetDecisionTimer();
    setSelectedColumn(null);
    setKeypad(0);
    // Advance voter in store (speaker-last rule). Stage transition handled by useEffect.
    nextVotingPlayer();
  };

  // ── Type select screen ──────────────────────────────────────────────────────

  if (stage === 'type_select') {
    const types: [VoteType, string, string][] = [
      ['ForAgainst', 'A Favor / En Contra', 'For / Against'],
      ['ElectPlayer', 'Elegir Jugador', 'Elect Player'],
      ['ElectPlanet', 'Elegir Planeta', 'Elect Planet'],
      ['ElectLaw', 'Elegir Ley', 'Elect Law'],
      ['ElectObjective', 'Elegir Objetivo', 'Elect Objective'],
      ['ElectStrategy', 'Carta de Estrategia', 'Strategy Card'],
      ['ElectOther', 'Propuesta Genérica', 'Generic Proposal'],
    ];
    return (
      <div className="flex flex-col h-full p-5 gap-4">
        <div className="flex-shrink-0">
          <h2
            className="text-2xl text-orange-400 text-shadow"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {`Ronda ${turnCounter} — ${agendaLabel}`}
          </h2>
          <p className="text-base text-gray-400 mt-1">
            {'¿Qué tipo de voto?'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {types.map(([type, labelEs, labelEn]) => (
            <button
              key={type}
              onClick={() => startVoting(type)}
              className="py-5 px-4 text-lg border border-orange-500/40 bg-orange-500/5 hover:bg-orange-500/20 text-orange-300 rounded transition-all text-left"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {labelEs}
            </button>
          ))}
        </div>
        <button
          onClick={advanceAgendaStep}
          className="mt-auto px-4 py-3 text-base border border-gray-700 text-gray-500 hover:text-gray-300 rounded transition-colors self-start"
        >
          {'Omitir este consejo →'}
        </button>
      </div>
    );
  }

  // ── Results screen ──────────────────────────────────────────────────────────

  if (stage === 'results') {
    return (
      <ResultsScreen
        agendaLabel={agendaLabel}
        columns={columns}
        columnTotals={columnTotals}
        maxTotal={maxTotal}
        playerVotes={playerVotes}
        players={players}
        votingOrder={votingOrder}
        onNext={advanceAgendaStep}
      />
    );
  }

  // ── Voting screen ───────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full p-5 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h2
          className="text-2xl text-orange-400 text-shadow"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {agendaLabel}
        </h2>
        <button
          onClick={() => { resetAgendaContext(); }}
          className="text-base text-gray-600 hover:text-gray-300 transition-colors"
        >
          ← {'Cambiar'}
        </button>
      </div>

      {/* Vote columns */}
      <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
        {columns.map((col, colIdx) => {
          const total = columnTotals[colIdx];
          const voters = votingOrder
            .map((pIdx) => ({ pIdx, v: playerVotes[pIdx] }))
            .filter(({ v }) => v && v.columnIdx === colIdx);
          const isSelected = selectedColumn === colIdx;
          return (
            <div
              key={colIdx}
              onClick={() => !allVoted && setSelectedColumn(colIdx)}
              className={`flex-shrink-0 w-40 rounded border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'border-orange-400 bg-orange-500/15'
                  : 'border-gray-700 hover:border-gray-500 bg-black/20'
              }`}
            >
              <div className="px-2 pt-2 pb-1 border-b border-gray-700/60">
                <p className="text-sm text-gray-300 font-semibold truncate">{col}</p>
                <p
                  className="text-4xl font-bold"
                  style={{
                    fontFamily: 'var(--font-share-tech-mono)',
                    color: 'var(--color-gold)',
                  }}
                >
                  {total}
                </p>
              </div>
              <div className="px-2 py-1 flex flex-col gap-0.5 min-h-[2rem]">
                {voters.map(({ pIdx, v }) => {
                  const f = FACTIONS[players[pIdx].faction];
                  return (
                    <div key={pIdx} className="flex items-center gap-1">
                      <div className="w-8 h-8 relative flex-shrink-0">
                        <Image src={f.iconPath} alt={f.shortName} fill className="object-contain" unoptimized />
                      </div>
                      <span className="text-sm text-gray-400">
                        {v.amount > 0 ? v.amount : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Add candidate button (for picker types) */}
        {isPicker && (
          <button
            onClick={() => {
              if (voteType === 'ElectPlanet') setPickerOpen('planet');
              else if (voteType === 'ElectLaw') setPickerOpen('law');
              else if (voteType === 'ElectObjective') setPickerOpen('obj');
              else if (voteType === 'ElectStrategy') setPickerOpen('strategy');
              else setPickerOpen('other');
            }}
            className="flex-shrink-0 w-14 rounded border border-dashed border-gray-600 hover:border-orange-500/50 hover:text-orange-400 text-gray-600 text-2xl flex items-center justify-center transition-colors"
          >
            +
          </button>
        )}
      </div>

      {/* Current voter */}
      {currentFaction && currentPlayer && (
        <div
          className={`flex items-center gap-4 p-3 rounded border flex-shrink-0 ${
            isNekro ? 'border-gray-600 opacity-70' : 'border-orange-500/30 bg-orange-500/5'
          }`}
          style={{
            borderColor: isNekro
              ? undefined
              : PLAYER_COLOR_VALUES[PLAYER_COLORS[currentPlayer.color]],
          }}
        >
          <div className="w-20 h-20 relative flex-shrink-0">
            <Image src={currentFaction.iconPath} alt={currentFaction.shortName} fill className="object-contain" unoptimized />
          </div>
          <div>
            <p className="text-2xl text-white text-shadow" style={{ fontFamily: 'var(--font-aldrich)' }}>
              {currentFaction.nameEs} ({currentPlayer.name})
            </p>
            <p className="text-base text-orange-300">
              {isNekro
                ? 'El Virus Nekro no puede votar'
                : 'emite tu voto'}
            </p>
          </div>
          <div
            className="w-2 self-stretch rounded-full ml-auto flex-shrink-0"
            style={{ backgroundColor: PLAYER_COLOR_VALUES[PLAYER_COLORS[currentPlayer.color]] }}
          />
        </div>
      )}

      {/* Keypad */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-base text-gray-500">
            {'Influencia:'}
          </span>
          <span
            className="text-4xl font-bold text-orange-300"
            style={{ fontFamily: 'var(--font-share-tech-mono)' }}
          >
            {keypad}
          </span>
          <button
            onClick={() => setKeypad(0)}
            className="ml-1 text-sm text-gray-600 hover:text-gray-300 border border-gray-700 rounded px-2 py-1"
          >
            ⟳ 0
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 6, 8].map((n) => (
            <button
              key={n}
              onClick={() => setKeypad((v) => v + n)}
              className="w-16 h-12 text-lg border border-gray-600 hover:border-orange-500/50 hover:bg-orange-500/10 text-gray-300 rounded transition-colors"
              style={{ fontFamily: 'var(--font-share-tech-mono)' }}
            >
              +{n}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap flex-shrink-0 mt-auto">
        <button
          onClick={() => resolveVote(false)}
          disabled={selectedColumn === null || isNekro}
          className={`px-6 py-4 text-lg rounded border transition-all ${
            selectedColumn !== null && !isNekro
              ? 'border-orange-500 bg-orange-500/20 text-orange-300 hover:bg-orange-500/40'
              : 'border-gray-800 text-gray-700 cursor-not-allowed'
          }`}
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          {'Confirmar Voto'}
        </button>
        <button
          onClick={() => resolveVote(true)}
          className="px-6 py-4 text-lg border border-gray-600 text-gray-400 hover:text-white rounded transition-colors"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          {'Abstención'}
        </button>
        <button
          onClick={advanceAgendaStep}
          className="px-6 py-4 text-lg border border-orange-500/50 bg-orange-500/10 text-orange-300 hover:bg-orange-500/25 rounded transition-colors ml-auto"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          {'Fin del Voto →'}
        </button>
      </div>

      {/* Picker modals */}
      {pickerOpen === 'planet' && (
        <PickerModal
          title={'Elegir Planeta'}
          onClose={() => setPickerOpen(null)}
        >
          <div className="flex gap-1 mb-3 flex-wrap">
            {(['all', 'cultural', 'hazardous', 'industrial', 'homeworld'] as PlanetFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setPlanetFilter(f)}
                className={`px-2 py-1 text-xs rounded border transition-all ${
                  planetFilter === f
                    ? 'border-orange-400 bg-orange-500/20 text-orange-300'
                    : 'border-gray-700 text-gray-500 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1 overflow-y-auto max-h-64">
            {PLANETS.filter((p) => planetFilter === 'all' || p.type === planetFilter).map((p) => (
              <button
                key={p.name}
                onClick={() => addColumn(p.name)}
                className="px-2 py-1.5 text-xs border border-gray-700 text-gray-300 hover:border-orange-500/50 hover:text-orange-300 rounded text-left transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </PickerModal>
      )}

      {pickerOpen === 'law' && (
        <PickerModal
          title={'Elegir Ley'}
          onClose={() => setPickerOpen(null)}
        >
          <div className="grid grid-cols-1 gap-1 overflow-y-auto max-h-80">
            {LAWS.map((law, i) => {
              const name = law.es;
              return (
                <button
                  key={i}
                  onClick={() => addColumn(name)}
                  className="px-3 py-2 text-xs border border-gray-700 text-gray-300 hover:border-orange-500/50 hover:text-orange-300 rounded text-left transition-colors"
                >
                  {name}
                </button>
              );
            })}
          </div>
        </PickerModal>
      )}

      {pickerOpen === 'obj' && (
        <PickerModal
          title={'Elegir Objetivo'}
          onClose={() => setPickerOpen(null)}
        >
          <div className="grid grid-cols-1 gap-1 overflow-y-auto max-h-80">
            {SECRET_OBJECTIVES.map((obj, i) => {
              const name = obj.es;
              return (
                <button
                  key={i}
                  onClick={() => addColumn(name)}
                  className="px-3 py-2 text-xs border border-gray-700 text-gray-300 hover:border-orange-500/50 hover:text-orange-300 rounded text-left transition-colors"
                >
                  {name}
                </button>
              );
            })}
          </div>
        </PickerModal>
      )}

      {pickerOpen === 'strategy' && (
        <PickerModal
          title={'Elegir Estrategia'}
          onClose={() => setPickerOpen(null)}
        >
          <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-64">
            {STRATEGY_CARD_NAMES.map((card, i) => {
              const name = card.es;
              return (
                <button
                  key={i}
                  onClick={() => addColumn(name)}
                  className="px-3 py-2 text-sm border border-gray-700 text-gray-300 hover:border-orange-500/50 hover:text-orange-300 rounded text-left transition-colors"
                >
                  {i + 1}. {name}
                </button>
              );
            })}
          </div>
        </PickerModal>
      )}

      {pickerOpen === 'other' && (
        <PickerModal
          title={'Propuesta'}
          onClose={() => setPickerOpen(null)}
        >
          <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-64">
            {GENERIC_CHOICES.map((choice, i) => {
              const name = choice.es;
              return (
                <button
                  key={i}
                  onClick={() => addColumn(name)}
                  className="px-3 py-2 text-sm border border-gray-700 text-gray-300 hover:border-orange-500/50 hover:text-orange-300 rounded text-left transition-colors"
                >
                  {name}
                </button>
              );
            })}
          </div>
        </PickerModal>
      )}
    </div>
  );
}

// ─── Results screen ────────────────────────────────────────────────────────────

function ResultsScreen({
  agendaLabel,
  columns,
  columnTotals,
  maxTotal,
  playerVotes,
  players,
  votingOrder,
  onNext,
}: {
  agendaLabel: string;
  columns: string[];
  columnTotals: number[];
  maxTotal: number;
  playerVotes: Record<number, PlayerVote>;
  players: ReturnType<typeof useGameStore.getState>['players'];
  votingOrder: number[];
  onNext: () => void;
}) {
  const hasVotes = columns.length > 0;
  const winners = columns.filter((_, i) => columnTotals[i] === maxTotal && maxTotal > 0);

  return (
    <div className="flex flex-col h-full p-5 gap-4">
      <h2
        className="text-2xl text-orange-400 text-shadow flex-shrink-0"
        style={{ fontFamily: 'var(--font-audiowide)' }}
      >
        {'Resultado — '}{agendaLabel}
      </h2>

      {hasVotes ? (
        <>
          {/* Column totals */}
          <div className="flex gap-3 overflow-x-auto pb-1 flex-shrink-0">
            {columns.map((col, i) => {
              const isWinner = columnTotals[i] === maxTotal && maxTotal > 0;
              return (
                <div
                  key={i}
                  className={`flex-shrink-0 rounded border p-3 min-w-[8rem] text-center ${
                    isWinner
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-gray-700 bg-black/20'
                  }`}
                >
                  <p className={`text-sm font-semibold mb-1 ${isWinner ? 'text-yellow-300' : 'text-gray-400'}`}>
                    {isWinner && '🏆 '}{col}
                  </p>
                  <p
                    className="text-4xl font-bold"
                    style={{
                      fontFamily: 'var(--font-share-tech-mono)',
                      color: isWinner ? '#ffd700' : '#ff6666',
                    }}
                  >
                    {columnTotals[i]}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Winner announcement */}
          {winners.length > 0 && (
            <div className="px-4 py-3 rounded border border-yellow-400/30 bg-yellow-400/5 flex-shrink-0">
              <p className="text-xl text-yellow-300" style={{ fontFamily: 'var(--font-aldrich)' }}>
                {'✓ Resultado: '}{winners.join(', ')}
              </p>
            </div>
          )}

          {/* Per-player vote summary */}
          <div className="flex flex-col gap-1 overflow-y-auto">
            {votingOrder.map((pIdx) => {
              const vote = playerVotes[pIdx];
              const faction = FACTIONS[players[pIdx].faction];
              const colorVal = PLAYER_COLOR_VALUES[PLAYER_COLORS[players[pIdx].color]];
              if (!vote) return null;
              const colName = vote.columnIdx === 'abstain'
                ? ('Abstención')
                : columns[vote.columnIdx as number] ?? '?';
              return (
                <div key={pIdx} className="flex items-center gap-2 text-xs text-gray-400">
                  <div
                    className="w-1 h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colorVal }}
                  />
                  <div className="w-5 h-5 relative flex-shrink-0">
                    <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                  </div>
                  <span className="text-gray-300">{faction.shortName} ({players[pIdx].name})</span>
                  <span className="text-gray-600">→</span>
                  <span className={vote.columnIdx === 'abstain' ? 'text-gray-600 italic' : 'text-white'}>
                    {colName}
                  </span>
                  {vote.columnIdx !== 'abstain' && vote.amount > 0 && (
                    <span className="text-orange-400 ml-auto">{vote.amount} inf</span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500 italic">
          {'Voto omitido'}
        </p>
      )}

      <button
        onClick={onNext}
        className="mt-auto px-6 py-4 text-lg border-2 border-orange-500 bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 rounded transition-all self-end"
        style={{ fontFamily: 'var(--font-aldrich)' }}
      >
        {'Siguiente →'}
      </button>
    </div>
  );
}

// ─── Picker modal wrapper ─────────────────────────────────────────────────────

function PickerModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 border border-orange-500/40 rounded-lg w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
          <h3
            className="text-sm text-orange-400"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-lg leading-none transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
      </div>
    </div>
  );
}
