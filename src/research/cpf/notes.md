# CPF Research Notes

Source: Jina Reader (https://r.jina.ai/https://www.cpf.gov.sg)
Date: 2026-03-31

## Observations & Learnings

### Different from HDB, ICA, and NEA
1. **Almost all transactional services are behind Singpass login** — The Jina search for
   "e-services digital services site:cpf.gov.sg" returned Singpass login pages (`/member/ds/`
   and `/employer/login`). This means HTTP monitors cannot cover the actual CPF transactions
   (check balance, make top-ups, submit contributions). These all require Singpass authentication.

2. **Two distinct portals on one domain** — CPF splits its audience at the top level:
   - `/member` — for CPF members (citizens, PRs)
   - `/employer` — for employers and businesses
   Both share the same domain but are independently deployable areas.

3. **Rich public tools do exist** — Despite the auth wall, CPF exposes public calculators,
   forms, FAQs, and informational content that are valuable to monitor. The calculators
   in particular are widely used before citizens log in.

4. **Homepage redirects to /member** — `https://www.cpf.gov.sg/` forwards to the member portal,
   so monitoring `/member` is equivalent to the homepage.

5. **Scheduled maintenance notice on homepage** — The page included a banner about a maintenance
   window (8 Mar 2026, 12am–8am). This suggests CPF has planned downtime; monitoring would
   catch unplanned outages beyond the scheduled windows.

## Key URLs discovered

| URL | Purpose |
|-----|---------|
| https://www.cpf.gov.sg/member | Member portal home (= homepage) |
| https://www.cpf.gov.sg/employer | Employer/Business portal home |
| https://www.cpf.gov.sg/member/tools-and-services/calculators | Public CPF calculators (retirement, housing, MediSave) — no login needed |
| https://www.cpf.gov.sg/member/tools-and-services/forms-e-applications | Forms & e-applications index |
| https://www.cpf.gov.sg/service/faq | Shared FAQ (covers both member and employer) |
| https://www.cpf.gov.sg/member/ds/ | Singpass login entry — AUTHENTICATED, do not monitor |
| https://www.cpf.gov.sg/employer/login | Employer Singpass login — AUTHENTICATED, do not monitor |

## Selected for monitoring (top 5 — public pages only)
1. Member portal home — `/member`
2. Employer portal home — `/employer`
3. CPF Calculators — `/member/tools-and-services/calculators`
4. Forms & E-Applications — `/member/tools-and-services/forms-e-applications`
5. FAQs — `/service/faq`
