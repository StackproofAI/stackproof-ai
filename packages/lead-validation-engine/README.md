# STACKPROOF Lead Validation Engine

A deterministic, dependency-free JavaScript module for validating and normalizing inbound leads before S1/S2 processing.

## Requirements
- Node.js 20 or newer.
- No runtime dependencies.

## Use
```js
import { validateLead } from '@stackproof-ai/lead-validation-engine';
const result = validateLead({
  tenant_id: 'tenant-acme',
  submission_id: 'form-00042',
  company_name: 'Acme Realty',
  contact_name: 'Jordan Lee',
  email: 'JORDAN@ACME.EXAMPLE',
  phone: '+1 (415) 555-0100',
  website: 'acme.example',
  source: 'website'
});
```

Route results by `status`: `REJECTED` (correct or reject), `REVIEW_REQUIRED` (possible duplicate; review or apply explicit upsert policy), and `ACCEPTED` (eligible for the next authorized processing step).

## Contract
`validateLead(input, { existingRecords })` is synchronous and performs no I/O. Required fields: `tenant_id`, `company_name`, and at least one of `email` or `phone`. Optional fields: `submission_id`, `contact_name`, `website`, `source`.

Duplicate detection compares exact normalized email first, then exact normalized phone, only within the same tenant. A shared company name or website is not considered a duplicate because multiple valid contacts can belong to one organization. Existing records must come from an authoritative tenant-scoped query.

The SHA-256 fingerprint is tenant-scoped and based on email, or phone when email is absent. It is a correlation key—not an authentication token or database uniqueness constraint.

## Security and limitations
- No network, filesystem, database, CRM, email, or AI calls; no logging.
- The caller must authenticate tenant identity; `tenant_id` in the payload is not authorization.
- Duplicate checking is advisory. Production callers must enforce transactional idempotency and tenant-scoped database uniqueness to prevent concurrent duplicate inserts.
- Email syntax is not mailbox verification. Phone length is not reachability verification. Website normalization does not fetch or verify the site.
- Consent, suppression, legal basis, and contact permission are outside this component.
- Caller must avoid logging unnecessary personal data.

## Test
Run `npm test`. Tests use Node's built-in runner; no third-party test dependencies.
