# Elastic Synthetics HTTP Monitor Generator

Claude-assisted tool that researches an organisation's website and creates Kibana Synthetics HTTP monitors for its most important publicly accessible pages.

Works for any sector — public sector, financial services, healthcare, retail, or any customer/citizen-facing web service.

## What it does

Given an organisation name and URL, it:

1. **Researches** the site via Jina AI to identify key public-facing pages
2. **Selects up to 5 URLs** — homepage, self-service landing page, and major entry points
3. **Upserts HTTP monitors** into Kibana Synthetics — lightweight availability checks that ping those URLs on a schedule from your chosen location

Monitors are re-runnable: subsequent pushes update existing monitors rather than creating duplicates.

## Example

`src/agencies/ica.ts` — Immigration & Checkpoints Authority (Singapore) — is included as a reference implementation showing the expected shape of a monitor config file.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

```env
ELASTIC_KIBANA_URL=https://your-kibana-url        # Kibana / Observability project URL
ELASTIC_API_KEY=your-api-key                      # API key with Synthetics write privileges
ELASTIC_SYNTHETICS_LOCATION=us_east               # Elastic managed location ID (see note below)
JINA_API_KEY=your-jina-api-key                   # Jina Reader API key (for research)
```

> **Finding your location ID:** In Kibana, go to Observability > Synthetics > Settings > Locations, or call `GET /api/synthetics/private_locations`.
> Common managed location IDs: `us_east`, `us_west`, `eu_west`, `ap_southeast`.

## Usage

### Push monitors for an existing organisation

```bash
npm run push-monitors -- <slug>

# Example
npm run push-monitors -- ica
```

This creates or updates up to 5 HTTP monitors in Kibana. Results are saved locally to `src/research/<slug>/created-monitors.json` (gitignored — your Kibana IDs stay private).

### Add a new organisation

Ask Claude (via Claude Code) to create monitors:

> "Create monitors for Acme Bank — https://www.acmebank.com"

Claude will:
1. Research the site using Jina and write notes to `src/research/<slug>/notes.md`
2. Select up to 5 URLs and write the list to `src/research/<slug>/monitors.md`
3. Create the config at `src/agencies/<slug>.ts`
4. Push the monitors to Kibana

## Project structure

```
src/
  agencies/
    <slug>.ts               # Monitor config for one organisation — exports HttpMonitorConfig[]
  research/
    _shared/                # Shared notes: jina-usage.md, prompts.md
    <slug>/
      notes.md              # Jina research notes — URLs discovered and their purpose
      monitors.md           # Final list of up to 5 monitors (name, url, rationale)
      created-monitors.json # Written after push — Kibana IDs (gitignored)
  elastic/
    synthetics-api.ts       # createHttpMonitor / upsertAgencyMonitors helpers
    elastic-client.ts       # Elasticsearch client
  index.ts                  # CLI entry point (push-monitors)
```

## Monitor defaults

| Field | Default |
|-------|---------|
| Schedule | 60 minutes |
| Location | `ELASTIC_SYNTHETICS_LOCATION` env var |
| Type | HTTP (availability only) |
| Max per organisation | 5 |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run push-monitors -- <slug>` | Upsert monitors for an organisation |
| `npm run push` | Push Playwright journeys via `@elastic/synthetics` CLI |
| `npm test` | Run Playwright tests |
| `npm run build` | Compile TypeScript |

## Contributing

Clone the `template` branch as your starting point:

```bash
git clone --branch template <repo-url>
```

Add a new organisation config under `src/agencies/<slug>.ts` and open a PR back to `template`.
