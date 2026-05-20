'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { PLANETS } from '@/data/planets';
import { LAWS, SECRET_OBJECTIVES, STRATEGY_CARD_NAMES, GENERIC_CHOICES } from '@/data/laws';
import { NEKRO_FACTION, VOTE_PASS, NO_PLAYER } from '@/lib/constants';
import Panel from '@/components/ui/Panel';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import {
  ArrowRight,
  ChevronLeft,
  Plus,
  RefreshCw,
  Trophy,
  Check,
} from '@/components/ui/icons';

type VoteType =
  | 'ForAgainst'
  | 'ElectPlayer'
  | 'ElectPlanet'
  | 'ElectLaw'
  | 'ElectObjective'
  | 'ElectStrategy'
  | 'ElectOther';

type PlanetFilter = 'all' | 'cultural' | 'hazardous' | 'industrial' | 'homeworld';

interface PlayerVote {
  columnIdx: number | 'abstain';
  amount: number;
}

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

  useEffect(() => {
    setPlayerVotes({});
    setSelectedColumn(null);
    setKeypad(0);
    setPickerOpen(null);
  }, [agendaStep]);

  useEffect(() => {
    if (stage === 'voting' && votingPlayerIdx === NO_PLAYER) {
      setAgendaStage('results');
    }
  }, [stage, votingPlayerIdx, setAgendaStage]);

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
    agendaStep === 1 ? 'Primera Carta del Consejo' : 'Segunda Carta del Consejo';

  const votingOrder = Array.from(
    { length: nbPlayers },
    (_, i) => (speakerIdx + 1 + i) % nbPlayers
  );
  const allVoted = votingPlayerIdx === NO_PLAYER;
  const currentVoterIdx = allVoted ? -1 : votingPlayerIdx;
  const currentPlayer = currentVoterIdx >= 0 ? players[currentVoterIdx] : null;
  const currentFaction = currentPlayer ? FACTIONS[currentPlayer.faction] : null;
  const isNekro = currentPlayer?.faction === NEKRO_FACTION;

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
        cols = ['A Favor', 'En Contra'];
        break;
      case 'ElectPlayer':
        cols = players.slice(0, nbPlayers).map((p) => `${FACTIONS[p.faction].shortName} (${p.name})`);
        break;
      default:
        cols = [];
    }
    setAgendaColumns(cols);
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
    nextVotingPlayer();
  };

  // ── Type select screen ──────────────────────────────────────────────────────

  if (stage === 'type_select') {
    const types: [VoteType, string][] = [
      ['ForAgainst', 'A Favor / En Contra'],
      ['ElectPlayer', 'Elegir Jugador'],
      ['ElectPlanet', 'Elegir Planeta'],
      ['ElectLaw', 'Elegir Ley'],
      ['ElectObjective', 'Elegir Objetivo'],
      ['ElectStrategy', 'Carta de Estrategia'],
      ['ElectOther', 'Propuesta Genérica'],
    ];
    return (
      <div className="flex flex-col h-full p-5 gap-4">
        <div className="flex-shrink-0">
          <h2
            className="text-2xl text-[color:var(--accent-soft)] text-shadow"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {`Ronda ${turnCounter} — ${agendaLabel}`}
          </h2>
          <p className="text-base text-[color:var(--text-secondary)] mt-1">
            {'¿Qué tipo de voto?'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {types.map(([type, labelEs]) => (
            <Button
              key={type}
              onClick={() => startVoting(type)}
              variant="secondary"
              size="lg"
              className="justify-start"
            >
              {labelEs}
            </Button>
          ))}
        </div>
        <Button
          onClick={advanceAgendaStep}
          variant="ghost"
          size="md"
          icon={ArrowRight}
          iconPosition="right"
          className="mt-auto self-start"
        >
          {'Omitir este consejo'}
        </Button>
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
      <div className="flex items-center justify-between flex-shrink-0">
        <h2
          className="text-2xl text-[color:var(--accent-soft)] text-shadow"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {agendaLabel}
        </h2>
        <Button onClick={() => resetAgendaContext()} variant="ghost" size="sm" icon={ChevronLeft}>
          {'Cambiar'}
        </Button>
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
              className={`flex-shrink-0 w-40 rounded-[var(--radius)] border transition-all cursor-pointer select-none pointer-events-auto ${
                isSelected
                  ? 'border-[color:var(--accent-border-strong)] bg-[color:var(--accent)]/15'
                  : 'border-white/10 hover:border-[color:var(--accent-border)] bg-[var(--bg-surface)]'
              }`}
            >
              <div className="px-2 pt-2 pb-1 border-b border-white/5">
                <p className="text-sm text-[color:var(--text-secondary)] font-semibold truncate">{col}</p>
                <p
                  className="text-4xl font-bold"
                  style={{
                    fontFamily: 'var(--font-share-tech-mono)',
                    color: 'var(--vp-gold)',
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
                      <span className="text-sm text-[color:var(--text-secondary)]">
                        {v.amount > 0 ? v.amount : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {isPicker && (
          <button
            onClick={() => {
              if (voteType === 'ElectPlanet') setPickerOpen('planet');
              else if (voteType === 'ElectLaw') setPickerOpen('law');
              else if (voteType === 'ElectObjective') setPickerOpen('obj');
              else if (voteType === 'ElectStrategy') setPickerOpen('strategy');
              else setPickerOpen('other');
            }}
            className="flex-shrink-0 w-14 rounded-[var(--radius)] border border-dashed border-white/15 hover:border-[color:var(--accent-border-strong)] hover:text-[color:var(--accent-soft)] text-[color:var(--text-muted)] inline-flex items-center justify-center transition-colors pointer-events-auto"
            aria-label="Añadir candidato"
          >
            <Plus size={22} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Current voter */}
      {currentFaction && currentPlayer && (
        <Panel
          variant={isNekro ? 'subtle' : 'accent'}
          className={`flex items-center gap-4 p-3 flex-shrink-0 ${isNekro ? 'opacity-70' : ''}`}
          style={
            isNekro
              ? undefined
              : { borderColor: PLAYER_COLOR_VALUES[PLAYER_COLORS[currentPlayer.color]] }
          }
        >
          <div className="w-20 h-20 relative flex-shrink-0">
            <Image src={currentFaction.iconPath} alt={currentFaction.shortName} fill className="object-contain" unoptimized />
          </div>
          <div>
            <p className="text-2xl text-white text-shadow" style={{ fontFamily: 'var(--font-aldrich)' }}>
              {currentFaction.nameEs} ({currentPlayer.name})
            </p>
            <p className="text-base text-[color:var(--accent-soft)]">
              {isNekro ? 'El Virus Nekro no puede votar' : 'emite tu voto'}
            </p>
          </div>
          <div
            className="w-2 self-stretch rounded-full ml-auto flex-shrink-0"
            style={{ backgroundColor: PLAYER_COLOR_VALUES[PLAYER_COLORS[currentPlayer.color]] }}
          />
        </Panel>
      )}

      {/* Keypad */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-base text-[color:var(--text-muted)]">{'Influencia:'}</span>
          <span
            className="text-4xl font-bold text-[color:var(--accent-soft)]"
            style={{ fontFamily: 'var(--font-share-tech-mono)' }}
          >
            {keypad}
          </span>
          <Button onClick={() => setKeypad(0)} variant="ghost" size="sm" icon={RefreshCw}>
            {'0'}
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 6, 8].map((n) => (
            <button
              key={n}
              onClick={() => setKeypad((v) => v + n)}
              className="w-16 h-12 text-lg border border-white/10 hover:border-[color:var(--accent-border)] hover:bg-[color:var(--accent)]/10 text-[color:var(--text-secondary)] rounded-[var(--radius)] transition-colors pointer-events-auto"
              style={{ fontFamily: 'var(--font-share-tech-mono)' }}
            >
              +{n}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap flex-shrink-0 mt-auto">
        <Button
          onClick={() => resolveVote(false)}
          disabled={selectedColumn === null || isNekro}
          variant="primary"
          size="lg"
          icon={Check}
        >
          {'Confirmar Voto'}
        </Button>
        <Button onClick={() => resolveVote(true)} variant="ghost" size="lg">
          {'Abstención'}
        </Button>
        <Button
          onClick={advanceAgendaStep}
          variant="secondary"
          size="lg"
          icon={ArrowRight}
          iconPosition="right"
          className="ml-auto"
        >
          {'Fin del Voto'}
        </Button>
      </div>

      {/* Picker modals */}
      <Modal open={pickerOpen === 'planet'} onClose={() => setPickerOpen(null)} title="Elegir Planeta">
        <div className="p-4">
          <div className="flex gap-1 mb-3 flex-wrap">
            {(['all', 'cultural', 'hazardous', 'industrial', 'homeworld'] as PlanetFilter[]).map((f) => (
              <Button
                key={f}
                onClick={() => setPlanetFilter(f)}
                variant="secondary"
                size="sm"
                selected={planetFilter === f}
              >
                {f}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1 overflow-y-auto max-h-64">
            {PLANETS.filter((p) => planetFilter === 'all' || p.type === planetFilter).map((p) => (
              <button
                key={p.name}
                onClick={() => addColumn(p.name)}
                className="px-2 py-1.5 text-xs border border-white/10 text-[color:var(--text-secondary)] hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent-soft)] rounded-[var(--radius)] text-left transition-colors pointer-events-auto"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal open={pickerOpen === 'law'} onClose={() => setPickerOpen(null)} title="Elegir Ley">
        <div className="p-4 grid grid-cols-1 gap-1 overflow-y-auto max-h-80">
          {LAWS.map((law, i) => (
            <button
              key={i}
              onClick={() => addColumn(law.es)}
              className="px-3 py-2 text-xs border border-white/10 text-[color:var(--text-secondary)] hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent-soft)] rounded-[var(--radius)] text-left transition-colors pointer-events-auto"
            >
              {law.es}
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={pickerOpen === 'obj'} onClose={() => setPickerOpen(null)} title="Elegir Objetivo">
        <div className="p-4 grid grid-cols-1 gap-1 overflow-y-auto max-h-80">
          {SECRET_OBJECTIVES.map((obj, i) => (
            <button
              key={i}
              onClick={() => addColumn(obj.es)}
              className="px-3 py-2 text-xs border border-white/10 text-[color:var(--text-secondary)] hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent-soft)] rounded-[var(--radius)] text-left transition-colors pointer-events-auto"
            >
              {obj.es}
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={pickerOpen === 'strategy'} onClose={() => setPickerOpen(null)} title="Elegir Estrategia">
        <div className="p-4 grid grid-cols-2 gap-2 overflow-y-auto max-h-64">
          {STRATEGY_CARD_NAMES.map((card, i) => (
            <button
              key={i}
              onClick={() => addColumn(card.es)}
              className="px-3 py-2 text-sm border border-white/10 text-[color:var(--text-secondary)] hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent-soft)] rounded-[var(--radius)] text-left transition-colors pointer-events-auto"
            >
              {i + 1}. {card.es}
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={pickerOpen === 'other'} onClose={() => setPickerOpen(null)} title="Propuesta">
        <div className="p-4 grid grid-cols-2 gap-2 overflow-y-auto max-h-64">
          {GENERIC_CHOICES.map((choice, i) => (
            <button
              key={i}
              onClick={() => addColumn(choice.es)}
              className="px-3 py-2 text-sm border border-white/10 text-[color:var(--text-secondary)] hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent-soft)] rounded-[var(--radius)] text-left transition-colors pointer-events-auto"
            >
              {choice.es}
            </button>
          ))}
        </div>
      </Modal>
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
        className="text-2xl text-[color:var(--accent-soft)] text-shadow flex-shrink-0"
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
                  className={`flex-shrink-0 rounded-[var(--radius)] border p-4 min-w-[10rem] text-center ${
                    isWinner
                      ? 'border-[color:var(--vp-gold)] bg-[color:var(--vp-gold)]/10'
                      : 'border-white/10 bg-[var(--bg-surface)]'
                  }`}
                >
                  <div className={`text-base font-semibold mb-1.5 flex items-center justify-center gap-1.5 ${isWinner ? 'text-[color:var(--vp-gold)]' : 'text-[color:var(--text-secondary)]'}`}>
                    {isWinner && <Trophy size={16} strokeWidth={2} aria-hidden />}
                    {col}
                  </div>
                  <p
                    className="text-5xl font-bold"
                    style={{
                      fontFamily: 'var(--font-share-tech-mono)',
                      color: isWinner ? 'var(--vp-gold)' : 'var(--text-primary)',
                    }}
                  >
                    {columnTotals[i]}
                  </p>
                </div>
              );
            })}
          </div>

          {winners.length > 0 && (
            <Panel
              variant="accent"
              className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
              style={{ borderColor: 'var(--vp-gold)', background: 'rgba(255, 213, 122, 0.08)' }}
            >
              <Trophy size={24} className="text-[color:var(--vp-gold)]" strokeWidth={2} aria-hidden />
              <p className="text-2xl text-[color:var(--vp-gold)]" style={{ fontFamily: 'var(--font-aldrich)' }}>
                {'Resultado: '}{winners.join(', ')}
              </p>
            </Panel>
          )}

          {/* Per-player vote summary */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            {votingOrder.map((pIdx) => {
              const vote = playerVotes[pIdx];
              const faction = FACTIONS[players[pIdx].faction];
              const colorVal = PLAYER_COLOR_VALUES[PLAYER_COLORS[players[pIdx].color]];
              if (!vote) return null;
              const colName = vote.columnIdx === 'abstain'
                ? 'Abstención'
                : columns[vote.columnIdx as number] ?? '?';
              return (
                <div
                  key={pIdx}
                  className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius)] border border-white/5 bg-[var(--bg-surface)]"
                >
                  <div
                    className="w-1 h-8 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colorVal }}
                  />
                  <div className="w-8 h-8 relative flex-shrink-0">
                    <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                  </div>
                  <span className="text-base text-white" style={{ fontFamily: 'var(--font-electrolize)' }}>
                    {faction.shortName} ({players[pIdx].name})
                  </span>
                  <ArrowRight size={14} className="text-[color:var(--text-muted)]" strokeWidth={2} aria-hidden />
                  <span
                    className={`text-base ${vote.columnIdx === 'abstain' ? 'text-[color:var(--text-muted)] italic' : 'text-white font-semibold'}`}
                  >
                    {colName}
                  </span>
                  {vote.columnIdx !== 'abstain' && vote.amount > 0 && (
                    <span
                      className="text-base text-[color:var(--accent-soft)] ml-auto"
                      style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                    >
                      {vote.amount} inf
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-base text-[color:var(--text-muted)] italic">{'Voto omitido'}</p>
      )}

      <Button
        onClick={onNext}
        variant="primary"
        size="lg"
        icon={ArrowRight}
        iconPosition="right"
        className="mt-auto self-end"
      >
        {'Siguiente'}
      </Button>
    </div>
  );
}
