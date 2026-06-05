'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { TECH_COLOR_HEX, type TechColor } from '@/data/factionSheets';
import { formatTime } from '@/lib/timeUtils';
import { Crown, Trophy, Timer, Zap, Star, Brain, Hexagon, Swords, Rocket } from '@/components/ui/icons';
import type { LucideIcon } from '@/components/ui/icons';

export interface StatsPlayer {
  factionIdx: number;
  colorIdx: number;
  name: string;
  abandoned: boolean;
  vp: number;
  clock: number; // segundos consumidos
  nbSpeaker: number;
  commodities: number;
  tradeGoods: number;
  tokens: { tactic: number; fleet: number; strategy: number };
  techByColor: Record<TechColor, number>;
  unitUpgrades: number;
  objStageI: number;
  objStageII: number;
}

export interface StatsData {
  durationSec: number;
  rounds: number;
  vpGoal: number;
  players: StatsPlayer[];
}

// ─── Helpers derivados ───────────────────────────────────────────────────────
const colorOf = (p: StatsPlayer) => PLAYER_COLOR_VALUES[PLAYER_COLORS[p.colorIdx]] ?? '#888';
const labelOf = (p: StatsPlayer) => p.name || FACTIONS[p.factionIdx]?.shortName || '—';
const techTotal = (p: StatsPlayer) =>
  p.techByColor.red + p.techByColor.green + p.techByColor.blue + p.techByColor.yellow + p.unitUpgrades;
const objPoints = (p: StatsPlayer) => p.objStageI + p.objStageII * 2;
const objCount = (p: StatsPlayer) => p.objStageI + p.objStageII;
const economy = (p: StatsPlayer) => p.tradeGoods + p.commodities;
const tokensTotal = (p: StatsPlayer) => p.tokens.tactic + p.tokens.fleet + p.tokens.strategy;

function pick(players: StatsPlayer[], metric: (p: StatsPlayer) => number, mode: 'max' | 'min'): StatsPlayer | null {
  const pool = players.filter((p) => !p.abandoned);
  if (pool.length === 0) return null;
  return pool.reduce((best, p) => {
    const v = metric(p);
    const b = metric(best);
    return mode === 'max' ? (v > b ? p : best) : v < b ? p : best;
  });
}

const TECH_ORDER: TechColor[] = ['blue', 'green', 'yellow', 'red'];

