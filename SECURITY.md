# Security Policy

## Supported Versions

The `main` branch and the latest published package version receive security fixes.

## Reporting a Vulnerability

Please report suspected vulnerabilities through GitHub Security Advisories or a private maintainer report with reproduction details, affected versions, and expected impact.

Do not include secrets, production credentials, or private connector manifests in reports. Redact tenant names and tokens from examples.

## Security Model

`connector-plan-skill` reads local task, policy, and connector manifest files. It produces routing and dry-run planning output only; it must not execute live connector actions or store credentials.
