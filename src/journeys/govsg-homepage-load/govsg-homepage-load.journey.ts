import { expect } from '@elastic/synthetics';
import type { Page } from '@elastic/synthetics';
import { createJourney } from '../templates/base-journey';

createJourney('gov.sg — Homepage Load', 'https://www.gov.sg', 'citizen', async (page: Page) => {
  // Assert the .gov.sg identity banner — present on all Isomer gov.sg pages
  await expect(
    page.getByText('A Singapore Government Agency Website')
  ).toBeVisible();

  // Assert a stable nav link
  await expect(page.getByRole('link', { name: 'Explainers' })).toBeVisible();

  // Assert footer
  await expect(
    page.getByText('Government of Singapore')
  ).toBeVisible();
});
