'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function OptionsPanel() {
  const options = useGameStore((s) => s.options);
  const setOptions = useGameStore((s) => s.setOptions);
  const closeModal = useGameStore((s) => s.closeModal);

  // Local state so inputs feel responsive before committing
  const [vpWinGoal, setVpWinGoal] = useState(String(options.vpWinGoal));
  const [decisionTimer, setDecisionTimer] = useState(String(options.decisionTimerLimit));
  const [inactivityTimer, setInactivityTimer] = useState(String(options.inactivityMinutes));

  // Sync local state if options change externally
  useEffect(() => {
    setVpWinGoal(String(options.vpWinGoal));
    setDecisionTimer(String(options.decisionTimerLimit));
    setInactivityTimer(String(options.inactivityMinutes));
  }, [options.vpWinGoal, options.decisionTimerLimit, options.inactivityMinutes]);

  const handleClose = useCallback(() => {
    // Commit numeric fields on close
    const vp = Math.max(1, Math.min(20, parseInt(vpWinGoal, 10) || 10));
    const dt = Math.max(10, Math.min(600, parseInt(decisionTimer, 10) || 90));
    const ia = Math.max(1, Math.min(120, parseInt(inactivityTimer, 10) || 15));
    setOptions({ vpWinGoal: vp, decisionTimerLimit: dt, inactivityMinutes: ia });
    closeModal();
  }, [vpWinGoal, decisionTimer, inactivityTimer, setOptions, closeModal]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-gray-900 border border-orange-500/40 rounded-lg w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
          <h2
            className="text-base text-orange-400 text-shadow"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {'Opciones'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-white transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-5">
          {/* ── Numeric settings ── */}
          <section>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
              {'Reglas de Juego'}
            </p>
            <div className="flex flex-col gap-3">
              <NumericOption
                label={'VP para ganar'}
                value={vpWinGoal}
                min={1}
                max={20}
                onChange={setVpWinGoal}
              />
              <NumericOption
                label={'Temporizador de decisión (s)'}
                value={decisionTimer}
                min={10}
                max={600}
                onChange={setDecisionTimer}
              />
              <NumericOption
                label={'Aviso de inactividad (min)'}
                value={inactivityTimer}
                min={1}
                max={120}
                onChange={setInactivityTimer}
              />
            </div>
          </section>

          {/* ── Toggles ── */}
          <section>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
              {'Visualización'}
            </p>
            <div className="flex flex-col gap-2.5">
              <Toggle
                label={'Mostrar barra de VP'}
                checked={options.showVPBar}
                onChange={(v) => setOptions({ showVPBar: v })}
              />
              <Toggle
                label={'Mostrar temporizador por jugador'}
                checked={options.showFactionClock}
                onChange={(v) => setOptions({ showFactionClock: v })}
              />
              <Toggle
                label={'Agenda detallada'}
                checked={options.detailedAgenda}
                onChange={(v) => setOptions({ detailedAgenda: v })}
              />
            </div>
          </section>

          {/* ── Fullscreen ── */}
          <section>
            <button
              onClick={toggleFullscreen}
              className="w-full py-2 text-sm border border-gray-600 text-gray-300 hover:border-orange-500/50 hover:text-orange-200 rounded transition-all"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              ⛶ {'Pantalla completa'}
            </button>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-700 flex justify-end">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm border border-orange-500 bg-orange-500/10 hover:bg-orange-500/30 text-orange-300 rounded transition-all"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {'Hecho'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NumericOption({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-gray-300 flex-1">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 px-2 py-1 text-sm text-right bg-gray-800 border border-gray-600 focus:border-orange-400 text-white rounded outline-none transition-colors"
        style={{ fontFamily: 'var(--font-share-tech-mono)' }}
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 w-full text-left"
    >
      <span className="text-sm text-gray-300">{label}</span>
      <div
        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-orange-500' : 'bg-gray-600'
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </div>
    </button>
  );
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}
