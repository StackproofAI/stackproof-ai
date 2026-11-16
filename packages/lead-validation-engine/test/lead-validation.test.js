import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLead, normalizeEmail, normalizePhone, normalizeWebsite } from '../src/index.js';

const valid = {
  tenant_id: 'tenant-test', submission_id: 'submission-001',
  company_name: '  Example   Realty  ', contact_name: ' Jane Doe ',
  email: ' JANE@EXAMPLE.COM ', phone: '+1 (415) 555-0100',
  website: 'example.com/about', source: 'website'
};

test('normalizes email, phone, and website', () => {
  assert.equal(normalizeEmail(' Jane@Example.com '), 'jane@example.com');
  assert.equal(normalizePhone('+1 (415) 555-0100'), '+14155550100');
  assert.equal(normalizeWebsite('example.com/path'), 'https://example.com');
});
test('accepts and normalizes a valid lead', () => {
  const r = validateLead(valid);
  assert.equal(r.ok, true); assert.equal(r.status, 'ACCEPTED');
  assert.equal(r.lead.company_name, 'Example Realty');
  assert.equal(r.lead.email, 'jane@example.com');
  assert.equal(r.lead.website, 'https://example.com');
  assert.equal(typeof r.fingerprint, 'string');
});
test('rejects non-object payload', () => assert.equal(validateLead(null).errors[0], 'INVALID_INPUT_OBJECT'));
test('requires tenant, company, and contact channel', () => {
  assert.deepEqual(validateLead({}).errors, ['TENANT_ID_REQUIRED', 'COMPANY_NAME_REQUIRED', 'EMAIL_OR_PHONE_REQUIRED']);
});
test('rejects malformed email, phone, and website', () => {
  assert.ok(validateLead({ ...valid, email: 'bad' }).errors.includes('EMAIL_INVALID'));
  assert.ok(validateLead({ ...valid, phone: '123' }).errors.includes('PHONE_INVALID'));
  assert.ok(validateLead({ ...valid, website: 'https://bad host' }).errors.includes('WEBSITE_INVALID'));
});
test('flags exact same-tenant email duplicate', () => {
  const r = validateLead(valid, { existingRecords: [{ id: 'lead-7', tenant_id: 'tenant-test', email: 'jane@example.com' }] });
  assert.equal(r.status, 'REVIEW_REQUIRED'); assert.equal(r.duplicate.reason, 'EMAIL_MATCH'); assert.equal(r.duplicate.record_id, 'lead-7');
});
test('does not cross tenant boundaries', () => {
  const r = validateLead(valid, { existingRecords: [{ id: 'lead-7', tenant_id: 'other', email: 'jane@example.com' }] });
  assert.equal(r.status, 'ACCEPTED'); assert.equal(r.duplicate.matched, false);
});
test('flags phone duplicate when email absent', () => {
  const r = validateLead({ ...valid, email: '' }, { existingRecords: [{ id: 'lead-8', tenant_id: 'tenant-test', phone: '+14155550100' }] });
  assert.equal(r.duplicate.reason, 'PHONE_MATCH');
});
test('does not treat shared website as duplicate', () => {
  const r = validateLead(valid, { existingRecords: [{ tenant_id: 'tenant-test', email: 'other@example.com', website: 'https://example.com' }] });
  assert.equal(r.duplicate.matched, false);
});
test('fingerprint is tenant-scoped', () => {
  assert.notEqual(validateLead(valid).fingerprint, validateLead({ ...valid, tenant_id: 'tenant-other' }).fingerprint);
});
test('does not mutate input', () => {
  const input = structuredClone(valid); validateLead(input); assert.deepEqual(input, valid);
});
test('rejected input has no fingerprint', () => assert.equal(validateLead({ ...valid, email: 'bad' }).fingerprint, null));
