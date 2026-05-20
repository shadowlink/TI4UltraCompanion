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
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const createRoom = async () => {
    setCreating(true);
    setError(null);
    try {
      const [roomRes, netRes] = await Promise.all([
        fetch('/api/room/create', { method: 'POST' }),
        fetch('/api/network-info'),
      ]);
      const { code } = await roomRes.json();
      const { addresses, port } = await netRes.json();
      const ip = addresses?.[0]?.ip ?? 'localhost';
      const url = `http://${ip}:${port}/game?viewer=${code}`;
      setRoomCode(code);
      setWatchUrl(url);
    } catch {
      setError('Error al crear sala');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (roomCode) {
      fetch('/api/network-info')
        .then((r) => r.json())
        .then(({ addresses, port }) => {
          const ip = addresses?.[0]?.ip ?? 'localhost';
          setWatchUrl(`http://${ip}:${port}/game?viewer=${roomCode}`);
        })
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
              {'Escanea el QR desde tu móvil para ver la partida en directo'}
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

            <p
              className="text-xs text-[color:var(--text-muted)] text-center break-all select-all cursor-text"
              style={{ fontFamily: 'var(--font-share-tech-mono)' }}
            >
              {watchUrl}
            </p>

            <div className="inline-flex items-center gap-2 text-sm text-[color:var(--success)]">
              <span className="w-2 h-2 rounded-full bg-[color:var(--success)] animate-pulse" />
              {'Transmitiendo en directo'}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
