import { networkInterfaces } from 'os';

export async function GET(request: Request) {
  const interfaces = networkInterfaces();
  const addresses: { ip: string; name: string }[] = [];

  for (const [name, nets] of Object.entries(interfaces)) {
    if (!nets) continue;
    for (const net of nets) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push({ ip: net.address, name: name });
      }
    }
  }

  const host = request.headers.get('host') ?? 'localhost:3000';
  const port = parseInt(host.split(':')[1] ?? '3000', 10);

  return Response.json({ addresses, port });
}
