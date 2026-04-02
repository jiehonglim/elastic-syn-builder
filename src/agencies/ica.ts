import type { HttpMonitorConfig } from '../elastic/synthetics-api';

const tags = ['ica'];
const locations = [process.env.ELASTIC_SYNTHETICS_LOCATION ?? 'us_east'];

const monitors: HttpMonitorConfig[] = [
  { name: 'ICA — Main Homepage',                  url: 'https://www.ica.gov.sg/',                               tags, locations },
  { name: 'ICA — E-Services and Forms',      url: 'https://www.ica.gov.sg/eservicesandforms',              tags, locations },
  { name: 'ICA — Documents (IC & Passport)', url: 'https://www.ica.gov.sg/documents',                      tags, locations },
  { name: 'ICA — Enter, Transit and Depart', url: 'https://www.ica.gov.sg/enter-transit-depart',           tags, locations },
  { name: 'ICA — Check Status / Make Appt',  url: 'https://www.ica.gov.sg/check-status-make-appointment',  tags, locations },
];

export default monitors;
