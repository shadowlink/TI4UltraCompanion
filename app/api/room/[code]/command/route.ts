import { enqueueCommand } from '@/lib/sync/roomStore';
import type { MobileCommand } from '@/lib/sync/types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  let body: { deviceId?: string; command?: MobileCommand };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.deviceId || !body.command || !body.command.type) {
    return Response.json({ error: 'Missing deviceId or command' }, { status: 400 });
  }
  const result = enqueueCommand(code, body.deviceId, body.command);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 403 });
  }
  return Response.json({ ok: true });
}
