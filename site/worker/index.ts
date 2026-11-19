/**
 * Public Worker. Static assets are served directly by Workers Static Assets;
 * this script only runs for /api/* (run_worker_first).
 */
import { handleLead, type Env } from './lead';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/lead') return handleLead(request, env);
    return Response.json({ status: 'not_found' }, { status: 404, headers: { 'cache-control': 'no-store' } });
  },
} satisfies ExportedHandler<Env>;
