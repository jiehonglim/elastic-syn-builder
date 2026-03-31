import type { HttpMonitorConfig } from '../elastic/synthetics-api';

const tags = ['nea', 'public-sector'];
const locations = ['singapore'];

const monitors: HttpMonitorConfig[] = [
  { name: 'NEA — Homepage',               url: 'https://www.nea.gov.sg/',                         tags, locations },
  { name: 'NEA — E-Services',             url: 'https://www.nea.gov.sg/e-services',                tags, locations },
  { name: 'NEA — ePortal (Transactions)', url: 'https://www.eportal.nea.gov.sg/',                  tags, locations },
  { name: 'NEA — Weather',                url: 'https://www.nea.gov.sg/our-services/weather',       tags, locations },
  { name: 'NEA — Dengue & Zika',          url: 'https://www.nea.gov.sg/our-services/dengue-zika',  tags, locations },
];

export default monitors;
