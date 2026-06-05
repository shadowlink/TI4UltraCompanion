This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Jugar en red local (LAN)

La app está pensada para correr en **un único proceso**: el anfitrión arranca el servidor y
los móviles/espejos se sincronizan contra él. El estado de las salas se guarda en disco
(`os.tmpdir()`), lo que solo funciona con una instancia (sin autoescalado), no en serverless.

```bash
npm run build
npm run start   # escucha en 0.0.0.0:3000
```

En la misma WiFi, abre el panel de anfitrión y escanea el QR: apunta a la IP de LAN del equipo.

## Jugar por internet con Tailscale Funnel

Para jugar con gente fuera de tu red, expón el servidor del anfitrión con **Tailscale Funnel**
(URL pública HTTPS; los jugadores no instalan nada). Gratis y sin coste por uso, a cambio de
tener el PC encendido durante la partida.

1. Instala [Tailscale](https://tailscale.com/) en el PC anfitrión e inicia sesión (plan Personal).
2. Habilita **Funnel** una vez en la consola de administración: activa MagicDNS y los
   certificados HTTPS, y concede el atributo `funnel` al equipo en la política de acceso.
3. Arranca la app: `npm run build && npm run start` (escucha en el `:3000`).
4. Expón el puerto: `tailscale funnel 3000`. Obtendrás una URL pública estable, p. ej.
   `https://mi-equipo.mi-tailnet.ts.net`.
5. Para que el QR apunte ahí, **abre la app del anfitrión por esa URL** (el QR usará ese origin
   automáticamente). Alternativamente, define `NEXT_PUBLIC_PUBLIC_URL` con esa URL antes de
   `npm run build`. Ver `.env.example`.

Los jugadores escanean el QR desde cualquier red (datos móviles incluidos) y se unen.

Notas:
- El PC anfitrión debe estar encendido durante la partida (usa su CPU y subida de internet).
- Funnel solo publica de cara fuera en los puertos 443/8443/10000 (proxea a tu `:3000`).
- Ante un reinicio del servidor se pierde el estado en curso; usa la exportación/copia de la
  partida desde la app para tener un respaldo.

# TI4UltraCompanion
