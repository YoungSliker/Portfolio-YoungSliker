import { test, expect } from '@playwright/test';
const base = '/Portfolio-YoungSliker/New/';

for (const viewport of [{width:1440,height:900},{width:375,height:667},{width:844,height:390}]) {
  test(`opening cue and artwork are visible before scrolling at ${viewport.width}`, async ({page}) => {
    await page.setViewportSize(viewport);
    await page.goto(base);
    const cue = page.getByRole('link',{name:'向下滚动，进入创作档案'});
    await expect(cue).toBeVisible();
    const bounds = await cue.boundingBox();
    expect(bounds!.y).toBeGreaterThan(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
    await expect(page.locator('.hero-card:visible').first()).toBeInViewport();
    await expect.poll(() => page.locator('.hero-card:visible img').evaluateAll(imgs => imgs.every(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({path:`docs/screenshots/phase-2-opening-${viewport.width}.png`});
    await cue.click();
    await expect(page.locator('#about h2')).toBeInViewport();
  });
}

test('scroll changes the composition and reversing restores the cue', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base);
  const cue = page.locator('.scroll-cue');
  await expect(cue).toBeVisible();
  const first = await page.locator('.hero-card').first().boundingBox();
  await page.mouse.move(700,450);
  await page.mouse.wheel(0,400);
  await expect.poll(() => cue.evaluate(e => Number(getComputedStyle(e).opacity))).toBeLessThan(.1);
  const after = await page.locator('.hero-card').first().boundingBox();
  expect(Math.abs(after!.x-first!.x)+Math.abs(after!.y-first!.y)).toBeGreaterThan(30);
  await expect(page.locator('.hero-bridge')).toBeVisible();
  await page.screenshot({path:'docs/screenshots/phase-2-transition-1440.png'});
  await page.mouse.wheel(0,-1200);
  await expect.poll(() => cue.evaluate(e => Number(getComputedStyle(e).opacity))).toBeGreaterThan(.95);
  await page.mouse.wheel(0,1600);
  await expect(page.locator('#about')).toBeInViewport();
});

test('reduced motion keeps content and the cue without a long pinned scene', async ({page}) => {
  await page.setViewportSize({width:375,height:667});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base);
  await expect(page.locator('.scroll-cue')).toBeVisible();
  const hero = await page.locator('#hero').boundingBox();
  expect(hero!.height).toBeLessThanOrEqual(667);
  expect(await page.locator('.cue-comet').evaluate(e => getComputedStyle(e).animationName)).toBe('none');
  await page.getByRole('link',{name:'向下滚动，进入创作档案'}).click();
  await expect(page.locator('#about h2')).toBeInViewport();
});

for (const width of [375, 1440]) {
  test(`reading footer persists throughout the page at ${width}`, async ({page}) => {
    await page.setViewportSize({width, height:900});
    await page.goto(base);
    await expect(page.locator('.cue-arrow')).toHaveCount(0);
    const footer = page.locator('.reading-footer');
    for (const [index, id] of ['hero','about','journey','works','showcase','contact'].entries()) {
      await page.locator(`#${id}`).evaluate(e => e.scrollIntoView({behavior:'instant'}));
      await expect(footer).toBeInViewport();
      await expect(footer).toContainText(`${String(index+1).padStart(2,'0')} / 06`);
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    await page.screenshot({path:`docs/screenshots/persistent-footer-${width}.png`});
    // Exercise the future secondary-view contract with a real native modal.
    await page.evaluate(() => { const d=document.createElement('dialog'); d.id='test-detail'; d.textContent='作品详情'; document.body.append(d); d.showModal(); });
    await expect(footer).toBeHidden();
    await page.evaluate(() => document.getElementById('test-detail')!.remove());
    await expect(footer).toBeVisible();
  });
}

test('three fixed Top1 covers and a stable random fourth cover', async ({page}) => {
  const chosen = [];
  for (const seed of [0, .999]) {
    await page.addInitScript(value => { Math.random = () => value; }, seed);
    await page.goto(base);
    const cards = page.locator('.hero-card');
    await expect(cards).toHaveCount(4);
    for (const title of ['绥远方志','矿山*生态','微元灵溯']) await expect(cards.filter({hasText:title})).toHaveCount(1);
    const randomTitle = (await cards.nth(1).locator('.artwork-ticket__caption h2').textContent())!;
    chosen.push(randomTitle);
    const urls = await cards.locator('.tear-ticket__image').evaluateAll(imgs => imgs.map(img => (img as HTMLImageElement).src));
    expect(urls.every(url => url.includes('/New/assets/'))).toBe(true);
    await page.locator('#works').evaluate(e => e.scrollIntoView());
    await expect(cards.nth(1).locator('.artwork-ticket__caption h2')).toHaveText(randomTitle);
  }
  expect(chosen[0]).not.toBe(chosen[1]);
});
