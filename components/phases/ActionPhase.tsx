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
import SpeakerModal from '@/components/shared/SpeakerModal';
import Button from '@/components/ui/Button';
import { Timer, Check, ArrowRight, Zap, Hexagon, X } from '@/components/ui/icons';
import { type LucideIcon } from '@/components/ui/icons';

export default function ActionPhase() {
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const strategies = useGameStore((s) => s.strategies);
  const activeStrategyIdx = useGameStore((s) => s.activeStrategyIdx);
  const currentPlayerTimer = useGameStore((s) => s.currentPlayerTimer);
  const roundCounter = useGameStore((s) => s.roundCounter);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const activeModal = useGameStore((s) => s.activeModal);
  const showFactionClock = useGameStore((s) => s.options.showFactionClock);
  const resolveAction = useGameStore((s) => s.resolveAction);

  const [s1Active, setS1Active] = useState(false);
  const [s2Active, setS2Active] = useState(false);
  const [passActive, setPassActive] = useState(false);
  const [otherActive, setOtherActive] = useState(false);

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

  const canPass =
    (s1Active || isS1Played) &&
    (nbPlayers > 4 || secondStratIdx === -1 || s2Active || isS2Played);

  const anyActionSelected = s1Active || s2Active || otherActive || passActive;

  const handleResolve = () => {
    resolveAction({ s1: s1Active, s2: s2Active, pass: passActive });
    setS1Active(false);
    setS2Active(false);
    setPassActive(false);
    setOtherActive(false);
  };

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
                        {formatTime(currentPlayerTimer + activePlayer.clock)}
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
                    onClick={() => setS1Active((v) => !v)}
                  />
                  {secondStrategy && (
                    <ActionBtn
                      label={`${secondStrategy.nameEs} (2)`}
                      icon={Zap}
                      active={s2Active}
                      done={isS2Played}
                      tone="info"
                      onClick={() => setS2Active((v) => !v)}
                    />
                  )}
                  <ActionBtn
                    label={'Táctica / Componente'}
                    icon={Hexagon}
                    active={otherActive}
                    done={false}
                    tone="success"
                    onClick={() => setOtherActive((v) => !v)}
                  />
                  <ActionBtn
                    label={'Pasar'}
                    icon={X}
                    active={passActive}
                    done={false}
                    disabled={!canPass}
                    tone="danger"
                    onClick={() => setPassActive((v) => !v)}
                  />
                </div>
              </div>

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
}: {
  label: string;
  icon: LucideIcon;
  active: boolean;
  done: boolean;
  disabled?: boolean;
  tone: Tone;
  onClick: () => void;
}) {
  const isUnavailable = done || disabled;
  const color = TONE_VARS[tone];

  const cls = [
    'px-4 py-3 text-lg rounded-[var(--radius)] border transition-all text-left flex items-center gap-3 pointer-events-auto',
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
      <Icon size={18} strokeWidth={2} aria-hidden style={{ color: active && !isUnavailable ? color : undefined }} />
      <span className="flex-1">{label}</span>
      {done && <Check size={16} strokeWidth={2} className="text-[color:var(--success)]" aria-hidden />}
    </button>
  );
}
