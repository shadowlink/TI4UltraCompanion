'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Hexagon } from '@/components/ui/icons';

export default function OptionsPanel() {
  const options = useGameStore((s) => s.options);
  const setOptions = useGameStore((s) => s.setOptions);
  const closeModal = useGameStore((s) => s.closeModal);

  const [vpWinGoal, setVpWinGoal] = useState(String(options.vpWinGoal));
  const [decisionTimer, setDecisionTimer] = useState(String(options.decisionTimerLimit));
  const [inactivityTimer, setInactivityTimer] = useState(String(options.inactivityMinutes));

  useEffect(() => {
    setVpWinGoal(String(options.vpWinGoal));
    setDecisionTimer(String(options.decisionTimerLimit));
    setInactivityTimer(String(options.inactivityMinutes));
  }, [options.vpWinGoal, options.decisionTimerLimit, options.inactivityMinutes]);

  const handleClose = useCallback(() => {
    const vp = Math.max(1, Math.min(20, parseInt(vpWinGoal, 10) || 10));
    const dt = Math.max(10, Math.min(600, parseInt(decisionTimer, 10) || 90));
    const ia = Math.max(1, Math.min(120, parseInt(inactivityTimer, 10) || 15));
    setOptions({ vpWinGoal: vp, decisionTimerLimit: dt, inactivityMinutes: ia });
    closeModal();
  }, [vpWinGoal, decisionTimer, inactivityTimer, setOptions, closeModal]);

  return (
    <Modal open onClose={handleClose} title="Opciones">
      <div className="px-5 py-4 flex flex-col gap-5">
        <section>
          <p
            className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider mb-3"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {'Reglas de Juego'}
          </p>
          <div className="flex flex-col gap-3">
            <NumericOption label="VP para ganar" value={vpWinGoal} min={1} max={20} onChange={setVpWinGoal} />
            <NumericOption
              label="Temporizador de decisión (s)"
              value={decisionTimer}
              min={10}
              max={600}
              onChange={setDecisionTimer}
            />
            <NumericOption
              label="Aviso de inactividad (min)"
              value={inactivityTimer}
              min={1}
              max={120}
              onChange={setInactivityTimer}
            />
          </div>
        </section>

        <section>
          <p
            className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider mb-3"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {'Visualización'}
          </p>
          <div className="flex flex-col gap-2.5">
            <Toggle
              label="Mostrar barra de VP"
              checked={options.showVPBar}
              onChange={(v) => setOptions({ showVPBar: v })}
            />
            <Toggle
              label="Mostrar temporizador por jugador"
              checked={options.showFactionClock}
              onChange={(v) => setOptions({ showFactionClock: v })}
            />
            <Toggle
              label="Agenda detallada"
              checked={options.detailedAgenda}
              onChange={(v) => setOptions({ detailedAgenda: v })}
            />
          </div>
        </section>

        <section>
          <Button onClick={toggleFullscreen} variant="secondary" size="md" icon={Hexagon} fullWidth>
            {'Pantalla completa'}
          </Button>
        </section>
      </div>

      <div className="px-5 py-3 border-t border-[color:var(--accent-border-faint)] flex justify-end">
        <Button onClick={handleClose} variant="primary" size="md">
          {'Hecho'}
        </Button>
      </div>
    </Modal>
  );
}

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
      <label className="text-sm text-[color:var(--text-secondary)] flex-1">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 px-2 py-1 text-sm text-right bg-[var(--bg-surface)] border border-white/10 focus:border-[color:var(--accent-border-strong)] text-white rounded-[var(--radius-sm)] outline-none transition-colors"
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
      className="flex items-center justify-between gap-3 w-full text-left pointer-events-auto"
      type="button"
    >
      <span className="text-sm text-[color:var(--text-secondary)]">{label}</span>
      <div
        className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
        style={{ background: checked ? 'var(--accent)' : 'rgba(255,255,255,0.12)' }}
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
