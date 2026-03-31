import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { upsertAgencyMonitors, fetchExistingMonitorIds } from './elastic/synthetics-api';

dotenv.config();

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: npm run push-monitors -- <slug>');
    console.error('Example: npm run push-monitors -- hdb');
    process.exit(1);
  }

  // Load agency monitor config
  const agencyFile = path.join(__dirname, 'agencies', slug);
  let monitors;
  try {
    ({ default: monitors } = await import(agencyFile));
  } catch {
    console.error(`No agency file found for slug "${slug}". Expected: src/agencies/${slug}.ts`);
    process.exit(1);
  }

  // Load existing Kibana IDs if a previous run was saved
  const researchDir = path.join(__dirname, '..', 'src', 'research', slug);
  const createdFile = path.join(researchDir, 'created-monitors.json');
  const existingIds: Record<string, string> = {};

  if (fs.existsSync(createdFile)) {
    const saved = JSON.parse(fs.readFileSync(createdFile, 'utf-8'));
    for (const m of saved.monitors ?? []) {
      if (m.name && m.id) existingIds[m.name] = m.id;
    }
  }

  // If no saved IDs, check Kibana directly (handles first-run failures or missing JSON)
  const missingNames = monitors.map((m: { name: string }) => m.name).filter((n: string) => !existingIds[n]);
  if (missingNames.length > 0) {
    const fromKibana = await fetchExistingMonitorIds(missingNames);
    Object.assign(existingIds, fromKibana);
  }

  const count = Object.keys(existingIds).length;
  if (count > 0) console.log(`Found ${count} existing monitor ID(s) in Kibana — will update instead of create.`);

  console.log(`Upserting ${monitors.length} HTTP monitor(s) for [${slug}]...`);
  const results = await upsertAgencyMonitors(monitors, existingIds);

  let anyFailed = false;
  for (const r of results) {
    if (r.error) {
      console.error(`  FAILED   ${r.name}: ${r.error}`);
      anyFailed = true;
    } else {
      console.log(`  ${r.action.toUpperCase().padEnd(7)}  ${r.name} — id: ${r.id}`);
    }
  }

  // Persist results
  if (fs.existsSync(researchDir)) {
    const record = {
      slug,
      updatedAt: new Date().toISOString(),
      monitors: results.map(r => ({ name: r.name, url: r.url, id: r.id ?? null, error: r.error ?? null })),
    };
    fs.writeFileSync(createdFile, JSON.stringify(record, null, 2));
    console.log(`\nResults saved to src/research/${slug}/created-monitors.json`);
  }

  process.exit(anyFailed ? 1 : 0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
