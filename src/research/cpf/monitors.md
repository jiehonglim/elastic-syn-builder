# Monitors for Central Provident Fund Board (CPF)

| # | Name | URL | Rationale |
|---|------|-----|-----------|
| 1 | CPF — Member Portal | https://www.cpf.gov.sg/member | Primary entry for all CPF members (= homepage redirect target) |
| 2 | CPF — Employer Portal | https://www.cpf.gov.sg/employer | Entry point for employers submitting contributions |
| 3 | CPF — Calculators | https://www.cpf.gov.sg/member/tools-and-services/calculators | Heavily used public tool — retirement, housing, MediSave calculators, no login |
| 4 | CPF — Forms & E-Applications | https://www.cpf.gov.sg/member/tools-and-services/forms-e-applications | Forms index used before and after Singpass login |
| 5 | CPF — FAQs | https://www.cpf.gov.sg/service/faq | Shared FAQ covering both member and employer queries |

## Notes
- All CPF transactional services (balance checks, top-ups, contribution submissions) are
  behind Singpass authentication and cannot be covered by HTTP monitors.
- If these monitors are up but citizens report service issues, the fault is likely in the
  Singpass/MyInfo integration layer, not the CPF web infrastructure itself.
