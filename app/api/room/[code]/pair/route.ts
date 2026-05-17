import { addPairing } from '@/lib/sync/roomStore';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  let body: { deviceId?: string; factionIdx?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.deviceId || typeof body.factionIdx !== 'number') {
    return Response.json({ error: 'Missing deviceId or factionIdx' }, { status: 400 });
  }
  const result = addPairing(code, body.deviceId, body.factionIdx);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 409 });
  }
  return Response.json({ ok: true });
}
