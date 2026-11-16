# Security Policy

STACKPROOF AI treats security as an engineering requirement.

## Reporting a vulnerability

Do not publish credentials, exploit instructions, private customer information, or sensitive vulnerability details in a public issue.

Use GitHub's private vulnerability reporting feature for this repository if it is enabled. Otherwise, contact the repository maintainers through an established private channel and provide:

- A concise description of the issue.
- Affected repository path, component, or workflow.
- Reproduction steps that do not expose real user data.
- Potential impact and suggested mitigations.

Do not test against systems, accounts, or data you do not own or have explicit permission to assess.

## Secret and data handling

Never commit:

- API keys, passwords, access tokens, private keys, or session cookies.
- Production webhook URLs containing secrets.
- Customer, prospect, employee, or other personal data.
- Private workflow exports containing credentials or confidential business logic.
- Database dumps or unredacted logs.

Use environment variables or an approved secrets manager for runtime credentials. Apply least-privilege access and rotate any credential that may have been exposed.

## Engineering safeguards

Production-bound systems should be assessed for:

- Authentication and authorization.
- Input validation and safe parsing.
- Secret management and access control.
- Duplicate prevention and idempotency.
- Rate limits, retries, timeouts, and failure recovery.
- Audit logging and sensitive-data minimization.
- Human approval for consequential external actions.

## Scope and disclosure

This document describes project security expectations. It is not a claim that every STACKPROOF AI component has completed a security audit or achieved a particular certification.
