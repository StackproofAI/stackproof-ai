/**
 * POST /api/lead — the only dynamic route. Everything stays on Cloudflare (no outside systems).
 * Order: method/origin → rate limit (per IP) → parse → honeypot → validate → Turnstile (server) → D1 insert.
 * Responses: 200 {status:"saved"|"duplicate"} · 400 {errors} · 403 verify · 429 rate · 503 storage error.
 */
export interface Env {
  DB: D1Database;
  LEAD_RL?: RateLimit;
  TURNSTILE_SECRET?: string;
  TURNSTILE_HOSTNAMES?: string; // comma-separated; checked only with real (non-test) keys
  /** LOCAL TESTING ONLY (.dev.vars): mock siteverify URL. Ignored unless a Turnstile TEST secret is configured. */
  TURNSTILE_VERIFY_URL?: string;
}

const TEST_SECRET_PREFIX = /^[123]x0000000000000000000000000000000A[AB]$/;
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });

const LIMITS = { name: 120, email: 200, company: 160, website: 200, country: 60, team_size: 30, tool: 40, tools_other: 200, process: 3000, consent_text_version: 40 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URLISH = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

type Fields = Record<string, string>;
export type Lead = { fields: Fields; tools: string[] };
export function validate(fd: FormData): { ok: true; v: Lead } | { ok: false; errors: Record<string, string> } {
  const s = (k: string) => String(fd.get(k) ?? '').trim();
  const v: Fields = {
    name: s('name'), email: s('email'), company: s('company'), website: s('website'), country: s('country'),
    team_size: s('team_size'), process: s('process'), tools_other: s('tools_other'), consent_text_version: s('consent_text_version'),
  };
  const e: Record<string, string> = {};
  for (const k of ['name', 'email', 'company', 'country', 'team_size', 'process'] as const) if (!v[k]) e[k] = 'required';
  for (const [k, max] of Object.entries(LIMITS)) if (k in v && v[k].length > max) e[k] = 'too_long';
  if (v.email && !EMAIL.test(v.email)) e.email = 'email';
  if (v.website && !URLISH.test(v.website)) e.website = 'url';
  if (fd.get('consent') !== 'on') e.consent = 'consent';
  if (!v.consent_text_version) e.consent = 'consent';
  const tools = fd.getAll('tools').map(String).map((t) => t.trim()).filter(Boolean).slice(0, 15);
  if (tools.some((t) => t.length > LIMITS.tool)) e.tools = 'too_long';
  if (v.tools_other) tools.push(`Other: ${v.tools_other}`);
  return Object.keys(e).length ? { ok: false, errors: e } : { ok: true, v: { fields: v, tools } };
}

async function verifyTurnstile(env: Env, token: string, ip: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET || !token) return false;
  try {
    const isTest = TEST_SECRET_PREFIX.test(env.TURNSTILE_SECRET);
    const endpoint = isTest && env.TURNSTILE_VERIFY_URL ? env.TURNSTILE_VERIFY_URL : 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const out = (await r.json()) as { success?: boolean; hostname?: string };
    if (!out.success) return false;
    // Test keys always report hostname "example.com", so the hostname check applies to real keys only.
    if (!TEST_SECRET_PREFIX.test(env.TURNSTILE_SECRET) && env.TURNSTILE_HOSTNAMES) {
      return env.TURNSTILE_HOSTNAMES.split(',').map((h) => h.trim()).includes(out.hostname ?? '');
    }
    return true;
  } catch {
    return false;
  }
}

export async function handleLead(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (request.method !== 'POST') return json({ status: 'method_not_allowed' }, 405);
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return json({ status: 'forbidden' }, 403);
  if (Number(request.headers.get('content-length') ?? 0) > 32_000) return json({ status: 'too_large' }, 413);

  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (env.LEAD_RL) {
    const { success } = await env.LEAD_RL.limit({ key: `lead:${ip}` });
    if (!success) return json({ status: 'rate_limited' }, 429);
  }

  let fd: FormData;
  try { fd = await request.formData(); } catch { return json({ status: 'bad_request' }, 400); }

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (String(fd.get('company_fax') ?? '').trim()) return json({ status: 'saved' });

  const res = validate(fd);
  if (!res.ok) return json({ status: 'invalid', errors: res.errors }, 400);

  if (!(await verifyTurnstile(env, String(fd.get('cf-turnstile-response') ?? ''), ip))) {
    return json({ status: 'verify_failed' }, 403);
  }

  const v = res.v.fields;
  const now = new Date();
  const iso = now.toISOString();
  const referer = request.headers.get('referer');
  let source: string | null = null;
  try { source = referer ? new URL(referer).pathname : null; } catch { /* ignore */ }

  try {
    const r = await env.DB.prepare(
      `INSERT INTO leads (id, created_at, submit_date, name, email, email_normalised, company, website, country, team_size, tools,
         process_description, consent_at, consent_text_version, locale, source_path, status)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, 'en', ?15, 'new')
       ON CONFLICT (email_normalised, submit_date) DO NOTHING`,
    )
      .bind(
        crypto.randomUUID(), iso, iso.slice(0, 10), v.name, v.email, v.email.toLowerCase(), v.company, v.website || null,
        v.country, v.team_size, JSON.stringify(res.v.tools), v.process, iso, v.consent_text_version, source,
      )
      .run();
    return json({ status: r.meta.changes > 0 ? 'saved' : 'duplicate' });
  } catch (err) {
    console.error('lead insert failed', err instanceof Error ? err.message : String(err));
    return json({ status: 'error' }, 503);
  }
}
