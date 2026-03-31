import { journey, step, expect } from '@elastic/synthetics';
import type { Page } from '@elastic/synthetics';

/**
 * Base helper to navigate to a site and validate the landing page.
 */
export async function openHome(page: Page, url: string, expectedTitle?: string) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') {
    throw new Error(`Only https: URLs are allowed, got: ${parsed.protocol}`);
  }

  await page.goto(url, { waitUntil: 'load' });
  if (expectedTitle) {
    await expect(page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }
}

/**
 * Scaffold to be reused for citizen/business journeys.
 */
export function createJourney(
  name: string,
  url: string,
  journeyType: 'citizen' | 'business',
  stepsImpl: (page: Page) => Promise<void>
) {
  journey(`${name} (${journeyType})`, ({ page }) => {
    step('Open home', async () => {
      await openHome(page, url);
    });

    step('Execute journey steps', async () => {
      await stepsImpl(page);
    });
  });
}
