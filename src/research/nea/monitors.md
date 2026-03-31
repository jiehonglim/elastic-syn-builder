# Monitors for National Environment Agency (NEA)

| # | Name | URL | Rationale |
|---|------|-----|-----------|
| 1 | NEA — Homepage | https://www.nea.gov.sg/ | Entry point; also surfaces live PSI, weather, and dengue data widgets |
| 2 | NEA — E-Services | https://www.nea.gov.sg/e-services | Top-nav e-services index for all service categories |
| 3 | NEA — ePortal (Transactions) | https://www.eportal.nea.gov.sg/ | Separate subdomain where all actual transactions are processed |
| 4 | NEA — Weather | https://www.nea.gov.sg/our-services/weather | High daily-use public service; weather forecasts used by all residents |
| 5 | NEA — Dengue & Zika | https://www.nea.gov.sg/our-services/dengue-zika | Public health critical; tracks active dengue clusters |

## Notes
- Monitor #3 (ePortal) is on a different subdomain to the main site — important to monitor independently.
- If monitor #1 (Homepage) fails but #2/#3 are up, the data feed widgets may be the culprit, not the CMS.
