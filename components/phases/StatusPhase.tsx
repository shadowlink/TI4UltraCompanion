'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { PHASE_END, NO_PLAYER } from '@/lib/constants';
import { formatTime } from '@/lib/timeUtils';

const CHECKLIST_EN = [
  'Remove command tokens from the board',
  'Repair units',
  'Return strategy cards',
  'Score public objectives',
  'Reveal public objective',
  'Draw action cards',
  'Gain and redistribute command tokens',
  'Ready cards',
];
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
  const lang = useGameStore((s) => s.lang);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const strategies = useGameStore((s) => s.strategies);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
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

  // Initiative order: all 9 slots in order, skip NO_PLAYER, DISABLED, and second-picks
  const seenPlayers = new Set<number>();
  const initiativeOrder = strategies
    .map((st, idx) => ({ st, idx }))
    .filter(({ st }) => {
      if (st.playerIdx === NO_PLAYER || st.playerIdx >= 8) return false;
      if (st.secondPickPlayerIdx !== undefined) return false;
      if (seenPlayers.has(st.playerIdx)) return false;
      seenPlayers.add(st.playerIdx);
      return true;
    });

  const activePlayers = players.slice(0, nbPlayers);
  const hasWinner = activePlayers.some((p) => p.vp >= vpWinGoal);
  const checklist = lang === 'es' ? CHECKLIST_ES : CHECKLIST_EN;

  // "Next" from step 0: skip Mecatol Rex if agenda already unlocked
  const handleNextFromStep0 = () => {
    revealNextObjective();
    readyAllTechs();
    if (agendaPhase === 1) {
      newAgenda();
    } else {
      setStatusStep(1);
    }
  };

  const nextLabel =
    agendaPhase === 1
      ? lang === 'es' ? 'Consejo Galáctico →' : 'Galactic Council →'
      : lang === 'es' ? 'Mecatol Rex →' : 'Mecatol Rex →';

  return (
    <div className="flex flex-col h-full p-5 gap-5 overflow-y-auto">
      {/* Header */}
      <h2
        className="text-2xl text-orange-400 text-shadow flex-shrink-0"
        style={{ fontFamily: 'var(--font-audiowide)' }}
      >
        {lang === 'es'
          ? `Ronda ${turnCounter} — Fase de Estado`
          : `Round ${turnCounter} — Status Phase`}
      </h2>

      {statusStep === 0 ? (
        <>
          {/* ── Initiative bar ──────────────────────────────────────── */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 flex-shrink-0">
            {initiativeOrder.map(({ st, idx }, i) => {
              const player = players[st.playerIdx];
              const faction = FACTIONS[player.faction];
              const colorValue = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
              const isSpeaker = st.playerIdx === speakerIdx;
              const isNaaluSlot = idx === 0;
              return (
                <div key={idx} className="flex items-center gap-1 flex-shrink-0">
                  {i > 0 && <span className="text-gray-600 text-xs">→</span>}
                  <div
                    className="flex flex-col items-center gap-1 px-2 py-1.5 rounded border"
                    style={{ borderColor: colorValue, borderWidth: isNaaluSlot ? 2 : 1 }}
                  >
                    <div className="w-16 h-16 relative">
                      <Image
                        src={faction.iconPath}
                        alt={faction.shortName}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="text-center">
                      {isSpeaker && <span className="text-sm text-yellow-400">👑</span>}
                      <p className="text-sm text-gray-300 leading-none">{faction.shortName} ({player.name})</p>
                      {isNaaluSlot && (
                        <p className="text-xs text-purple-400 leading-none">0</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── VP editor ────────────────────────────────────────────── */}
          <div
            className="grid gap-2 flex-shrink-0"
            style={{ gridTemplateColumns: `repeat(${Math.min(nbPlayers, 6)}, 1fr)` }}
          >
            {activePlayers.map((player, i) => {
              const faction = FACTIONS[player.faction];
              const colorValue = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
              const isWinner = player.vp >= vpWinGoal;
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-1 p-2 rounded border ${
                    isWinner ? 'ring-2 ring-yellow-400/60' : ''
                  }`}
                  style={{ borderColor: colorValue, borderWidth: 2 }}
                >
                  <div className="w-16 h-16 relative">
                    <Image
                      src={faction.iconPath}
                      alt={faction.shortName}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <span className="text-sm text-gray-300 leading-none truncate max-w-full px-1">
                    {faction.shortName} ({player.name})
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <button
                      onClick={() => incrementVP(i, -1)}
                      className="w-10 h-10 rounded border border-gray-600 text-gray-400 hover:text-white hover:bg-white/10 text-xl leading-none transition-colors"
                    >
                      −
                    </button>
                    <span
                      className="text-5xl font-bold text-shadow min-w-[2ch] text-center"
                      style={{
                        fontFamily: 'var(--font-share-tech-mono)',
                        color: isWinner ? '#ffd700' : '#ff6666',
                      }}
                    >
                      {player.vp}
                    </span>
                    <button
                      onClick={() => incrementVP(i, 1)}
                      className="w-10 h-10 rounded border border-orange-500/50 text-orange-300 hover:bg-orange-500/20 text-xl leading-none transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {isWinner && (
                    <span className="text-base text-yellow-400">🏆</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Status checklist ─────────────────────────────────────── */}
          <div className="border border-gray-700/50 rounded p-3 flex-shrink-0">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
              {lang === 'es' ? 'Lista de Estado' : 'Status Checklist'}
            </p>
            <ol className="space-y-1">
              {checklist.map((step, i) => (
                <li key={i} className="text-base text-gray-300 flex gap-2 leading-relaxed">
                  <span className="text-orange-400/70 flex-shrink-0 tabular-nums">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* ── Bottom buttons ───────────────────────────────────────── */}
          <div className="flex items-center justify-between flex-shrink-0 gap-3">
            {hasWinner ? (
              <button
                onClick={() => setPhase(PHASE_END)}
                className="flex-1 px-4 py-4 text-xl border-2 border-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/40 text-yellow-200 rounded transition-all"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                🏆 {lang === 'es' ? 'Fin del Juego' : 'End Game'}
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNextFromStep0}
              className="px-5 py-4 text-lg border border-orange-500/60 bg-orange-500/10 hover:bg-orange-500/25 text-orange-300 rounded transition-all"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {nextLabel}
            </button>
          </div>
        </>
      ) : (
        /* ── Mecatol Rex choice (step 1) ─────────────────────────── */
        <MecatolRexStep
          lang={lang}
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
  lang,
  gameDuration,
  turnCounter,
  onCaptured,
  onNotCaptured,
}: {
  lang: string;
  gameDuration: number;
  turnCounter: number;
  onCaptured: () => void;
  onNotCaptured: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 px-4">
      <div className="text-center">
        <h3
          className="text-2xl text-orange-400 text-shadow mb-1"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          Mecatol Rex
        </h3>
        <p className="text-sm text-gray-400">
          {lang === 'es'
            ? '¿Los Custodios siguen guardando Mecatol Rex?'
            : 'Are the Custodians still guarding Mecatol Rex?'}
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={onCaptured}
          className="w-full px-5 py-4 text-sm border-2 border-orange-500 bg-orange-500/15 hover:bg-orange-500/30 text-orange-200 rounded transition-all text-left"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          <span className="block text-base mb-0.5">
            {lang === 'es' ? '⚔ Los Custodios han sido derrotados' : '⚔ The Custodians have been defeated'}
          </span>
          <span className="text-xs text-orange-400/70">
            {lang === 'es'
              ? '→ Desbloquea el Consejo Galáctico para siempre'
              : '→ Unlocks the Galactic Council permanently'}
          </span>
        </button>

        <button
          onClick={onNotCaptured}
          className="w-full px-5 py-4 text-sm border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white rounded transition-all text-left"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          <span className="block text-base mb-0.5">
            {lang === 'es'
              ? '🛡 Los Custodios siguen guardando Mecatol Rex'
              : '🛡 The Custodians are still guarding Mecatol Rex'}
          </span>
          <span className="text-xs text-gray-500">
            {lang === 'es' ? '→ Nueva ronda sin agenda' : '→ New round, no agenda'}
          </span>
        </button>
      </div>

      <div
        className="text-center text-xs text-gray-600"
        style={{ fontFamily: 'var(--font-share-tech-mono)' }}
      >
        {lang === 'es' ? 'Ronda' : 'Round'} {turnCounter} ·{' '}
        {formatTime(gameDuration)}
      </div>
    </div>
  );
}
