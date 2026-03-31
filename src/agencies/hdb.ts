import type { HttpMonitorConfig } from '../elastic/synthetics-api';

const tags = ['hdb', 'public-sector'];
const locations = ['singapore'];

const monitors: HttpMonitorConfig[] = [
  { name: 'HDB — Homepage',       url: 'https://www.hdb.gov.sg/homepage',      tags, locations },
  { name: 'HDB — E-Services',     url: 'https://www.hdb.gov.sg/eservices',      tags, locations },
  { name: 'HDB — Buying a Flat',  url: 'https://www.hdb.gov.sg/buying-a-flat',  tags, locations },
  { name: 'HDB — Renting a Flat', url: 'https://www.hdb.gov.sg/renting-a-flat', tags, locations },
  { name: 'HDB — Parking',        url: 'https://www.hdb.gov.sg/parking',         tags, locations },
];

export default monitors;
