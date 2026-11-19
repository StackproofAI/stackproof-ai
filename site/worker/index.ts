/**
 * Public Worker. Static assets are served directly by Workers Static Assets;
 * this script only runs for /api/* (run_worker_first).
 * Checkpoint 2: the lead endpoint is a stub. It is implemented at checkpoint 4.
 */
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/lead') {
      return Response.json(
        { status: 'unavailable', message: 'The request form is not connected yet.' },
        { status: 503, headers: { 'cache-control': 'no-store' } },
      );
    }
    return Response.json({ status: 'not_found' }, { status: 404 });
  },
} satisfies ExportedHandler;
