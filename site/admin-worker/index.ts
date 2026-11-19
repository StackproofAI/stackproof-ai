/**
 * stackproof-leads-admin: private lead list + CSV export.
 * Protected by Cloudflare Access on its whole workers.dev URL (one-click in the dashboard),
 * AND this code validates the Access JWT itself (Cloudflare's guidance), so a misconfigured Access policy fails closed.
 */
import { createRemoteJWKSet, jwtVerify } from 'jose';

interface Env {
  DB: D1Database;
  ACCESS_TEAM_DOMAIN?: string; // e.g. https://<team>.cloudflareaccess.com
  ACCESS_AUD?: string;         // Application Audience (AUD) tag from the Access app
  ADMIN_EMAIL?: string;        // only this identity may read leads
}

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const csvCell = (s: unknown) => {
  let v = String(s ?? '');
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`; // spreadsheet formula injection guard
  return `"${v.replace(/"/g, '""')}"`;
};
const HEADERS = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow', 'x-frame-options': 'DENY', 'referrer-policy': 'no-referrer',
  'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'" };

async function authorised(req: Request, env: Env): Promise<boolean> {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !env.ADMIN_EMAIL) return false; // fail closed until configured
  const token = req.headers.get('cf-access-jwt-assertion');
  if (!token) return false;
  try {
    const jwks = createRemoteJWKSet(new URL(`${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`));
    const { payload } = await jwtVerify(token, jwks, { issuer: env.ACCESS_TEAM_DOMAIN, audience: env.ACCESS_AUD });
    return String(payload.email ?? '').toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
  } catch {
    return false;
  }
}

const COLS = ['created_at', 'name', 'email', 'company', 'website', 'country', 'team_size', 'tools', 'process_description', 'consent_at', 'consent_text_version', 'status'] as const;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (!(await authorised(req, env))) return new Response('Forbidden', { status: 403, headers: HEADERS });
    const url = new URL(req.url);
    const { results } = await env.DB.prepare(`SELECT ${COLS.join(', ')} FROM leads ORDER BY created_at DESC LIMIT 1000`).all();
    if (url.pathname === '/leads.csv') {
      const csv = [COLS.join(','), ...results.map((r) => COLS.map((c) => csvCell((r as Record<string, unknown>)[c])).join(','))].join('\r\n');
      return new Response(csv, { headers: { ...HEADERS, 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="stackproof-leads.csv"' } });
    }
    const rows = results.map((r) => `<tr>${COLS.map((c) => `<td>${esc((r as Record<string, unknown>)[c])}</td>`).join('')}</tr>`).join('');
    return new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Leads | Stackproof AI</title>
<style>body{font:14px/1.5 system-ui;background:#040508;color:#E8ECEF;margin:24px}a{color:#CEF949}table{border-collapse:collapse;width:100%}td,th{border:1px solid #2a3038;padding:6px 8px;vertical-align:top;text-align:left}th{color:#9AA8B6;font-weight:500}</style>
<h1>Assessment requests (${results.length})</h1><p><a href="/leads.csv">Download CSV</a></p>
<div style="overflow-x:auto"><table><tr>${COLS.map((c) => `<th>${c}</th>`).join('')}</tr>${rows}</table></div>`, { headers: { ...HEADERS, 'content-type': 'text/html; charset=utf-8' } });
  },
} satisfies ExportedHandler<Env>;
