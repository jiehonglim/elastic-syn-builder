# Research notes: gov.sg — Homepage Load

## Source
- Jina Reader: https://r.jina.ai/https://www.gov.sg
- Fetched: 2026-03-30

## Page title
`Home | gov.sg`

## Key assertable elements
- H1 / hero heading: `"Budget 2026"` (current campaign — may rotate)
- Static nav links: `Explainers`, `Features`, `Resources`, `Budget`, `National Day Rally`
- Footer: `"Government of Singapore"` (stable, year-independent text exists in copyright line)
- Banner text: `"A Singapore Government Agency Website"` — present on all .gov.sg Isomer sites, reliable assertion

## Notes
- Site is built on Isomer (Singapore OGP static site platform) — very fast load, no JS-heavy rendering.
- No login required. Safe to navigate and assert.
- Hero banner content rotates (currently Budget 2026) — avoid asserting on it for a stable smoke test.
- The "A Singapore Government Agency Website" banner text is present on every .gov.sg Isomer page — best stable assertion target.
