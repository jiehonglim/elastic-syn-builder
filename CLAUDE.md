# Project: Elastic Synthetics HTTP Monitor Generator (Public Sector Focus)

## Purpose
This repo builds tools that, given a government agency (or public-sector service) name and URL:
1. Research the agency's website to identify its most important public-facing pages.
2. Select up to 5 key URLs (homepage, e-services landing page, major service entry points).
3. Create HTTP monitors for those URLs via the Kibana Synthetics REST API.

No Playwright scripting is required — monitors are lightweight HTTP availability checks.

## Domain focus
- Target users are **citizens** and **businesses** interacting with public-sector services.
- Focus on publicly accessible pages only. Never monitor login-gated or authenticated pages.

## Required environment variables
Set these in a `.env` file at the project root (never commit it):
```
ELASTIC_KIBANA_URL=       # Your Kibana/Observability project URL
ELASTIC_API_KEY=          # Elasticsearch API key (also used for Kibana API auth)
JINA_API_KEY=             # Jina Reader/Search API key
```

## Research tools
- Use Jina Reader/Search for structured content extraction:
  - Search: `https://s.jina.ai/?q=<query>`
  - Read:   `https://r.jina.ai/<url>`
  - Include header: `Authorization: Bearer $JINA_API_KEY`
- Goal: find the homepage, e-services landing page, and up to 3 high-traffic service pages.
- If Jina returns no useful content, note this in the research file and fall back to common gov UX patterns.

## Folder structure (per agency)
```
src/
  agencies/
    <slug>.ts             # Monitor config for one agency — exports HttpMonitorConfig[]
  research/
    _shared/              # Shared notes: jina-usage.md, prompts.md, sample notes
    <slug>/               # One folder per agency, e.g. "iras"
      notes.md            # Jina research notes — URLs discovered and their purpose
      monitors.md         # Final list of up to 5 monitors (name, url, rationale)
      created-monitors.json  # Written by push-monitors — Kibana IDs and timestamps
  elastic/
    synthetics-api.ts     # createHttpMonitor / createAgencyMonitors helpers
    elastic-client.ts     # Elasticsearch client (for other queries if needed)
```

**Slug format:** lowercase, hyphen-separated agency name. Example: `iras`, `gobusiness`, `govsg`.

## HTTP monitor creation
- Use `createAgencyMonitors(monitors)` from `src/elastic/synthetics-api.ts`.
- Each `HttpMonitorConfig` has: `name`, `url`, `schedule` (minutes, default 5), `tags`, `locations`.
- Maximum 5 monitors per agency call (enforced by `createAgencyMonitors`).
- Auth: Kibana REST API — `Authorization: ApiKey <ELASTIC_API_KEY>` header.

## Workflow for new requests
When asked to create monitors for an agency:

1. **Clarify** (skip if already provided): agency name and primary site URL.
2. **Research**: fetch via Jina; identify homepage + e-services landing page + key service pages.
   Write findings to `src/research/<slug>/notes.md`.
3. **Select URLs**: choose up to 5 most important publicly accessible URLs.
   Write final list to `src/research/<slug>/monitors.md`.
4. **Create monitors**: call `createAgencyMonitors` with the selected URLs.
5. **Inform** the user of the created monitor IDs and any failures.

**Resumability:** If `src/research/<slug>/notes.md` already exists, skip step 2. If `src/research/<slug>/monitors.md` already exists, show the list and ask whether to add/replace.
