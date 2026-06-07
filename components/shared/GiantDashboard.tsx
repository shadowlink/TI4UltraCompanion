'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { OBJECTIVES_BY_ID } from '@/data/publicObjectives';
import { getStrategyShort } from '@/data/strategyActions';
import { useActiveDecisionPlayer } from '@/hooks/useActiveDecisionPlayer';
import { formatTime } from '@/lib/timeUtils';
import { NO_PLAYER, STRATEGY_PLAYED, STRATEGY_PASSED } from '@/lib/constants';
import { Crown, Swords, Rocket, Star, Lock, Timer } from '@/components/ui/icons';

const PHASE_LABELS: Record<number, string> = {
  2: 'Fase de Estrategia',
  3: 'Fase de Acción',
  4: 'Fase de Estado',
  5: 'Fase de Consejo Galáctico',
};

const STAGE_COLORS: Record<number, string> = { 1: '#3a9ad9', 2: '#d97a3a' };

/**
 * Dashboard de presentación a pantalla completa (1920×1080) para el modo gigante,
 * solo lectura. Tres bandas sin scroll: banner de fase, tarjetas de jugadores
 * (resaltando al que está en turno y reflejando su carta de estrategia), y los
 * objetivos públicos en grande.
 */
export default function GiantDashboard() {
  const phase = useGameStore((s) => s.phase);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const strategies = useGameStore((s) => s.strategies);
  const objectiveDeck = useGameStore((s) => s.objectiveDeck);
  const revealedCount = useGameStore((s) => s.revealedCount);
  const objectivesScoredBy = useGameStore((s) => s.objectivesScoredBy);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const showFactionClock = useGameStore((s) => s.options.showFactionClock);
  const gameDuration = useGameStore((s) => s.gameDuration);
  const decisionTimerRemaining = useGameStore((s) => s.decisionTimerRemaining);
  const decisionTimerLimit = useGameStore((s) => s.options.decisionTimerLimit);
  const activeIdx = useActiveDecisionPlayer();

  const activePlayers = players.slice(0, nbPlayers);
  const decisionActive = activeIdx !== NO_PLAYER;
  const decisionPct = decisionActive ? Math.max(0, (decisionTimerRemaining / decisionTimerLimit) * 100) : 0;
  const decisionRed = decisionActive && decisionTimerRemaining <= 5;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[var(--bg-app)] select-none">
      {/* ── Banner: fase + ronda · contador de partida · barra de decisión ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between gap-6 px-8 py-3 border-b border-[color:var(--accent-border-strong)] bg-[color:var(--accent)]/10"
      >
        <div className="flex items-baseline gap-3 min-w-0">
          <span
            className="text-5xl text-[color:var(--accent-soft)] text-shadow tracking-wide truncate"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {PHASE_LABELS[phase] ?? 'Twilight Imperium'}
          </span>
          <span
            className="text-3xl text-[color:var(--text-secondary)] flex-shrink-0"
            style={{ fontFamily: 'var(--font-share-tech-mono)' }}
          >
            {`· Ronda ${turnCounter}`}
          </span>
        </div>

        <div className="flex items-center gap-8 flex-shrink-0">
          {/* Contador de partida */}
          <span
            className="flex items-center gap-2 text-4xl text-white"
            style={{ fontFamily: 'var(--font-share-tech-mono)' }}
          >
            <Timer size={28} className="text-[color:var(--accent)]" strokeWidth={2} aria-hidden />
            {formatTime(gameDuration)}
          </span>

          {/* Barra de decisión (90s) */}
          <div className="flex items-center gap-3 w-80">
            <div className="flex-1 h-3 bg-white/10 rounded overflow-hidden">
              <div
                className="h-full rounded transition-[width,background-color] duration-500 ease-out"
                style={{ width: `${decisionPct}%`, background: decisionRed ? 'var(--danger)' : 'var(--accent)' }}
              />
            </div>
            <span
              className="text-4xl font-bold tabular-nums w-16 text-right transition-colors duration-300"
              style={{
                fontFamily: 'var(--font-share-tech-mono)',
                color: decisionRed ? 'var(--danger)' : 'var(--text-secondary)',
              }}
            >
              {!decisionActive ? '—' : decisionTimerRemaining > 0 ? decisionTimerRemaining : '0'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tarjetas de jugadores ────────────────────────────────────────── */}
      <div
        className="flex-[4] min-h-0 grid gap-3 p-4"
        style={{ gridTemplateColumns: `repeat(${Math.max(1, nbPlayers)}, minmax(0, 1fr))` }}
      >
        {activePlayers.map((player, i) => {
          const faction = FACTIONS[player.faction];
          if (!faction) return null;
          const colorValue = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
          const isActive = activeIdx === i;
          const isAbandoned = player.abandoned;
          const tokens = player.commandTokens ?? { tactic: 0, fleet: 0, strategy: 0 };
          const myStrats = strategies
            .map((st, idx) => ({ st, idx }))
            .filter(({ st }) => st.playerIdx === i && !st.isNaaluSlot);

          return (
            <div
              key={i}
              className={`relative flex flex-col items-center rounded-[var(--radius-lg)] border-2 p-2 bg-[var(--bg-surface)] overflow-hidden transition-all ${
                isAbandoned ? 'opacity-40 grayscale' : ''
              }`}
              style={{
                borderColor: colorValue,
                boxShadow: isActive ? `0 0 28px ${colorValue}, inset 0 0 24px ${colorValue}30` : undefined,
                background: isActive ? `linear-gradient(180deg, ${colorValue}22 0%, rgba(0,0,0,0.6) 100%)` : undefined,
              }}
            >
              {/* Fila reservada para el indicador de turno (mantiene alineadas todas las tarjetas) */}
              <div className="h-5 flex items-center justify-center flex-shrink-0">
                {isActive && !isAbandoned && (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider bg-[color:var(--accent)] text-black font-bold"
                    style={{ fontFamily: 'var(--font-aldrich)' }}
                  >
                    En turno
                  </span>
                )}
              </div>

              {/* Facción + nombre */}
              <div className="flex items-center gap-1.5">
                {speakerIdx === i && (
                  <Crown size={18} className="text-[color:var(--warning)]" strokeWidth={2} aria-label="Portavoz" />
                )}
                <span
                  className="text-sm uppercase tracking-wider text-[color:var(--text-secondary)] truncate max-w-full"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  {faction.shortName}
                </span>
              </div>
              <div className="w-14 h-14 relative my-0.5">
                <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
              </div>
              {player.name && (
                <span
                  className="text-xl font-bold text-white text-shadow leading-tight truncate max-w-full"
                  style={{ fontFamily: 'var(--font-electrolize)', color: colorValue }}
                >
                  {player.name}
                </span>
              )}

              {/* VP */}
              <span
                className="text-4xl font-bold leading-none my-0.5 text-shadow"
                style={{ fontFamily: 'var(--font-share-tech-mono)', color: 'var(--vp-gold)' }}
              >
                {player.vp}
              </span>

              {showFactionClock && (
                <span
                  className="text-sm text-[color:var(--text-muted)] leading-none mb-1"
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  {formatTime(player.clock ?? 0)}
                </span>
              )}

              {/* Fichas de mando */}
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1">
                  <Swords size={18} className="text-[color:var(--accent)]" strokeWidth={2} aria-hidden />
                  <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{tokens.tactic}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Rocket size={18} className="text-[color:var(--info)]" strokeWidth={2} aria-hidden />
                  <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{tokens.fleet}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Star size={18} className="text-[color:var(--success)]" strokeWidth={2} aria-hidden />
                  <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{tokens.strategy}</span>
                </span>
              </div>

              {/* Carta(s) de estrategia elegida(s) — reflejo de la selección en el móvil */}
              <div className="flex flex-col gap-1 w-full mt-auto">
                {myStrats.length === 0 ? (
                  <span className="text-sm text-[color:var(--text-muted)] italic text-center">
                    {phase === 2 ? 'Sin estrategia' : '—'}
                  </span>
                ) : (
                  myStrats.map(({ st, idx }) => {
                    const played = st.status === STRATEGY_PLAYED;
                    const passed = st.status === STRATEGY_PASSED;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-2 py-0.5 rounded-[var(--radius)] border ${played || passed ? 'opacity-50' : ''}`}
                        style={{ borderColor: st.color, background: `${st.color}1a` }}
                      >
                        <span
                          className="text-xl font-bold leading-none"
                          style={{ fontFamily: 'var(--font-share-tech-mono)', color: st.color }}
                        >
                          {idx}
                        </span>
                        <span
                          className={`text-sm truncate ${played ? 'line-through text-[color:var(--text-muted)]' : 'text-white'}`}
                          style={{ fontFamily: 'var(--font-aldrich)' }}
                        >
                          {getStrategyShort(st.nameEn, st.nameEs)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Objetivos públicos ───────────────────────────────────────────── */}
      <div className="flex-[7] min-h-0 overflow-hidden border-t border-orange-500/20 bg-gray-900/60 p-3">
        <div
          className="grid gap-3 h-full"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gridAutoRows: '1fr' }}
        >
          {objectiveDeck.map((id, idx) => {
            const obj = OBJECTIVES_BY_ID[id];
            if (!obj) return null;
            const revealed = idx < revealedCount;
            const stageColor = STAGE_COLORS[obj.stage] ?? STAGE_COLORS[1];
            const scoredBy = objectivesScoredBy[id] ?? [];

            if (!revealed) {
              return (
                <div
                  key={`${id}-${idx}`}
                  className="rounded border border-gray-700/60 bg-black/40 flex items-center justify-center"
                >
                  <Lock size={40} className="text-gray-600" strokeWidth={2} aria-label="Oculta" />
                </div>
              );
            }

            return (
              <div
                key={`${id}-${idx}`}
                className="rounded border-2 px-4 py-3 flex flex-col gap-1.5 overflow-hidden"
                style={{
                  borderColor: stageColor,
                  background: `linear-gradient(180deg, ${stageColor}25 0%, rgba(0,0,0,0.55) 100%)`,
                }}
              >
                <div className="flex items-center justify-between flex-shrink-0">
                  <span
                    className="px-2 py-0.5 rounded text-base font-bold leading-none"
                    style={{ background: stageColor, color: '#fff', fontFamily: 'var(--font-audiowide)' }}
                  >
                    {obj.stage === 1 ? 'I' : 'II'}
                  </span>
                  <span
                    className="text-5xl font-bold leading-none"
                    style={{ color: stageColor, fontFamily: 'var(--font-share-tech-mono)' }}
                  >
                    {obj.points}
                  </span>
                </div>
                <p
                  className="text-xl text-white leading-tight flex-shrink-0"
                  style={{ fontFamily: 'var(--font-audiowide)' }}
                >
                  {obj.nameEn}
                </p>
                <p
                  className="text-lg text-gray-100 leading-snug flex-1 min-h-0 overflow-hidden"
                  style={{ fontFamily: 'var(--font-electrolize)' }}
                >
                  {obj.conditionEn}
                </p>
                {scoredBy.length > 0 && (
                  <div className="flex gap-1 flex-wrap pt-1 border-t border-white/10 flex-shrink-0">
                    {scoredBy.map((pIdx) => {
                      const p = players[pIdx];
                      if (!p) return null;
                      const f = FACTIONS[p.faction];
                      const c = PLAYER_COLOR_VALUES[PLAYER_COLORS[p.color]];
                      return (
                        <div
                          key={pIdx}
                          className="w-7 h-7 relative rounded-full border bg-black/40"
                          style={{ borderColor: c }}
                          title={`${f.shortName}${p.name ? ` (${p.name})` : ''}`}
                        >
                          <Image src={f.iconPath} alt={f.shortName} fill className="object-contain p-0.5" unoptimized />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
