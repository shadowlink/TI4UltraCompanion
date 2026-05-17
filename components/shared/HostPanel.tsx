'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useGameStore } from '@/store/gameStore';

export default function HostPanel() {
  const lang = useGameStore((s) => s.lang);
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
      setError(lang === 'es' ? 'Error al crear sala' : 'Failed to create room');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (roomCode) {
      // Room already exists, just rebuild the URL
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
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div className="bg-gray-900 border border-orange-500/40 rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2
            className="text-lg text-orange-400 text-shadow"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {lang === 'es' ? 'Compartir Partida' : 'Share Game'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="px-5 py-6 flex flex-col items-center gap-4">
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {creating && !watchUrl && (
            <p className="text-gray-400 text-sm">
              {lang === 'es' ? 'Creando sala...' : 'Creating room...'}
            </p>
          )}

          {watchUrl && displayCode && (
            <>
              <p className="text-gray-300 text-sm text-center">
                {lang === 'es'
                  ? 'Escanea el QR desde tu móvil para ver la partida en directo'
                  : 'Scan the QR from your phone to watch the game live'}
              </p>

              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG value={watchUrl} size={200} />
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="text-3xl text-orange-400 font-bold tracking-widest"
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  {displayCode}
                </span>
              </div>

              <p
                className="text-xs text-gray-500 text-center break-all select-all cursor-text"
                style={{ fontFamily: 'var(--font-share-tech-mono)' }}
              >
                {watchUrl}
              </p>

              <div className="flex items-center gap-2 text-sm text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {lang === 'es' ? 'Transmitiendo en directo' : 'Broadcasting live'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
