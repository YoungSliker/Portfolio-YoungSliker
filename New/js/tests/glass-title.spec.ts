import { test, expect } from '@playwright/test';
import { enterArchive } from './hero-helpers';
for (const width of [1440, 375]) {
  test(`Chinese glass title renders at ${width}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/Portfolio-YoungSliker/New/');
    await enterArchive(page);
    await expect(page.locator('#hero-title')).toHaveAccessibleName('设计作品集');
    await expect(page.locator('.fluid-glass')).toHaveAttribute('data-rendered', 'true', { timeout: 20000 });
    await expect(page.locator('.fluid-glass')).toHaveAttribute('data-glass-ready', 'true', { timeout: 20000 });
    const box = await page.locator('.hero-glass-title').boundingBox();
    await page.mouse.move(box!.x + box!.width * .6, box!.y + box!.height * .5);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `docs/screenshots/glass-title-${width}.png` });
    expect(errors).toEqual([]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.fluid-glass')).toHaveCount(0);
    await expect(page.locator('#hero-title')).toHaveCSS('opacity', '1');
  });
}

