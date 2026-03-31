# Journeys

This directory contains Playwright-based journeys compatible with Elastic Synthetics.

- Use `templates/base-journey.ts` as the starting point for new journeys.
- Journeys should be named by agency and goal, e.g.:
  - `iras-check-tax-balance.citizen.ts`
  - `gobusiness-apply-licence.business.ts`

Running `npm run test` executes the journeys locally.
Running `npm run push` pushes project monitors to your Kibana URL using the Synthetics CLI.
