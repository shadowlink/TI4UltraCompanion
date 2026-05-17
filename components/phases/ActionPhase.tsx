'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import {
  NO_PLAYER,
  STRATEGY_PLAYED,
  STRATEGY_PASSED,
  STRATEGY_DISABLED,
} from '@/lib/constants';
import { formatTime } from '@/lib/timeUtils';
import StrategyCard from '@/components/shared/StrategyCard';
import SpeakerModal from '@/components/shared/SpeakerModal';

export default function ActionPhase() {
  const lang = useGameStore((s) => s.lang);
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

  // Second strategy for this player (≤4p mode only)
  const secondStrategy = strategies.find(
    (st) => st.secondPickPlayerIdx === activePlayerIdx
  );
  const secondStratIdx = secondStrategy ? strategies.indexOf(secondStrategy) : -1;

  const isS1Played = activeStrategy?.status === STRATEGY_PLAYED;
  const isS2Played = secondStrategy?.status === STRATEGY_PLAYED;

  // Pass requires both strategies to be "settled" (played already OR toggled to play now)
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

  // Sidebar: only show strategies with a real assigned player, excluding DISABLED
  const sidebarStrategies = strategies
    .map((st, i) => ({ st, i }))
    .filter(({ st }) => st.playerIdx !== NO_PLAYER && st.playerIdx < 8 && st.status !== STRATEGY_DISABLED);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h2
          className="text-2xl text-orange-400 text-shadow"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {lang === 'es'
            ? `Ronda ${turnCounter} — Fase de Acción`
            : `Round ${turnCounter} — Action Phase`}
        </h2>
        {roundCounter > 1 && (
          <span
            className="text-base text-gray-500"
            style={{ fontFamily: 'var(--font-share-tech-mono)' }}
          >
            {lang === 'es' ? `sub-ronda ${roundCounter}` : `sub-round ${roundCounter}`}
          </span>
        )}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* ── Strategy sidebar ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-1 w-36 flex-shrink-0 overflow-y-auto">
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
                className="p-4 rounded border"
                style={{ borderColor: activeColorValue, borderWidth: 2 }}
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
                      {lang === 'es' ? activeFaction.nameEs : activeFaction.nameEn} ({activePlayer.name})
                    </p>
                    <p className="text-lg text-orange-300 mt-0.5">
                      {lang === 'es' ? 'realiza tu Acción' : 'perform your Action'}
                    </p>
                    {showFactionClock && (
                      <p
                        className="text-base text-gray-400 mt-1"
                        style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                      >
                        ⏱ {formatTime(currentPlayerTimer + activePlayer.clock)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                  {/* Strategy 1 */}
                  <ActionBtn
                    label={lang === 'es' ? activeStrategy?.nameEs : activeStrategy?.nameEn}
                    active={s1Active}
                    done={isS1Played}
                    color="orange"
                    onClick={() => setS1Active((v) => !v)}
                  />

                  {/* Strategy 2 — ≤4p only */}
                  {secondStrategy && (
                    <ActionBtn
                      label={`${lang === 'es' ? secondStrategy.nameEs : secondStrategy.nameEn} (2)`}
                      active={s2Active}
                      done={isS2Played}
                      color="blue"
                      onClick={() => setS2Active((v) => !v)}
                    />
                  )}

                  {/* Tactical / Component */}
                  <ActionBtn
                    label={lang === 'es' ? 'Táctica / Componente' : 'Tactical / Component'}
                    active={otherActive}
                    done={false}
                    color="green"
                    onClick={() => setOtherActive((v) => !v)}
                  />

                  {/* Pass */}
                  <ActionBtn
                    label={lang === 'es' ? 'Pasar' : 'Pass'}
                    active={passActive}
                    done={false}
                    disabled={!canPass}
                    color="red"
                    onClick={() => setPassActive((v) => !v)}
                  />
                </div>
              </div>

              {/* Resolve button — appears when at least one action is selected */}
              {anyActionSelected && (
                <button
                  onClick={handleResolve}
                  className="px-4 py-5 text-2xl border-2 border-orange-500 bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 rounded transition-all"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  {lang === 'es' ? 'Resolver y Siguiente →' : 'Resolve & Next →'}
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-gray-600 text-lg">
                {lang === 'es' ? 'Sin jugador activo' : 'No active player'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Speaker modal — triggered when Politics (slot 3) is played */}
      {activeModal === 'speaker' && <SpeakerModal />}
    </div>
  );
}

// ─── ActionBtn sub-component ──────────────────────────────────────────────────

const COLOR_CLASSES = {
  orange: {
    active: 'bg-orange-500/30 border-orange-400 text-orange-200',
    hover: 'hover:border-orange-500/50 hover:bg-orange-500/5 text-gray-300',
  },
  blue: {
    active: 'bg-blue-500/30 border-blue-400 text-blue-200',
    hover: 'hover:border-blue-500/50 hover:bg-blue-500/5 text-gray-300',
  },
  green: {
    active: 'bg-green-500/30 border-green-400 text-green-200',
    hover: 'hover:border-green-500/50 hover:bg-green-500/5 text-gray-300',
  },
  red: {
    active: 'bg-red-500/30 border-red-400 text-red-200',
    hover: 'hover:border-red-500/50 hover:bg-red-500/5 text-gray-300',
  },
} as const;

function ActionBtn({
  label,
  active,
  done,
  disabled = false,
  color,
  onClick,
}: {
  label?: string;
  active: boolean;
  done: boolean;
  disabled?: boolean;
  color: keyof typeof COLOR_CLASSES;
  onClick: () => void;
}) {
  const c = COLOR_CLASSES[color];
  const isUnavailable = done || disabled;

  return (
    <button
      onClick={!isUnavailable ? onClick : undefined}
      className={`px-4 py-4 text-lg rounded border transition-all text-left ${
        done
          ? 'opacity-40 cursor-not-allowed border-gray-700 text-gray-500 line-through'
          : disabled
          ? 'opacity-25 cursor-not-allowed border-gray-800 text-gray-600'
          : active
          ? c.active
          : `border-gray-600 ${c.hover}`
      }`}
      style={{ fontFamily: 'var(--font-aldrich)' }}
    >
      {label}
      {done && ' ✓'}
    </button>
  );
}
