import { test, expect } from '@playwright/test';

const base = '/Portfolio-YoungSliker/New/';
const ids = ['hero', 'about', 'journey', 'works', 'contact'];

for (const width of [375, 430, 768, 1024, 1440, 1920]) {
  test(`five sections, readable navigation and images at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base);
    await expect(page.locator('main > section')).toHaveCount(5);
    for (const id of ids) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
    const about = page.getByRole('navigation').getByRole('link', { name: 'ABOUT' });
    await about.click();
    await expect(page).toHaveURL(/#about$/);
    await expect(about).toHaveAttribute('aria-current', 'location');
    await page.getByRole('navigation').getByRole('link', { name: 'WORKS' }).click();
    await expect(page.locator('#works h2')).toBeInViewport();
    await expect.poll(() => page.locator('#works img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.getByRole('link', { name: 'BACK TO TOP' }).click();
    await expect(page.locator('.scroll-cue')).toBeInViewport();
    await expect(page.locator('.site-header')).toBeHidden();
    expect(errors).toEqual([]);
    if (width === 375 || width === 1440) {
      await page.screenshot({ path: `docs/screenshots/current-foundation-${width}.png`, fullPage: true });
    }
  });
}

test('reduced motion, keyboard entry, history and landscape remain readable', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  await expect(page.locator('#hero')).toHaveAttribute('data-entrance','ready');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '跳到主要内容' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#about$/);
  await page.getByRole('navigation').getByRole('link', { name: 'CONTACT' }).click();
  await page.goBack();
  await expect(page).toHaveURL(/#about$/);
  await page.reload();
  await expect(page).toHaveURL(new RegExp('/New/$'));
  await expect(page.locator('#hero-title')).toBeInViewport();
  await page.locator('.scroll-cue').click();
  await expect(page.locator('#about h2')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('slashless preview URL redirects and large accent text has sufficient contrast', async ({ page, request }) => {
  const redirect = await request.get(base.slice(0, -1), { maxRedirects: 0 });
  expect.soft([301, 302, 307, 308]).toContain(redirect.status());
  expect.soft(new URL(redirect.headers().location, redirect.url()).pathname).toBe(base);
  await page.goto(base);
  const ratio = await page.locator('#about h2 .accent').evaluate(element => {
    const luminance = (color: string) => {
      const channels = color.match(/\d+/g)!.slice(0, 3).map(Number).map(n => {
        const value = n / 255;
        return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
      });
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    };
    const text = luminance(getComputedStyle(element).color);
    const paper = luminance(getComputedStyle(element.closest('#about')!).backgroundColor);
    return (Math.max(text, paper) + .05) / (Math.min(text, paper) + .05);
  });
  expect(ratio).toBeGreaterThanOrEqual(3);
});

test('production subpath serves old entry and Chinese media without copying them', async ({ page, request }) => {
  await page.goto(base);
  const link = page.getByRole('link', { name: '浏览旧版作品集' });
  await expect(link).toHaveAttribute('href', '/Portfolio-YoungSliker/index.html');
  const old = await request.get((await link.getAttribute('href'))!);
  expect(old.status()).toBe(200);
  expect(await old.text()).toContain('project-detail');
  const image = await request.get('/Portfolio-YoungSliker/AIGC/%E7%BB%A5%E8%BF%9C%E6%96%B9%E5%BF%97.jpg');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toBe('image/jpeg');
  expect((await request.get('/Portfolio-YoungSliker/.git/config')).status()).toBe(404);
  expect((await request.get(`${base}missing.js`)).status()).toBe(404);
});

