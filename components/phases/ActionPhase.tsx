'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import {
  NO_PLAYER,
  STRATEGY_PLAYED,
  STRATEGY_DISABLED,
} from '@/lib/constants';
import { formatTime } from '@/lib/timeUtils';
import StrategyCard from '@/components/shared/StrategyCard';
import StrategyActionHelper from '@/components/shared/StrategyActionHelper';
import SpeakerModal from '@/components/shared/SpeakerModal';
import Button from '@/components/ui/Button';
import { getFactionSheet } from '@/data/factionSheets';
import { type QuickActionKind } from '@/data/strategyActions';
import { Timer, Check, ArrowRight, Zap, Hexagon, X } from '@/components/ui/icons';
import { type LucideIcon } from '@/components/ui/icons';

export default function ActionPhase() {
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const strategies = useGameStore((s) => s.strategies);
  const activeStrategyIdx = useGameStore((s) => s.activeStrategyIdx);
  const roundCounter = useGameStore((s) => s.roundCounter);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const activeModal = useGameStore((s) => s.activeModal);
  const showFactionClock = useGameStore((s) => s.options.showFactionClock);
  const giant = useGameStore((s) => s.options.giantMode === true);
  const resolveAction = useGameStore((s) => s.resolveAction);
  const adjustTokens = useGameStore((s) => s.adjustTokens);
  const adjustTradeGoods = useGameStore((s) => s.adjustTradeGoods);
  const adjustCommodities = useGameStore((s) => s.adjustCommodities);
  const replenishCommodities = useGameStore((s) => s.replenishCommodities);
  const incrementVP = useGameStore((s) => s.incrementVP);

  // One action per turn: a single mutually-exclusive selection (TI4 rule).
  const [selected, setSelected] = useState<'s1' | 's2' | 'other' | 'pass' | null>(null);
  const s1Active = selected === 's1';
  const s2Active = selected === 's2';
  const otherActive = selected === 'other';
  const passActive = selected === 'pass';
  const toggle = (k: 's1' | 's2' | 'other' | 'pass') =>
    setSelected((cur) => (cur === k ? null : k));

  const activeStrategy = strategies[activeStrategyIdx];
  const activePlayerIdx = activeStrategy?.playerIdx ?? NO_PLAYER;
  const activePlayer = activePlayerIdx < 8 ? players[activePlayerIdx] : null;
  const activeFaction = activePlayer ? FACTIONS[activePlayer.faction] : null;
  const activeColorValue = activePlayer
    ? PLAYER_COLOR_VALUES[PLAYER_COLORS[activePlayer.color]]
    : undefined;

  const secondStrategy = strategies.find(
    (st) => st.secondPickPlayerIdx === activePlayerIdx
  );
  const secondStratIdx = secondStrategy ? strategies.indexOf(secondStrategy) : -1;

  const isS1Played = activeStrategy?.status === STRATEGY_PLAYED;
  const isS2Played = secondStrategy?.status === STRATEGY_PLAYED;

  // Pass is only allowed once the player's strategy card(s) are already played/passed.
  const canPass =
    isS1Played &&
    (nbPlayers > 4 || secondStratIdx === -1 || isS2Played);

  const anyActionSelected = selected !== null;

  const handleResolve = () => {
    resolveAction({ s1: s1Active, s2: s2Active, pass: passActive });
    setSelected(null);
  };

  // Aplica una acción rápida del ayudante sobre el jugador activo.
  const applyQuickAction = (q: QuickActionKind) => {
    if (activePlayerIdx >= 8) return;
    switch (q.kind) {
      case 'tokens':
        adjustTokens(activePlayerIdx, q.pool, q.amount);
        break;
      case 'tradeGoods':
        adjustTradeGoods(activePlayerIdx, q.amount);
        break;
      case 'commodities':
        adjustCommodities(activePlayerIdx, q.amount);
        break;
      case 'replenishCommodities':
        replenishCommodities(activePlayerIdx);
        break;
      case 'incrementVP':
        incrementVP(activePlayerIdx, q.amount);
        break;
    }
  };

  // Carta cuya ayuda mostrar, según la acción seleccionada. Tanto la carta
  // activa como la "segunda carta" (≤4 jug.) las juega su dueño con la habilidad
  // PRIMARIA en su turno; la secundaria la usan los demás y no tiene turno aquí.
  const helperCard =
    s2Active && secondStrategy
      ? { nameEn: secondStrategy.nameEn, variant: 'primary' as const }
      : s1Active && activeStrategy && !activeStrategy.isNaaluSlot
        ? { nameEn: activeStrategy.nameEn, variant: 'primary' as const }
        : null;
  const commodityMax = activePlayer ? getFactionSheet(activePlayer.faction)?.commodities ?? 0 : 0;

  const sidebarStrategies = strategies
    .map((st, i) => ({ st, i }))
    .filter(({ st }) => st.playerIdx !== NO_PLAYER && st.playerIdx < 8 && st.status !== STRATEGY_DISABLED);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h2
          className="text-2xl text-[color:var(--accent-soft)] text-shadow"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {`Ronda ${turnCounter} — Fase de Acción`}
        </h2>
        {roundCounter > 1 && (
          <span
            className="text-base text-[color:var(--text-muted)]"
            style={{ fontFamily: 'var(--font-share-tech-mono)' }}
          >
            {`sub-ronda ${roundCounter}`}
          </span>
        )}
      </div>

      {/* ── Modo gigante: orden de facciones en horizontal + botones mini ──
          Sin cabecera de jugador (ya se ve resaltado en el panel lateral) ni
          checklist; los jugadores accionan normalmente desde su móvil. */}
      {giant && (
        <div className="flex flex-col gap-3 flex-shrink-0">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.ceil(sidebarStrategies.length / 2))}, minmax(0, 1fr))` }}
          >
            {sidebarStrategies.map(({ st, i }) => (
              <StrategyCard
                key={i}
                strategy={st}
                stratIdx={i}
                rank={i}
                isActive={true}
                isCurrent={i === activeStrategyIdx}
                showTG={false}
                size="sm"
              />
            ))}
          </div>
          {activeFaction && activePlayer && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <ActionBtn label={activeStrategy?.nameEs ?? ''} icon={Zap} active={s1Active} done={isS1Played} tone="accent" onClick={() => toggle('s1')} compact />
              {secondStrategy && (
                <ActionBtn label={`${secondStrategy.nameEs} (2)`} icon={Zap} active={s2Active} done={isS2Played} tone="info" onClick={() => toggle('s2')} compact />
              )}
              <ActionBtn label={'Táctica'} icon={Hexagon} active={otherActive} done={false} tone="success" onClick={() => toggle('other')} compact />
              <ActionBtn label={'Pasar'} icon={X} active={passActive} done={false} disabled={!canPass} tone="danger" onClick={() => toggle('pass')} compact />
              {anyActionSelected && (
                <Button onClick={handleResolve} variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                  {'Resolver'}
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {!giant && (
      <div className="flex gap-4 flex-1 min-h-0">
        {/* ── Strategy sidebar ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-1 w-60 flex-shrink-0 overflow-y-auto">
          {sidebarStrategies.map(({ st, i }) => (
            <StrategyCard
              key={i}
              strategy={st}
              stratIdx={i}
              rank={i}
              isActive={true}
              isCurrent={i === activeStrategyIdx}
              showTG={false}
              size="sm"
            />
          ))}
        </div>

        {/* ── Active player panel ───────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {activeFaction && activePlayer ? (
            <>
              <div
                className="p-4 rounded-[var(--radius)] border-2 bg-[var(--bg-surface)]"
                style={{ borderColor: activeColorValue }}
              >
                {/* Player header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-28 h-28 relative flex-shrink-0">
                    <Image
                      src={activeFaction.iconPath}
                      alt={activeFaction.shortName}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-3xl text-white text-shadow font-bold truncate"
                      style={{ fontFamily: 'var(--font-aldrich)' }}
                    >
                      {activeFaction.nameEs} ({activePlayer.name})
                    </p>
                    <p className="text-lg text-[color:var(--accent-soft)] mt-0.5">
                      {'realiza tu Acción'}
                    </p>
                    {showFactionClock && (
                      <p
                        className="inline-flex items-center gap-1.5 text-base text-[color:var(--text-secondary)] mt-1"
                        style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                      >
                        <Timer size={14} strokeWidth={2} aria-hidden />
                        {formatTime(activePlayer.clock)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                  <ActionBtn
                    label={activeStrategy?.nameEs ?? ''}
                    icon={Zap}
                    active={s1Active}
                    done={isS1Played}
                    tone="accent"
                    onClick={() => toggle('s1')}
                  />
                  {secondStrategy && (
                    <ActionBtn
                      label={`${secondStrategy.nameEs} (2)`}
                      icon={Zap}
                      active={s2Active}
                      done={isS2Played}
                      tone="info"
                      onClick={() => toggle('s2')}
                    />
                  )}
                  <ActionBtn
                    label={'Táctica / Componente'}
                    icon={Hexagon}
                    active={otherActive}
                    done={false}
                    tone="success"
                    onClick={() => toggle('other')}
                  />
                  <ActionBtn
                    label={'Pasar'}
                    icon={X}
                    active={passActive}
                    done={false}
                    disabled={!canPass}
                    tone="danger"
                    onClick={() => toggle('pass')}
                  />
                </div>
              </div>

              {/* Strategy action helper (checklist + atajos numéricos) */}
              {helperCard && (
                <StrategyActionHelper
                  nameEn={helperCard.nameEn}
                  variant={helperCard.variant}
                  onQuickAction={applyQuickAction}
                  commodityMax={commodityMax}
                  currentCommodities={activePlayer?.commodities ?? 0}
                />
              )}

              {/* Resolve button */}
              {anyActionSelected && (
                <Button onClick={handleResolve} variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  {'Resolver y Siguiente'}
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-[color:var(--text-muted)] text-lg">
                {'Sin jugador activo'}
              </p>
            </div>
          )}
        </div>
      </div>
      )}

      {activeModal === 'speaker' && <SpeakerModal />}
    </div>
  );
}

// ─── ActionBtn sub-component ──────────────────────────────────────────────────

type Tone = 'accent' | 'info' | 'success' | 'danger';

const TONE_VARS: Record<Tone, string> = {
  accent:  'var(--accent)',
  info:    'var(--info)',
  success: 'var(--success)',
  danger:  'var(--danger)',
};

function ActionBtn({
  label,
  icon: Icon,
  active,
  done,
  disabled = false,
  tone,
  onClick,
  compact = false,
}: {
  label: string;
  icon: LucideIcon;
  active: boolean;
  done: boolean;
  disabled?: boolean;
  tone: Tone;
  onClick: () => void;
  compact?: boolean;
}) {
  const isUnavailable = done || disabled;
  const color = TONE_VARS[tone];

  const cls = [
    `${compact ? 'px-2 py-1 text-xs gap-1.5' : 'px-4 py-3 text-lg gap-3'} rounded-[var(--radius)] border transition-all text-left flex items-center pointer-events-auto`,
  ];
  const style: React.CSSProperties = { fontFamily: 'var(--font-aldrich)' };

  if (done) {
    cls.push('opacity-40 cursor-not-allowed border-white/8 text-[color:var(--text-muted)] line-through');
  } else if (disabled) {
    cls.push('opacity-25 cursor-not-allowed border-white/5 text-[color:var(--text-muted)]');
  } else if (active) {
    style.borderColor = color;
    style.background = `${color}30`;
    style.color = '#fff';
  } else {
    cls.push('border-white/10 text-[color:var(--text-secondary)] hover:text-white hover:bg-white/5');
  }

  return (
    <button
      onClick={!isUnavailable ? onClick : undefined}
      className={cls.join(' ')}
      style={style}
    >
      <Icon size={compact ? 14 : 18} strokeWidth={2} aria-hidden style={{ color: active && !isUnavailable ? color : undefined }} />
      <span className={compact ? '' : 'flex-1'}>{label}</span>
      {done && <Check size={compact ? 12 : 16} strokeWidth={2} className="text-[color:var(--success)]" aria-hidden />}
    </button>
  );
}
