import { expect, type Page } from '@playwright/test';
export async function enterArchive(page: Page) {
  await page.locator('#hero').evaluate(el => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.scrollTo({top:(el as HTMLElement).offsetTop + (el.clientHeight - innerHeight) * .86, behavior:'instant'});
  });
  await expect(page.locator('.hero-title-group')).toHaveCSS('opacity','1');
  await expect(page.locator('.hero-landing')).not.toHaveAttribute('inert','');
}
