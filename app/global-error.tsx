'use client';

/**
 * Último recurso ante un error catastrófico del layout raíz. Debe renderizar
 * su propio <html>/<body>. Ofrece reanudar la partida (que sigue guardada en
 * localStorage) recargando la ruta del juego.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: 24,
          textAlign: 'center',
          background: '#07070d',
          color: '#f5f5f7',
          fontFamily: 'Aldrich, Verdana, sans-serif',
        }}
      >
        <h1 style={{ color: '#ff9933', fontSize: 28, margin: 0 }}>Algo ha fallado</h1>
        <p style={{ color: '#b8b8c4', maxWidth: 420 }}>
          Tu partida está guardada. Pulsa para reanudarla donde lo dejaste.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => window.location.assign('/game?continue=1')}
            style={{
              padding: '12px 24px',
              borderRadius: 6,
              border: '1px solid rgba(255,153,51,0.6)',
              background: 'rgba(255,153,51,0.15)',
              color: '#ffb066',
              textTransform: 'uppercase',
              letterSpacing: 1,
              cursor: 'pointer',
            }}
          >
            Reanudar partida
          </button>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              borderRadius: 6,
              border: '1px solid rgba(255,153,51,0.35)',
              background: 'transparent',
              color: '#ffb066',
              textTransform: 'uppercase',
              letterSpacing: 1,
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
