import { test, expect, type Page } from '@playwright/test';
const base = '/Portfolio-YoungSliker/New/';
async function progress(page: Page, value: number) {
  await page.locator('#hero').evaluate((el, p) => window.scrollTo({top:(el as HTMLElement).offsetTop + (el.clientHeight - innerHeight) * p, behavior:'instant'}), value);
  await expect.poll(async () => Math.abs(Number(await page.locator('#hero').getAttribute('data-progress')) - value)).toBeLessThan(.001);
  await page.waitForTimeout(100);
}
for (const width of [1440,375,844]) {
  test('ASCII roll, portal and archive at ' + width, async ({page}) => {
    await page.setViewportSize({width,height:width === 844 ? 390 : width === 375 ? 812 : 900});
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base);
    await expect(page.locator('.ascii-canvas')).toHaveAttribute('data-ready','true');
    await expect(page.locator('.site-header')).toBeHidden();
    await expect(page.locator('.hero-landing')).toHaveAttribute('inert','');
    await expect(page.locator('.ascii-scroll')).toBeInViewport();
    await page.screenshot({path:`docs/screenshots/ascii-opening-${width}.png`});
    await progress(page,.12);
    await page.screenshot({path:`docs/screenshots/ascii-roll-${width}.png`});
    await progress(page,.35);
    await page.screenshot({path:`docs/screenshots/ascii-zoom-${width}.png`});
    await progress(page,.58);
    const geometry = await page.locator('#hero').evaluate(el => {
      const ring = el.querySelector<HTMLElement>('.hero-orbit')!;
      const landing = el.querySelector<HTMLElement>('.hero-landing')!;
      return { diameter:ring.offsetWidth, clip:landing.style.clipPath };
    });
    expect(Math.abs(parseFloat(geometry.clip.replace('circle(','')) - geometry.diameter/2)).toBeLessThan(1);
    await page.screenshot({path:`docs/screenshots/ascii-portal-${width}.png`});
    await progress(page,.86);
    await expect(page.locator('.hero-landing')).not.toHaveAttribute('inert','');
    await expect(page.locator('.hero-title-group')).toHaveCSS('opacity','1');
    await expect(page.locator('.hero-card').first()).toHaveCSS('opacity','1');
    await expect(page.locator('.site-header')).toBeHidden();
    await page.screenshot({path:`docs/screenshots/ascii-archive-${width}.png`});
    await page.locator('.scroll-cue').click();
    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.locator('#about h2')).toBeInViewport();
    await expect(page.locator('.reading-footer')).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
    await progress(page,0);
    await expect(page.locator('.ascii-scroll')).toHaveCSS('opacity','1');
    await expect(page.locator('.site-header')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
test('reduced motion skips the long scene and keyboard reaches About', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base);
  await expect(page.locator('.ascii-opening')).toBeHidden();
  await expect(page.locator('.hero-landing')).toHaveCSS('clip-path','none');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'跳到主要内容'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.site-header')).toBeVisible();
});
