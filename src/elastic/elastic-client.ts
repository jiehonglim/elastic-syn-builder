import { Client } from '@elastic/elasticsearch';
import * as dotenv from 'dotenv';

dotenv.config();

let _client: Client | null = null;

export function getElasticClient(): Client {
  if (_client) return _client;

  const url = process.env.ELASTIC_KIBANA_URL;
  const apiKey = process.env.ELASTIC_API_KEY;

  if (!url || !apiKey) {
    throw new Error('ELASTIC_KIBANA_URL and ELASTIC_API_KEY must be set in .env');
  }

  _client = new Client({ node: url, auth: { apiKey } });
  return _client;
}
