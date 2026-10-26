import { test, expect } from '@playwright/test';

for (const width of [375, 1440]) test(`contact tech text renders and pauses offscreen at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/Portfolio-YoungSliker/New/');
  await expect(page.locator('#contact canvas')).toHaveCount(0);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  const title = page.getByRole('heading', { name: 'STAY CURIOUS. KEEP CREATING.' });
  await expect(title.locator('canvas')).toHaveCount(2);
  const canvas = title.locator('canvas').first();
  await expect.poll(() => canvas.evaluate((c: HTMLCanvasElement) => c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data.some((v, i) => i % 4 === 3 && v > 0))).toBe(true);
  await page.waitForTimeout(2600);
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width * .2, box.y + box.height * .5);
  await page.mouse.down();await page.mouse.move(box.x + box.width * .2 + 15, box.y + box.height * .5 - 15);await page.mouse.up();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await title.screenshot({ path: `test-results/tech-title-${width}.png` });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(250);
  const paused = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.waitForTimeout(250);
  expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL())).toBe(paused);
  expect(errors).toEqual([]);
});

test('reduced motion retains readable title without canvas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/Portfolio-YoungSliker/New/#contact');
  await expect(page.getByRole('heading', { name: 'STAY CURIOUS. KEEP CREATING.' })).toBeVisible();
  await expect(page.locator('#contact canvas')).toHaveCount(0);
  await expect(page.locator('.contact-tech-fallback')).toHaveCount(2);
});
