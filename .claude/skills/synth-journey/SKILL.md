---
name: synth-journey
description: >
  Research a public-sector agency's website, identify up to 5 key public URLs
  (homepage, e-services landing page, major service entry points), and create
  HTTP availability monitors in Elastic via the Kibana Synthetics REST API.
context: inline
---

When invoked, follow this procedure:

## Step 1 — Gather inputs
If the user's message already contains the agency name and URL, extract them directly and skip asking.
Otherwise ask for:
- Agency or service name.
- Primary site URL (must be https:).

Derive the slug: lowercase, hyphen-separated agency name. Example: `iras`, `gobusiness`, `govsg`.

## Step 2 — Research (skip if `src/research/<slug>/notes.md` already exists)
Goal: discover the homepage, e-services landing page, and up to 3 high-traffic service pages.

1. Read the homepage via Jina: `https://r.jina.ai/<url>` with `Authorization: Bearer $JINA_API_KEY`.
2. Search for the e-services or digital services landing page:
   `https://s.jina.ai/?q=<agency> e-services digital services site:<domain>`
3. Read the e-services landing page if found.
4. Write discovered URLs (with purpose/rationale) to `src/research/<slug>/notes.md`.
5. If Jina returns no useful content, note this and fall back to common gov URL patterns
   (e.g. `/e-services`, `/digital-services`, `/services`).

## Step 3 — Select URLs (skip if `src/research/<slug>/monitors.md` already exists)
Choose up to 5 URLs that are:
- Publicly accessible (no login required).
- High-value to citizens or businesses (homepage, e-services entry, key services).

Write the final list to `src/research/<slug>/monitors.md` in this format:
```
## Monitors for <Agency Name>

| # | Name | URL | Rationale |
|---|------|-----|-----------|
| 1 | <Agency> — Homepage | https://... | Entry point for all citizens |
| 2 | <Agency> — E-Services | https://... | Main digital services portal |
...
```

## Step 4 — Create the agency file and push monitors
Create `src/agencies/<slug>.ts` exporting the monitor list:

```ts
import type { HttpMonitorConfig } from '../elastic/synthetics-api';

const tags = ['<slug>', 'public-sector'];
const locations = ['singapore'];

const monitors: HttpMonitorConfig[] = [
  { name: '<Agency> — Homepage',   url: 'https://...', tags, locations },
  { name: '<Agency> — E-Services', url: 'https://...', tags, locations },
  // up to 5 total
];

export default monitors;
```

Then run:
```
npm run push-monitors -- <slug>
```

This creates the monitors in Kibana and saves results to `src/research/<slug>/created-monitors.json`.

## Step 5 — Inform user
Tell the user:
- Which monitors were created (name + Kibana monitor ID).
- Any failures and the error message.
- Research notes are saved under `src/research/<slug>/`.
- To view monitors: Kibana → Observability → Synthetics → Monitors.
