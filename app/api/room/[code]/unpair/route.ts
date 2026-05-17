import { removePairing } from '@/lib/sync/roomStore';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  let body: { deviceId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.deviceId) {
    return Response.json({ error: 'Missing deviceId' }, { status: 400 });
  }
  const ok = removePairing(code, body.deviceId);
  if (!ok) {
    return Response.json({ error: 'Room not found' }, { status: 404 });
  }
  return Response.json({ ok: true });
}