export default function GameStats({ data, onNewGame }: { data: StatsData; onNewGame?: () => void }) {
  const ranking = [...data.players].sort((a, b) => b.vp - a.vp || a.clock - b.clock);
  const winner = ranking[0];
  const second = ranking[1];
  const winnerFaction = winner ? FACTIONS[winner.factionIdx] : null;
  const margin = winner && second ? winner.vp - second.vp : 0;

  const totalClock = data.players.reduce((s, p) => s + p.clock, 0) || 1;
  const totalObjs = data.players.reduce((s, p) => s + objCount(p), 0);
  const maxTech = Math.max(1, ...data.players.map(techTotal));
  const maxEconomy = Math.max(1, ...data.players.map(economy));

  const fastest = pick(data.players.filter((p) => p.clock > 0), (p) => p.clock, 'min');
  const slowest = pick(data.players, (p) => p.clock, 'max');
  const objHunter = pick(data.players, objPoints, 'max');
  const techLeader = pick(data.players, techTotal, 'max');
  const tycoon = pick(data.players, economy, 'max');
  const orator = pick(data.players, (p) => p.nbSpeaker, 'max');
  const commander = pick(data.players, tokensTotal, 'max');

  const superlatives: { icon: LucideIcon; label: string; player: StatsPlayer | null; value: string; color: string }[] = [
    { icon: Zap, label: 'Más rápido', player: fastest, value: fastest ? formatTime(fastest.clock) : '—', color: 'var(--success)' },
    { icon: Timer, label: 'Más reflexivo', player: slowest, value: slowest ? formatTime(slowest.clock) : '—', color: 'var(--info)' },
    { icon: Star, label: 'Cazaobjetivos', player: objHunter, value: objHunter ? `${objPoints(objHunter)} PV` : '—', color: 'var(--vp-gold)' },
    { icon: Brain, label: 'Líder tecnológico', player: techLeader, value: techLeader ? `${techTotal(techLeader)}` : '—', color: '#a855f7' },
    { icon: Hexagon, label: 'Magnate', player: tycoon, value: tycoon ? `${economy(tycoon)}` : '—', color: '#06b6d4' },
    { icon: Crown, label: 'Portavoz', player: orator, value: orator ? `${orator.nbSpeaker}×` : '—', color: 'var(--warning)' },
    { icon: Swords, label: 'Mando', player: commander, value: commander ? `${tokensTotal(commander)}` : '—', color: 'var(--accent)' },
  ];

  return (
    <div className="flex flex-col h-full items-center p-4 md:p-6 gap-7 overflow-y-auto">
      {/* Héroe */}
      {winner && winnerFaction && (
        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="w-24 h-24 relative mx-auto mb-3 drop-shadow-[0_0_18px_var(--accent-glow)]">
            <span className="end-halo" aria-hidden />
            <Image src={winnerFaction.iconPath} alt={winnerFaction.nameEn} fill className="object-contain relative" unoptimized />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Trophy size={26} className="text-[color:var(--vp-gold)]" strokeWidth={2} aria-hidden />
            <h1 className="text-3xl text-[color:var(--vp-gold)] text-shadow" style={{ fontFamily: 'var(--font-audiowide)' }}>
              {winnerFaction.nameEs}
            </h1>
          </div>
          <p className="text-lg text-[color:var(--accent-soft)] text-shadow">
            {winner.name ? `${winner.name} — ` : ''}{'Una Nueva Era Comienza...'}
          </p>
        </motion.div>
      )}

      {/* Meta */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <MetaChip label="Duración" value={formatTime(data.durationSec)} />
        <MetaChip label="Rondas" value={`${data.rounds}`} />
        <MetaChip label="Jugadores" value={`${data.players.length}`} />
        <MetaChip label="Meta PV" value={`${data.vpGoal}`} />
        <MetaChip label="Margen" value={margin > 0 ? `+${margin} PV` : 'empate'} />
      </motion.div>

      {/* Secciones de datos — rejilla que aprovecha el ancho en pantallas grandes */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-6 items-start">
      {/* Clasificación */}
      <Section title="Clasificación" delay={0.3}>
        {ranking.map((p, rank) => {
          const f = FACTIONS[p.factionIdx];
          const isWinner = rank === 0;
          const share = Math.round((p.clock / totalClock) * 100);
          return (
            <Row key={`r-${rank}`} idx={rank} delay={0.35}>
              <div
                className={`rounded-[var(--radius)] border p-2.5 ${isWinner ? 'border-[color:var(--vp-gold)]/50 bg-[color:var(--vp-gold)]/8' : 'border-white/10 bg-[var(--bg-surface)]'}`}
                style={{ borderLeft: `3px solid ${colorOf(p)}` }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg font-bold text-[color:var(--text-muted)] w-5 text-center" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                    {rank + 1}
                  </span>
                  {f && (
                    <div className="w-8 h-8 relative flex-shrink-0">
                      <Image src={f.iconPath} alt={f.shortName} fill className="object-contain" unoptimized />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate leading-tight">
                      {labelOf(p)}
                      {p.abandoned && <span className="text-[10px] text-[color:var(--danger)] ml-1">abandonó</span>}
                    </p>
                    <p className="text-[11px] text-[color:var(--text-muted)] truncate">
                      {f?.shortName} · {objPoints(p)} PV de objetivos
                    </p>
                  </div>
                  <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-share-tech-mono)', color: isWinner ? 'var(--vp-gold)' : 'var(--text-primary)' }}>
                    {p.vp}
                    <span className="text-xs text-[color:var(--text-muted)]"> PV</span>
                  </span>
                </div>
                <Bar pct={share} color={colorOf(p)} right={`${formatTime(p.clock)} · ${share}%`} icon={Timer} />
              </div>
            </Row>
          );
        })}
      </Section>

      {/* Reparto del tiempo */}
      <Section title="Reparto del tiempo" delay={0.4}>
        {ranking.map((p, rank) => {
          const share = Math.round((p.clock / totalClock) * 100);
          const perRound = data.rounds > 0 ? Math.round(p.clock / data.rounds) : 0;
          return (
            <Row key={`t-${rank}`} idx={rank} delay={0.4}>
              <div className="rounded-[var(--radius)] border border-white/10 bg-[var(--bg-surface)] p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white truncate">{labelOf(p)}</span>
                  <span className="text-[11px] text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                    {formatTime(perRound)}/ronda
                  </span>
                </div>
                <Bar pct={share} color={colorOf(p)} right={`${formatTime(p.clock)} · ${share}%`} icon={Timer} />
              </div>
            </Row>
          );
        })}
      </Section>

      {/* Objetivos */}
      <Section title={`Objetivos públicos · ${totalObjs} puntuados`} delay={0.45}>
        {ranking.map((p, rank) => (
          <Row key={`o-${rank}`} idx={rank} delay={0.45}>
            <div className="rounded-[var(--radius)] border border-white/10 bg-[var(--bg-surface)] p-2.5 flex items-center gap-2.5">
              <span className="text-sm text-white truncate flex-1">{labelOf(p)}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: p.objStageI }).map((_, i) => (
                  <span key={`i${i}`} className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: 'var(--vp-gold)', background: 'transparent' }} title="Etapa I" />
                ))}
                {Array.from({ length: p.objStageII }).map((_, i) => (
                  <span key={`ii${i}`} className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--vp-gold)' }} title="Etapa II" />
                ))}
                {objCount(p) === 0 && <span className="text-[11px] text-[color:var(--text-muted)]">—</span>}
              </div>
              <span className="text-sm font-bold text-[color:var(--vp-gold)] w-12 text-right" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                {objPoints(p)} PV
              </span>
            </div>
          </Row>
        ))}
        <p className="text-[10px] text-[color:var(--text-muted)] px-1">
          {'○ Etapa I (1 PV) · ● Etapa II (2 PV)'}
        </p>
      </Section>

      {/* Tecnología */}
      <Section title="Tecnología" delay={0.5}>
        {ranking.map((p, rank) => {
          const total = techTotal(p);
          return (
            <Row key={`tech-${rank}`} idx={rank} delay={0.5}>
              <div className="rounded-[var(--radius)] border border-white/10 bg-[var(--bg-surface)] p-2.5 flex items-center gap-2.5">
                <span className="text-sm text-white truncate flex-1">{labelOf(p)}</span>
                {/* Mini-barra por color */}
                <div className="flex h-3 rounded overflow-hidden w-28 bg-white/5">
                  {TECH_ORDER.map((c) => {
                    const n = p.techByColor[c];
                    if (n === 0) return null;
                    return <div key={c} style={{ width: `${(n / maxTech) * 100}%`, background: TECH_COLOR_HEX[c] }} title={`${c}: ${n}`} />;
                  })}
                </div>
                <span className="text-xs text-[color:var(--text-secondary)] w-16 text-right" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                  {total}{p.unitUpgrades > 0 && <span className="text-[color:var(--text-muted)]"> ·{p.unitUpgrades}⚙</span>}
                </span>
              </div>
            </Row>
          );
        })}
      </Section>

      {/* Economía */}
      <Section title="Economía" delay={0.55}>
        {ranking.map((p, rank) => (
          <Row key={`e-${rank}`} idx={rank} delay={0.55}>
            <div className="rounded-[var(--radius)] border border-white/10 bg-[var(--bg-surface)] p-2.5 flex items-center gap-2.5">
              <span className="text-sm text-white truncate flex-1">{labelOf(p)}</span>
              <span className="inline-flex items-center gap-1 text-xs" style={{ color: '#fbbf24', fontFamily: 'var(--font-share-tech-mono)' }} title="Mercancías">
                Mer {p.tradeGoods}
              </span>
              <span className="inline-flex items-center gap-1 text-xs" style={{ color: '#06b6d4', fontFamily: 'var(--font-share-tech-mono)' }} title="Exportaciones">
                Exp {p.commodities}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[color:var(--text-secondary)]" style={{ fontFamily: 'var(--font-share-tech-mono)' }} title="Fichas de mando (T/F/E)">
                <Swords size={12} className="text-[color:var(--accent)]" strokeWidth={2} aria-hidden />{p.tokens.tactic}
                <Rocket size={12} className="text-[color:var(--info)]" strokeWidth={2} aria-hidden />{p.tokens.fleet}
                <Star size={12} className="text-[color:var(--success)]" strokeWidth={2} aria-hidden />{p.tokens.strategy}
              </span>
            </div>
          </Row>
        ))}
        <p className="text-[10px] text-[color:var(--text-muted)] px-1">
          {'Máx. economía: '}{tycoon ? `${labelOf(tycoon)} (${economy(tycoon)})` : '—'} · {`máx. de ${maxEconomy}`}
        </p>
      </Section>
      </div>

      {/* Menciones — a todo el ancho */}
      <Section title="Menciones" delay={0.6} className="max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {superlatives.map((s, i) => {
            const Icon = s.icon;
            return (
              <Row key={s.label} idx={i} delay={0.6}>
                <div className="rounded-[var(--radius)] border border-white/10 bg-[var(--bg-surface)] p-2.5 flex items-center gap-2.5">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${s.color}22`, color: s.color }}>
                    <Icon size={18} strokeWidth={2} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-aldrich)' }}>{s.label}</p>
                    <p className="text-sm text-white truncate leading-tight">{s.player ? labelOf(s.player) : '—'}</p>
                    <p className="text-[11px]" style={{ color: s.color, fontFamily: 'var(--font-share-tech-mono)' }}>{s.value}</p>
                  </div>
                </div>
              </Row>
            );
          })}
        </div>
      </Section>

      {onNewGame && (
        <button
          onClick={onNewGame}
          className="mt-2 mb-6 px-6 py-3 rounded-[var(--radius)] uppercase tracking-wider bg-[color:var(--accent)]/15 border border-[color:var(--accent-border-strong)] text-[color:var(--accent-soft)] shadow-[var(--glow-accent)] hover:bg-[color:var(--accent)]/25 transition-colors pointer-events-auto"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          {'Nueva Partida'}
        </button>
      )}
    </div>
  );
}

// ─── Subcomponentes ──────────────────────────────────────────────────────────

function Bar({ pct, color, right, icon: Icon }: { pct: number; color: string; right: string; icon: LucideIcon }) {
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="inline-flex items-center gap-1 text-[11px] text-[color:var(--text-secondary)] whitespace-nowrap" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
        <Icon size={11} strokeWidth={2} aria-hidden />
        {right}
      </span>
    </div>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-[var(--bg-surface)] px-3 py-1 flex items-center gap-1.5">
      <span className="text-[10px] uppercase tracking-wider text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-aldrich)' }}>{label}</span>
      <span className="text-sm text-white" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{value}</span>
    </div>
  );
}

function Section({ title, delay, children, className = '' }: { title: string; delay: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`w-full flex flex-col gap-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <p className="text-xs uppercase tracking-wider text-[color:var(--accent-soft)] px-1" style={{ fontFamily: 'var(--font-aldrich)' }}>{title}</p>
      {children}
    </motion.div>
  );
}

function Row({ idx, delay, children }: { idx: number; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay + idx * 0.05, duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
