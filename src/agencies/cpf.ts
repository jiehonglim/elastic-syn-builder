import type { HttpMonitorConfig } from '../elastic/synthetics-api';

const tags = ['cpf', 'public-sector'];
const locations = ['singapore'];

const monitors: HttpMonitorConfig[] = [
  { name: 'CPF — Member Portal',        url: 'https://www.cpf.gov.sg/member',                                        tags, locations },
  { name: 'CPF — Employer Portal',      url: 'https://www.cpf.gov.sg/employer',                                      tags, locations },
  { name: 'CPF — Calculators',          url: 'https://www.cpf.gov.sg/member/tools-and-services/calculators',          tags, locations },
  { name: 'CPF — Forms & E-Apps',       url: 'https://www.cpf.gov.sg/member/tools-and-services/forms-e-applications', tags, locations },
  { name: 'CPF — FAQs',                 url: 'https://www.cpf.gov.sg/service/faq',                                    tags, locations },
];

export default monitors;
