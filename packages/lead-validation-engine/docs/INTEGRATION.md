# S1 Integration Contract

## Responsibility boundary
This library is a deterministic pre-processing component. S1 remains responsible for discovery, research, enrichment, qualification, scoring, authoritative persistence, and orchestration. S2 remains responsible for CRM lifecycle and synchronization.

## Recommended sequence
1. Authenticate the inbound request and resolve tenant identity from trusted server-side credentials. Never trust payload `tenant_id` as authorization.
2. Validate the transport envelope and enforce payload size and rate limits.
3. Load existing records using a tenant-scoped database query.
4. Call `validateLead(payload, { existingRecords })`.
5. Route `REJECTED` to a controlled correction/rejection path; do not persist it.
6. Route `REVIEW_REQUIRED` to duplicate review or an explicit upsert policy; do not silently create another record.
7. Persist `ACCEPTED` within a transaction protected by tenant-scoped uniqueness or idempotency constraints.
8. Emit an authenticated, versioned downstream event only after canonical persistence succeeds.
9. Record a minimal audit event without unnecessary contact PII.

## Concurrency warning
The in-memory duplicate check is advisory. Concurrent requests can both observe no existing record. Database-level uniqueness and transactional idempotency are mandatory for production.

## Not included
Database migrations/RLS policies, API endpoints, n8n nodes, Make modules, HubSpot sync, enrichment, scoring, email verification, consent/suppression checks, and production deployment. These require separate integration design and acceptance tests.
