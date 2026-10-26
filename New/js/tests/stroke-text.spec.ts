import { test, expect } from '@playwright/test';

for (const reduced of [false, true]) test(`works stroke heading, reduced motion ${reduced}`, async ({ page }) => {
  await page.setViewportSize({ width: reduced ? 375 : 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
  await page.goto('/Portfolio-YoungSliker/New/#works');
  const title = page.locator('#works h2');
  await expect(title.getByRole('img', { name: 'IDEAS BECOME', exact: true })).toBeVisible();
  await expect(title.getByRole('img', { name: 'EXPERIENCES.', exact: true })).toBeVisible();
  await expect.poll(() => title.locator('[data-stroke-char]').first().evaluate(e => parseFloat(getComputedStyle(e).strokeDashoffset))).toBe(0);
  for (const svg of await title.locator('svg').all()) {
    const bounds = await svg.boundingBox();
    expect(bounds!.width).toBeGreaterThan(150);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  }
  const colors = await title.locator('.stroke-text').evaluateAll(es => es.map(e => getComputedStyle(e).color));
  expect(colors[0]).not.toBe(colors[1]);
  await title.screenshot({ path: `test-results/stroke-heading-${reduced}.png` });
});
