'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { PHASE_END } from '@/lib/constants';
import { formatTime } from '@/lib/timeUtils';
import Panel from '@/components/ui/Panel';
import Button from '@/components/ui/Button';
import {
  Check,
  Plus,
  Minus,
  ArrowRight,
  Trophy,
  Swords,
  Shield,
} from '@/components/ui/icons';

const CHECKLIST_ES = [
  'Retirar fichas de mando del tablero',
  'Reparar unidades',
  'Devolver cartas de estrategia',
  'Puntuar objetivos públicos',
  'Revelar objetivo público',
  'Robar cartas de acción',
  'Ganar y redistribuir fichas de mando',
  'Preparar cartas',
];

export default function StatusPhase() {
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const gameDuration = useGameStore((s) => s.gameDuration);
  const vpWinGoal = useGameStore((s) => s.options.vpWinGoal);
  const statusStep = useGameStore((s) => s.statusStep);
  const agendaPhase = useGameStore((s) => s.agendaPhase);
  const setStatusStep = useGameStore((s) => s.setStatusStep);
  const setAgendaPhase = useGameStore((s) => s.setAgendaPhase);
  const setPhase = useGameStore((s) => s.setPhase);
  const incrementVP = useGameStore((s) => s.incrementVP);
  const newAgenda = useGameStore((s) => s.newAgenda);
  const newTurn = useGameStore((s) => s.newTurn);
  const revealNextObjective = useGameStore((s) => s.revealNextObjective);
  const readyAllTechs = useGameStore((s) => s.readyAllTechs);

  const activePlayers = players.slice(0, nbPlayers);
  const hasWinner = activePlayers.some((p) => p.vp >= vpWinGoal);

  const handleNextFromStep0 = () => {
    revealNextObjective();
    readyAllTechs();
    if (agendaPhase === 1) {
      newAgenda();
    } else {
      setStatusStep(1);
    }
  };

  const nextLabel = agendaPhase === 1 ? 'Consejo Galáctico' : 'Mecatol Rex';

  const compact = nbPlayers >= 7;
  const vpCols = Math.min(nbPlayers, 8);

  return (
    <div className="flex flex-col h-full p-5 gap-5">
      {/* Header */}
      <h2
        className="text-2xl text-[color:var(--accent-soft)] text-shadow flex-shrink-0"
        style={{ fontFamily: 'var(--font-audiowide)' }}
      >
        {`Ronda ${turnCounter} — Fase de Estado`}
      </h2>

      {statusStep === 0 ? (
        <>
          {/* ── VP editor ────────────────────────────────────────────── */}
          <div
            className="grid gap-2 flex-shrink-0"
            style={{ gridTemplateColumns: `repeat(${vpCols}, minmax(0, 1fr))` }}
          >
            {activePlayers.map((player, i) => {
              const faction = FACTIONS[player.faction];
              const colorValue = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
              const isWinner = player.vp >= vpWinGoal;
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-1 p-2 rounded-[var(--radius)] border-2 bg-[var(--bg-surface)] ${
                    isWinner ? 'ring-2 ring-[color:var(--vp-gold)]/60' : ''
                  }`}
                  style={{ borderColor: colorValue }}
                >
                  <div className={`relative ${compact ? 'w-12 h-12' : 'w-16 h-16'}`}>
                    <Image
                      src={faction.iconPath}
                      alt={faction.shortName}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <span className="text-sm text-[color:var(--text-secondary)] leading-none truncate max-w-full px-1">
                    {faction.shortName} ({player.name})
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <button
                      onClick={() => incrementVP(i, -1)}
                      className={`${compact ? 'w-8 h-8' : 'w-9 h-9'} rounded-[var(--radius)] border border-white/10 text-[color:var(--text-muted)] hover:text-white hover:bg-white/5 inline-flex items-center justify-center transition-colors pointer-events-auto`}
                      aria-label="Restar VP"
                    >
                      <Minus size={14} strokeWidth={2} />
                    </button>
                    <span
                      className={`${compact ? 'text-4xl' : 'text-5xl'} font-bold text-shadow min-w-[2ch] text-center`}
                      style={{
                        fontFamily: 'var(--font-share-tech-mono)',
                        color: isWinner ? 'var(--vp-gold)' : 'var(--text-primary)',
                      }}
                    >
                      {player.vp}
                    </span>
                    <button
                      onClick={() => incrementVP(i, 1)}
                      className={`${compact ? 'w-8 h-8' : 'w-9 h-9'} rounded-[var(--radius)] border border-[color:var(--accent-border)] text-[color:var(--accent-soft)] hover:bg-[color:var(--accent)]/15 inline-flex items-center justify-center transition-colors pointer-events-auto`}
                      aria-label="Sumar VP"
                    >
                      <Plus size={14} strokeWidth={2} />
                    </button>
                  </div>
                  {isWinner && (
                    <Trophy size={16} className="text-[color:var(--vp-gold)]" strokeWidth={2} aria-hidden />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Status checklist ─────────────────────────────────────── */}
          <Panel variant="subtle" className="p-3 flex-shrink-0">
            <p
              className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider mb-2"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {'Lista de Estado'}
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {CHECKLIST_ES.map((step, i) => (
                <li key={i} className="text-sm text-[color:var(--text-secondary)] flex items-start gap-2 leading-relaxed">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[color:var(--accent-border-faint)] text-[10px] text-[color:var(--accent-soft)] flex-shrink-0 mt-0.5 tabular-nums" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* ── Bottom buttons (pinned to bottom-right corner) ──────────── */}
          <div className="flex items-center justify-between flex-shrink-0 gap-3 mt-auto">
            {hasWinner ? (
              <Button
                onClick={() => setPhase(PHASE_END)}
                variant="warning"
                size="lg"
                icon={Trophy}
              >
                {'Fin del Juego'}
              </Button>
            ) : (
              <div />
            )}
            <Button
              onClick={handleNextFromStep0}
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
            >
              {nextLabel}
            </Button>
          </div>
        </>
      ) : (
        <MecatolRexStep
          gameDuration={gameDuration}
          turnCounter={turnCounter}
          onCaptured={() => { setAgendaPhase(1); newAgenda(); }}
          onNotCaptured={() => newTurn()}
        />
      )}
    </div>
  );
}

// ─── Mecatol Rex step ─────────────────────────────────────────────────────────

function MecatolRexStep({
  gameDuration,
  turnCounter,
  onCaptured,
  onNotCaptured,
}: {
  gameDuration: number;
  turnCounter: number;
  onCaptured: () => void;
  onNotCaptured: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 px-4">
      <div className="text-center">
        <h3
          className="text-2xl text-[color:var(--accent-soft)] text-shadow mb-1"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          Mecatol Rex
        </h3>
        <p className="text-sm text-[color:var(--text-secondary)]">
          {'¿Los Custodios siguen guardando Mecatol Rex?'}
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={onCaptured}
          className="w-full px-5 py-4 rounded-[var(--radius)] border-2 border-[color:var(--accent-border-strong)] bg-[color:var(--accent)]/15 hover:bg-[color:var(--accent)]/25 transition-all text-left pointer-events-auto"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          <span className="flex items-center gap-2 text-base text-[color:var(--accent-soft)] mb-0.5">
            <Swords size={18} strokeWidth={2} aria-hidden />
            {'Los Custodios han sido derrotados'}
          </span>
          <span className="text-xs text-[color:var(--accent-soft)]/70 ml-7">
            {'→ Desbloquea el Consejo Galáctico para siempre'}
          </span>
        </button>

        <button
          onClick={onNotCaptured}
          className="w-full px-5 py-4 rounded-[var(--radius)] border border-white/10 hover:border-white/20 text-[color:var(--text-secondary)] hover:text-white transition-all text-left pointer-events-auto"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          <span className="flex items-center gap-2 text-base mb-0.5">
            <Shield size={18} strokeWidth={2} aria-hidden />
            {'Los Custodios siguen guardando Mecatol Rex'}
          </span>
          <span className="text-xs text-[color:var(--text-muted)] ml-7">
            {'→ Nueva ronda sin agenda'}
          </span>
        </button>
      </div>

      <div
        className="inline-flex items-center gap-1 text-xs text-[color:var(--text-muted)]"
        style={{ fontFamily: 'var(--font-share-tech-mono)' }}
      >
        <Check size={12} strokeWidth={2} aria-hidden />
        {'Ronda'} {turnCounter} ·{' '}
        {formatTime(gameDuration)}
      </div>
    </div>
  );
}
