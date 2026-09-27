---
name: Dependency firewall compatibility
description: Replit package installation may block older transitive artifacts even when the application is unchanged.
---

When dependency installation is blocked by the package firewall, first check the blocked package's parent version ranges and registry metadata. Prefer a compatible patch upgrade or a narrow npm override; do not bypass the firewall or migrate the application stack just to install dependencies.

**Why:** The imported frontend's locked legacy packages included several blocked artifacts. Updating compatible lock entries and adding one scoped override restored reproducible installation while preserving the existing React structure.

**How to apply:** During future installs, inspect the exact blocked package and its parent range, update only the relevant lock entry when the range permits it, and use an override only when the secure version is outside that range.