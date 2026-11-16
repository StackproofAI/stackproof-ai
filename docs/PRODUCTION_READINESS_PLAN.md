# STACKPROOF AI — Production Readiness Plan

**Plan status:** In progress  
**Baseline date:** 2026-11-17  
**Scope:** GitHub repository engineering plus verification of the S1 and S2 automation systems.

## 1. Current verified position

### GitHub repository

The repository currently provides project documentation, architecture, engineering standards, system status, security guidance, contribution guidance, and issue templates.

The repository does not currently contain the deployed application source code or exported Make scenario definitions. At the baseline review:

- No GitHub Actions workflow was present.
- No GitHub Actions workflow runs were recorded.
- No GitHub Releases were published.
- Branch protection could not be verified through the available integration.

This repository is therefore a documentation and project-governance repository at this stage. It must not be represented as the source of a deployed application until implementation code and release artifacts are added.

### Automation environment

S1 and S2 are implemented as Make scenarios connected to Supabase, Groq, HubSpot, and (for S2) Gmail. The available account inspection reported healthy connection status and no Make module-configuration issues at the time of review.

This is structural evidence only. It does not prove that every external service operation, security control, or failure path works as intended.

A material configuration discrepancy was identified: S1 is currently active, while its scenario description says it should remain inactive pending confirmation of webhook sender authentication and production acceptance. Resolve and document this discrepancy before production approval.

S2 has recorded successful executions and recorded failures. The failures include authorization, AI JSON-generation, and scenario validation errors. These require root-cause review and regression tests.

## 2. Workstream A — Repository engineering

1. Establish a documented repository purpose and source-of-truth boundary.
2. Add automated checks that match the repository's current contents.
3. Add dependency update automation for GitHub Actions.
4. Establish a source-code layout only after the runtime, language, deployment target, and ownership model are confirmed.
5. Keep credentials, live webhook URLs, customer records, and unredacted scenario exports out of the public repository.
6. Add release notes and versioned releases only when there is a releasable artifact.

**Important:** Documentation checks are not application tests. They must not be presented as evidence that S1 or S2 passed functional tests.

## 3. Workstream B — Security and governance

Required controls before production approval:

- Least-privilege credentials and service accounts.
- Authenticated webhook senders, with secrets stored outside workflow definitions.
- Tenant isolation and server-side authorization checks.
- Input validation and safe handling of untrusted data.
- Idempotency and duplicate prevention, including concurrent requests.
- Data minimization and retention rules.
- Human approval for consequential actions.
- Audit records for successful, rejected, and failed processing.
- Recovery procedures for partial writes and downstream outages.
- Restricted GitHub Actions permissions and reviewed workflow dependencies.

## 4. Workstream C — S1 acceptance

S1 must pass documented tests for:

1. Valid, consented intake from an authenticated sender.
2. Missing or invalid sender authentication.
3. Invalid email, tenant identifier, consent state, and required fields.
4. Unknown tenant and unauthorized tenant membership.
5. Duplicate submission identifiers.
6. Concurrent duplicate submissions.
7. AI provider timeout, invalid JSON, and provider unavailability.
8. Supabase persistence failure and recovery.
9. Optional HubSpot synchronization failure without corrupting the canonical lead record.
10. Correct downstream S2 handoff only after canonical lead and intelligence persistence.
11. Audit logging and safe, accurate webhook responses.

Evidence must include sanitized test inputs, expected results, actual results, timestamps, and reviewer.

## 5. Workstream D — S2 acceptance

S2 must pass documented tests for:

1. Valid on-demand invocation with a canonical S1 lead.
2. Missing or invalid tenant, lead, submission, or CRM identifiers.
3. Missing canonical S1 intelligence.
4. Duplicate and concurrent event processing.
5. AI provider timeout, malformed JSON, and schema violations.
6. Supabase persistence failure.
7. Gmail draft creation and persistence of the draft identifier.
8. HubSpot task and note creation, including owner assignment.
9. Downstream partial failure and recovery.
10. Human approval state and proof that no email is sent automatically.
11. Complete activity and error audit logging.

## 6. Workstream E — Release and operations

Before a system is approved for production, maintain:

- A versioned implementation and configuration baseline.
- A passing acceptance-test report.
- A security review and credential inventory.
- Monitoring and alert ownership.
- Backup and restore evidence where persistent data is involved.
- A rollback or disablement procedure.
- An incident and failure-handling procedure.
- Named operator and reviewer approval.

## 7. Status definitions

| Status | Meaning |
|---|---|
| NOT STARTED | Work has not begun. |
| RESEARCH | Requirements and platform capabilities are being verified. |
| ARCHITECTURE | Design and data contracts are being defined. |
| DEVELOPMENT | Implementation is in progress. |
| TESTING | Acceptance and failure-path tests are being executed. |
| BLOCKED | A dependency or failed control prevents progress. |
| READY FOR APPROVAL | Required evidence exists and awaits reviewer approval. |
| PRODUCTION | Approved and deployed with operational controls. |
| MAINTENANCE | Live system under monitoring and controlled change. |

## 8. Change control and safety

Do not activate, deactivate, replay, or materially modify live scenarios as part of an audit without explicit authorization. Do not send customer communications or process real customer data as test data. Use a dedicated test tenant and synthetic records for acceptance testing.

Every status change must cite the evidence, test environment, test date, result, known limitations, and reviewer.

## 9. Immediate next actions

1. Complete the read-only S1/S2 configuration and execution audit.
2. Resolve the S1 active-state versus authentication-acceptance discrepancy.
3. Inspect the recorded S2 failures and establish regression tests.
4. Confirm whether GitHub is intended to contain application source code, Make scenario exports, or only governance documentation.
5. Confirm the chosen deployment/runtime architecture before adding application scaffolding.
6. Complete CI and security settings, then validate the workflow on a pull request.
