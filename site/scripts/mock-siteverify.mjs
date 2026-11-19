// Local stand-in for Turnstile siteverify (this sandbox cannot reach challenges.cloudflare.com).
// Mirrors Cloudflare's documented test-key behaviour: only the dummy token passes.
import { createServer } from 'node:http';
createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const { response } = JSON.parse(body || '{}');
    const ok = response === 'XXXX.DUMMY.TOKEN.XXXX';
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(ok ? { success: true, hostname: 'example.com', 'error-codes': [] } : { success: false, 'error-codes': ['invalid-input-response'] }));
  });
}).listen(8899, '127.0.0.1', () => console.log('mock siteverify on :8899'));
