# NEA Research Notes

Source: Jina Reader (https://r.jina.ai/https://www.nea.gov.sg)
Date: 2026-03-31

## Observations & Learnings

### Different from HDB and ICA
1. **Live environmental data widgets on the homepage** — PSI air quality, 24-hr weather forecast,
   and dengue case count are rendered directly on the homepage with live data. If the underlying
   data feeds fail, citizens would see stale or missing public health information.

2. **E-services on a separate subdomain** — All transactional services live at `https://www.eportal.nea.gov.sg/`,
   not on the main `nea.gov.sg` domain. This means monitoring the main site alone is insufficient
   to cover service availability.

3. **Jina search returned a wrong page** — The Jina search for "e-services digital services site:nea.gov.sg"
   returned an after-death sub-section page (`/our-services/after-death/post-death-matters/e-services`)
   rather than the main e-services index. The correct top-level URL is `/e-services` (top nav link).
   This is a Jina search limitation when a keyword is too common within the site.

4. **Services are domain-specific, not persona-based** — Unlike ICA (citizen/PR/visitor personas),
   NEA organises by service domain: Weather, Dengue/Zika, Waste Management, Hawker Management,
   Pollution Control, Radiation Safety, etc.

## Key URLs discovered

| URL | Purpose |
|-----|---------|
| https://www.nea.gov.sg/ | Homepage — includes live PSI, weather, dengue widgets |
| https://www.nea.gov.sg/e-services | Top-nav e-services index |
| https://www.eportal.nea.gov.sg/ | Actual transactional e-portal (separate subdomain) |
| https://www.nea.gov.sg/our-services/weather | Weather info — high daily use |
| https://www.nea.gov.sg/our-services/dengue-zika | Dengue & Zika — public health critical |
| https://www.nea.gov.sg/our-services/waste-management | Waste management & 3R programmes |
| https://www.nea.gov.sg/our-services/hawker-management | Hawker licensing and management |
| https://www.nea.gov.sg/our-services/pollution-control | Pollution control applications |

## Selected for monitoring (top 5)
1. Homepage (with live data widgets) — `/`
2. E-Services index — `/e-services`
3. ePortal (transactional services subdomain) — `https://www.eportal.nea.gov.sg/`
4. Weather — `/our-services/weather`
5. Dengue & Zika — `/our-services/dengue-zika`
