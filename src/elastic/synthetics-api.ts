import * as dotenv from 'dotenv';

dotenv.config();

export interface HttpMonitorConfig {
  name: string;
  url: string;
  schedule?: number; // minutes, default 5
  tags?: string[];
  enabled?: boolean;
  locations?: string[]; // e.g. ['singapore']
}

interface KibanaLocation {
  id: string;
  isServiceManaged: boolean;
}

function buildBody(config: HttpMonitorConfig) {
  const schedule = config.schedule ?? 60;
  const defaultLocation = process.env.ELASTIC_SYNTHETICS_LOCATION ?? 'us_east';
  const locationIds = config.locations ?? [defaultLocation];
  const locations: KibanaLocation[] = locationIds.map(id => ({ id, isServiceManaged: true }));
  return {
    type: 'http',
    name: config.name,
    urls: config.url,
    schedule: { number: String(schedule), unit: 'm' },
    tags: config.tags ?? [],
    enabled: config.enabled ?? true,
    locations,
  };
}

async function kibanaFetch(method: string, path: string, body: unknown): Promise<{ id: string; name: string }> {
  const kibanaUrl = process.env.ELASTIC_KIBANA_URL;
  const apiKey = process.env.ELASTIC_API_KEY;

  if (!kibanaUrl || !apiKey) {
    throw new Error('ELASTIC_KIBANA_URL and ELASTIC_API_KEY must be set in .env');
  }

  const { default: fetch } = await import('node-fetch');
  const res = await fetch(`${kibanaUrl.replace(/\/$/, '')}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'kbn-xsrf': 'true',
      Authorization: `ApiKey ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Kibana API error ${res.status}: ${text}`);
  }

  return (await res.json()) as { id: string; name: string };
}

/** Fetches all monitors from Kibana and returns a name→id map for the given names. */
export async function fetchExistingMonitorIds(names: string[]): Promise<Record<string, string>> {
  const kibanaUrl = process.env.ELASTIC_KIBANA_URL;
  const apiKey = process.env.ELASTIC_API_KEY;
  if (!kibanaUrl || !apiKey) return {};

  const { default: fetch } = await import('node-fetch');
  const res = await fetch(`${kibanaUrl.replace(/\/$/, '')}/api/synthetics/monitors`, {
    headers: { Authorization: `ApiKey ${apiKey}`, 'kbn-xsrf': 'true' },
  });
  if (!res.ok) return {};

  const data = (await res.json()) as { monitors?: Array<{ id: string; name: string }> };
  const nameSet = new Set(names);
  const result: Record<string, string> = {};
  for (const m of data.monitors ?? []) {
    if (nameSet.has(m.name)) result[m.name] = m.id;
  }
  return result;
}

/** Creates a new HTTP monitor. */
export async function createHttpMonitor(config: HttpMonitorConfig): Promise<{ id: string; name: string }> {
  return kibanaFetch('POST', '/api/synthetics/monitors', buildBody(config));
}

/** Updates an existing HTTP monitor by ID. */
export async function updateHttpMonitor(id: string, config: HttpMonitorConfig): Promise<{ id: string; name: string }> {
  return kibanaFetch('PUT', `/api/synthetics/monitors/${id}`, buildBody(config));
}

/**
 * Upserts up to 5 HTTP monitors for an agency.
 * Pass existingIds (name -> id) to update instead of create where a monitor already exists.
 * Returns results (upserted or error) for each monitor.
 */
export async function upsertAgencyMonitors(
  monitors: HttpMonitorConfig[],
  existingIds: Record<string, string> = {}
): Promise<Array<{ name: string; url: string; id?: string; action: 'created' | 'updated'; error?: string }>> {
  const capped = monitors.slice(0, 5);

  const results = await Promise.allSettled(
    capped.map(m => {
      const existingId = existingIds[m.name];
      return existingId ? updateHttpMonitor(existingId, m) : createHttpMonitor(m);
    })
  );

  return capped.map((m, i) => {
    const result = results[i];
    const action = existingIds[m.name] ? 'updated' : 'created';
    if (result.status === 'fulfilled') {
      return { name: m.name, url: m.url, id: result.value.id, action };
    } else {
      return { name: m.name, url: m.url, action, error: (result.reason as Error).message };
    }
  });
}
