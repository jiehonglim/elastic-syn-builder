# Project: Elastic Synthetics HTTP Monitor Generator

## Purpose
This repo builds tools that, given an organisation name and URL:
1. Research the website to identify its most important public-facing pages.
2. Select up to 5 key URLs (homepage, self-service landing page, major entry points).
3. Create HTTP monitors for those URLs via the Kibana Synthetics REST API.

No Playwright scripting is required — monitors are lightweight HTTP availability checks.

## Domain focus
- Target users are customers, citizens, or employees interacting with an organisation's web services.
- Focus on publicly accessible pages only. Never monitor login-gated or authenticated pages.
- Applicable to any sector: public sector, financial services, healthcare, retail, etc.

## Required environment variables
Set these in a `.env` file at the project root (never commit it):
```
ELASTIC_KIBANA_URL=              # Your Kibana/Observability project URL
ELASTIC_API_KEY=                 # Elasticsearch API key (also used for Kibana API auth)
ELASTIC_SYNTHETICS_LOCATION=     # Elastic managed location ID (e.g. us_east, eu_west)
JINA_API_KEY=                    # Jina Reader/Search API key
```

## Research tools
- Use Jina Reader/Search for structured content extraction:
  - Search: `https://s.jina.ai/?q=<query>`
  - Read:   `https://r.jina.ai/<url>`
  - Include header: `Authorization: Bearer $JINA_API_KEY`
- Goal: find the homepage, self-service landing page, and up to 3 high-traffic service pages.
- If Jina returns no useful content, note this in the research file and fall back to the site's own navigation structure.

## Folder structure (per organisation)
```
src/
  agencies/
    <slug>.ts             # Monitor config for one organisation — exports HttpMonitorConfig[]
  research/
    _shared/              # Shared notes: jina-usage.md, prompts.md, sample notes
    <slug>/               # One folder per organisation, e.g. "ica", "acme-bank"
      notes.md            # Jina research notes — URLs discovered and their purpose
      monitors.md         # Final list of up to 5 monitors (name, url, rationale)
      created-monitors.json  # Written by push-monitors — Kibana IDs and timestamps (gitignored)
  elastic/
    synthetics-api.ts     # createHttpMonitor / upsertAgencyMonitors helpers
    elastic-client.ts     # Elasticsearch client (for other queries if needed)
```

**Slug format:** lowercase, hyphen-separated name. Example: `ica`, `acme-bank`, `city-council`.

## HTTP monitor creation
- Use `upsertAgencyMonitors(monitors)` from `src/elastic/synthetics-api.ts`.
- Each `HttpMonitorConfig` has: `name`, `url`, `schedule` (minutes, default 60), `tags`, `locations`.
- Maximum 5 monitors per organisation call (enforced by `upsertAgencyMonitors`).
- Default location is read from `ELASTIC_SYNTHETICS_LOCATION` env var.
- Auth: Kibana REST API — `Authorization: ApiKey <ELASTIC_API_KEY>` header.

## Workflow for new requests
When asked to create monitors for an organisation:

1. **Clarify** (skip if already provided): organisation name and primary site URL.
2. **Research**: fetch via Jina; identify homepage + self-service landing page + key service pages.
   Write findings to `src/research/<slug>/notes.md`.
3. **Select URLs**: choose up to 5 most important publicly accessible URLs.
   Write final list to `src/research/<slug>/monitors.md`.
4. **Create config**: write `src/agencies/<slug>.ts` exporting an `HttpMonitorConfig[]`.
5. **Push monitors**: run `npm run push-monitors -- <slug>`.
6. **Inform** the user of the created monitor IDs and any failures.

**Resumability:** If `src/research/<slug>/notes.md` already exists, skip step 2. If `src/research/<slug>/monitors.md` already exists, show the list and ask whether to add/replace.
