import { createHash } from 'node:crypto';

const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

function cleanString(value) {
  return typeof value === 'string' ? value.trim().replace(/\\s+/g, ' ') : '';
}

export function normalizeEmail(value) {
  return cleanString(value).toLowerCase();
}

export function normalizePhone(value) {
  const raw = cleanString(value);
  if (!raw) return '';
  const digits = raw.replace(/\\D/g, '');
  return digits ? `${raw.startsWith('+') ? '+' : ''}${digits}` : '';
}

export function normalizeWebsite(value) {
  const raw = cleanString(value);
  if (!raw) return '';
  try {
    const url = new URL(/^https?:\\/\\//i.test(raw) ? raw : `https://${raw}`);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) return '';
    return url.origin.toLowerCase();
  } catch {
    return '';
  }
}

function makeFingerprint(tenantId, type, identifier) {
  return createHash('sha256').update(`${tenantId}\\u0000${type}\\u0000${identifier}`).digest('hex');
}

function findDuplicate(lead, records) {
  for (const record of records) {
    if (!record || record.tenant_id !== lead.tenant_id) continue;
    const email = normalizeEmail(record.email);
    if (lead.email && email && lead.email === email) {
      return { matched: true, reason: 'EMAIL_MATCH', record_id: cleanString(record.id) || null };
    }
    const phone = normalizePhone(record.phone);
    if (lead.phone && phone && lead.phone === phone) {
      return { matched: true, reason: 'PHONE_MATCH', record_id: cleanString(record.id) || null };
    }
  }
  return { matched: false, reason: null, record_id: null };
}

/**
 * Deterministically validate and normalize an untrusted lead payload.
 * Performs no I/O. Duplicate checks inspect only caller-supplied same-tenant records.
 * @param {object} input
 * @param {{existingRecords?: object[]}} [options]
 */
export function validateLead(input, options = {}) {
  const errors = [];
  const warnings = [];
  const emptyDuplicate = { matched: false, reason: null, record_id: null };

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, status: 'REJECTED', errors: ['INVALID_INPUT_OBJECT'], warnings, lead: null, duplicate: emptyDuplicate, fingerprint: null };
  }

  const tenant_id = cleanString(input.tenant_id);
  const company_name = cleanString(input.company_name);
  const contact_name = cleanString(input.contact_name);
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const websiteInput = cleanString(input.website);
  const website = normalizeWebsite(websiteInput);
  const source = cleanString(input.source);
  const submission_id = cleanString(input.submission_id);

  if (!tenant_id) errors.push('TENANT_ID_REQUIRED');
  if (!company_name) errors.push('COMPANY_NAME_REQUIRED');
  if (!email && !phone) errors.push('EMAIL_OR_PHONE_REQUIRED');
  if (email && !EMAIL_RE.test(email)) errors.push('EMAIL_INVALID');
  const phoneDigits = phone.replace(/\\D/g, '').length;
  if (phone && (phoneDigits < 7 || phoneDigits > 15)) errors.push('PHONE_INVALID');
  if (websiteInput && !website) errors.push('WEBSITE_INVALID');
  if (!contact_name) warnings.push('CONTACT_NAME_MISSING');

  if (errors.length) {
    return { ok: false, status: 'REJECTED', errors: [...new Set(errors)], warnings, lead: null, duplicate: emptyDuplicate, fingerprint: null };
  }

  const lead = {
    tenant_id,
    submission_id: submission_id || null,
    company_name,
    contact_name: contact_name || null,
    email: email || null,
    phone: phone || null,
    website: website || null,
    source: source || null
  };

  const records = Array.isArray(options.existingRecords) ? options.existingRecords : [];
  const duplicate = findDuplicate(lead, records);
  if (duplicate.matched) warnings.push('POSSIBLE_DUPLICATE');
  const type = email ? 'email' : 'phone';
  const identifier = email || phone;

  return {
    ok: true,
    status: duplicate.matched ? 'REVIEW_REQUIRED' : 'ACCEPTED',
    errors: [],
    warnings,
    lead,
    duplicate,
    fingerprint: makeFingerprint(tenant_id, type, identifier)
  };
}
