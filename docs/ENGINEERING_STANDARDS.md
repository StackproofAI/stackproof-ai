# Engineering Standards

These standards translate the STACKPROOF AI Master Engineering Directive into reviewable engineering expectations.

## Operating principles

1. Correctness over agreement.
2. Evidence over assumptions.
3. Production readiness over demonstrations.
4. Simplicity over unnecessary complexity.
5. Reliability over speed.
6. Security over convenience.
7. Measurable business value over technical novelty.
8. Independent verification over unsupported confidence.

## Evidence labels

Use explicit status language in documentation and reviews:

- **Verified:** directly confirmed by an observed result or reproducible test.
- **User-provided:** stated in project materials but not independently verified.
- **Assumption:** a premise that requires confirmation.
- **Proposed:** a design or recommendation not yet implemented.
- **Untested:** implemented or described but not validated by an appropriate test.
- **Blocked:** progress depends on an unresolved prerequisite.
- **Passed:** the stated acceptance test completed successfully.
- **Failed:** the stated acceptance test did not pass.

Never describe a workflow as working, deployed, secure, or production-ready without supporting evidence.

## Workflow reliability

Production-bound automations should address:

- Explicit trigger and input contracts.
- Input validation and normalization.
- Authentication and authorization for inbound events.
- Idempotency keys or equivalent duplicate controls.
- Concurrency and race-condition handling.
- Timeouts, bounded retries, and rate-limit handling.
- Dead-letter or recoverable error paths where appropriate.
- Structured logs with correlation identifiers.
- Monitoring, alerting, and operational ownership.
- Documented recovery and replay procedures.

## AI output controls

- Define the task, allowed context, output schema, and failure behavior.
- Validate structured outputs before downstream use.
- Treat external content and retrieved data as untrusted input.
- Do not allow model output alone to authorize consequential actions.
- Record model and prompt changes where they affect system behavior.
- Route low-confidence or ambiguous outcomes to human review.

## Human approval

Require human review before consequential customer-facing or business actions where specified by the system design. In particular, S3 outreach and S5 customer communications must remain drafts until approved. S4 must not initiate automatic customer communications.

## Security and privacy

- Apply least privilege.
- Keep secrets outside source control.
- Minimize personal and confidential data.
- Validate all external inputs.
- Protect webhooks and API endpoints.
- Avoid sensitive data in logs.
- Define retention and deletion expectations.
- Review third-party permissions and data flows.

## Testing and acceptance

Each system should define:

- Happy-path tests.
- Invalid-input tests.
- Duplicate and replay tests.
- Concurrent-event tests where relevant.
- Authentication and authorization tests.
- Rate-limit and timeout tests.
- Downstream dependency failure tests.
- Recovery and observability checks.
- Human-approval enforcement tests.

Record test date, environment, test case, expected result, actual result, evidence, and reviewer. Mark tests not run as **NOT TESTED**, not PASS.

## Release gate

A production release requires documented requirements, reviewed architecture, completed implementation, passing acceptance tests, security review, operational monitoring, rollback or recovery procedure, and explicit deployment approval.
