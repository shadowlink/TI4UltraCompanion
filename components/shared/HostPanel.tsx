'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useGameStore } from '@/store/gameStore';
import Modal from '@/components/ui/Modal';
import { AlertTriangle } from '@/components/ui/icons';

export default function HostPanel() {
  const closeModal = useGameStore((s) => s.closeModal);
  const roomCode = useGameStore((s) => s.roomCode);
  const setRoomCode = useGameStore((s) => s.setRoomCode);

  const [watchUrl, setWatchUrl] = useState<string | null>(null);
  const [mirrorUrl, setMirrorUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // URL pública explícita (Tailscale Funnel u otro despliegue), horneada en
  // build. Si está definida tiene prioridad.
  const publicBase = process.env.NEXT_PUBLIC_PUBLIC_URL?.replace(/\/$/, '');

  const buildUrlsFromBase = (base: string, code: string) => {
    setWatchUrl(`${base}/game?viewer=${code}`);
    setMirrorUrl(`${base}/game?mirror=${code}`);
  };

  /**
   * Resuelve la base de las URLs del QR, en orden de prioridad:
   *  1. NEXT_PUBLIC_PUBLIC_URL si se definió en build.
   *  2. El origin actual si el anfitrión abrió la app por un host accesible para
   *     los móviles (p. ej. la URL `.ts.net` del Funnel, o una IP de LAN). Así el
   *     túnel funciona sin recompilar: basta abrir la app por su URL pública.
   *  3. La IP de LAN vía /api/network-info (caso: el anfitrión abrió localhost).
   */
  const resolveBase = async (): Promise<string> => {
    if (publicBase) return publicBase;
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '';
    if (!isLocal) return window.location.origin;
    const netRes = await fetch('/api/network-info');
    const { addresses, port } = await netRes.json();
    const ip = addresses?.[0]?.ip ?? 'localhost';
    return `http://${ip}:${port}`;
  };

  const createRoom = async () => {
    setCreating(true);
    setError(null);
    try {
      const roomRes = await fetch('/api/room/create', { method: 'POST' });
      const { code } = await roomRes.json();
      const base = await resolveBase();
      setRoomCode(code);
      buildUrlsFromBase(base, code);
    } catch {
      setError('Error al crear sala');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (roomCode) {
      resolveBase()
        .then((base) => buildUrlsFromBase(base, roomCode))
        .catch(() => {});
    } else {
      createRoom();
    }
  }, []);

  const displayCode = roomCode;

  return (
    <Modal open onClose={closeModal} title="Compartir Partida">
      <div className="px-5 py-6 flex flex-col items-center gap-4">
        {error && (
          <p className="inline-flex items-center gap-1.5 text-sm text-[color:var(--danger)]">
            <AlertTriangle size={14} strokeWidth={2} aria-hidden />
            {error}
          </p>
        )}

        {creating && !watchUrl && (
          <div className="flex items-center gap-3 text-sm text-[color:var(--text-secondary)]">
            <span
              className="spinner inline-block w-4 h-4 rounded-full border-2 border-[color:var(--accent)]/30 border-t-[color:var(--accent)]"
              aria-hidden
            />
            {'Creando sala...'}
          </div>
        )}

        {watchUrl && displayCode && (
          <>
            <p className="text-[color:var(--text-secondary)] text-sm text-center">
              {'Escanea el QR desde tu móvil para ver y jugar la partida en directo'}
            </p>

            <div className="bg-white p-4 rounded-[var(--radius-lg)] shadow-[var(--elevation-2)]">
              <QRCodeSVG value={watchUrl} size={200} />
            </div>

            <span
              className="text-3xl text-[color:var(--accent-soft)] font-bold tracking-widest"
              style={{ fontFamily: 'var(--font-share-tech-mono)' }}
            >
              {displayCode}
            </span>

            <div className="inline-flex items-center gap-2 text-sm text-[color:var(--success)]">
              <span className="w-2 h-2 rounded-full bg-[color:var(--success)] animate-pulse" />
              {'Transmitiendo en directo'}
            </div>

            {/* Mirror screens (TV/PC): no scanning — open the app and enter the code, or this URL */}
            <div className="w-full mt-1 pt-3 border-t border-[color:var(--accent-border-faint)] flex flex-col items-center gap-1">
              <p className="text-[color:var(--text-secondary)] text-sm text-center">
                {'¿Pantalla espejo (TV/PC)? Abre la app y entra en «Pantalla espejo» con el código '}
                <span className="text-[color:var(--accent-soft)] font-bold tracking-widest" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{displayCode}</span>
              </p>
              {mirrorUrl && (
                <p
                  className="text-[11px] text-[color:var(--text-muted)] text-center break-all select-all cursor-text"
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  {mirrorUrl}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
