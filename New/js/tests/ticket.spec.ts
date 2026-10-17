import { test, expect } from '@playwright/test';
import { enterArchive } from './hero-helpers';
const base = '/Portfolio-YoungSliker/New/';
test('only random image moves while its frame and QR stay fixed', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base);
  await enterArchive(page);
  const random = page.locator('.artwork-ticket[data-parallax="true"]');
  const picture = random.locator('.tear-ticket__image');
  await page.mouse.move(20,100);
  await page.waitForTimeout(700);
  const before = await picture.evaluate(el => getComputedStyle(el).transform);
  const frame = await random.locator('.tear-ticket__art').boundingBox();
  const qr = await random.locator('.artwork-ticket__qr').boundingBox();
  await page.mouse.move(1400,850);
  await expect.poll(() => picture.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
  await page.waitForTimeout(700);
  expect(await random.locator('.tear-ticket__art').boundingBox()).toEqual(frame);
  expect(await random.locator('.artwork-ticket__qr').boundingBox()).toEqual(qr);
  for (const image of await page.locator('.artwork-ticket[data-parallax="false"] .tear-ticket__image').all()) {
    const offset = await image.evaluate(el => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return [matrix.m41, matrix.m42];
    });
    expect(offset).toEqual([0,0]);
  }
});
for (const viewport of [{width:1440,height:900}, {width:375,height:667}]) {
  test('ticket appearance and keyboard tear at ' + viewport.width, async ({page}) => {
    await page.setViewportSize(viewport);
    await page.goto(base);
    await enterArchive(page);
    const tickets = page.locator('.tear-ticket');
    await expect(tickets).toHaveCount(4);
    await expect(page.locator('.tear-ticket__scrim')).toHaveCount(0);
    await expect(page.locator('.artwork-ticket__restore')).toHaveCount(0);
    await expect(page.locator('.artwork-ticket__stub')).toHaveCount(4);
    for (let i=0;i<4;i++) {
      const ticket=tickets.nth(i);
      await expect(ticket).toHaveAttribute('data-orientation','vertical');
      await expect(page.locator('.artwork-ticket').nth(i)).toHaveAttribute('data-layout', i === 1 ? 'portrait' : 'landscape');
      await expect(ticket).toHaveCSS('color','rgb(217, 74, 28)');
      await expect(ticket.locator('.artwork-ticket__name')).toHaveCSS('color','rgb(23, 23, 23)');
      await expect(ticket.locator('strong')).toHaveCSS('color','rgb(23, 23, 23)');
      await expect(ticket.locator('.tear-ticket__image')).toBeVisible();
      await expect(ticket.locator('.artwork-ticket__qr')).toBeVisible();
      const qrSize = await ticket.locator('.artwork-ticket__qr').evaluate(el => ({w: el.clientWidth, h: el.clientHeight}));
      expect(qrSize.w).toBe(qrSize.h);
      await expect(ticket.locator('.tear-ticket__art')).toHaveCSS('border-radius','0px');
      await expect.poll(() => ticket.locator('.tear-ticket__image').evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      const box=await ticket.boundingBox(); expect(box!.width).toBeGreaterThan(45);
    }
    await page.screenshot({path:'docs/screenshots/tear-ticket-'+viewport.width+'.png'});
    for (const i of [0,1]) {
      const ticket=tickets.nth(i);
      await ticket.getByRole('button').focus();
      await page.keyboard.press('Enter');
      await expect(ticket).toHaveAttribute('data-used','');
      await expect(page.locator('#hero')).toHaveAttribute('data-scene','archive');
      await expect(page.locator('.artwork-ticket__restore')).toHaveCount(0);
    }
  });
}
test('horizontal and vertical stubs tear with pointer drag', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base);
  await enterArchive(page);
  for (const i of [0,1]) {
    const ticket=page.locator('.tear-ticket').nth(i);
    const stub=ticket.locator('.artwork-ticket__stub');
    await stub.hover();
    const box=(await stub.boundingBox())!;
    const x=box.x+box.width*.35, y=box.y+box.height*.3;
    await page.mouse.move(x,y); await page.mouse.down();
    for(let step=1;step<=25;step++) {
      await page.mouse.move(x+(i===0?step*12:0),y+(i===1?step*12:0));
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await expect(ticket).toHaveAttribute('data-used','',{timeout:4000});
    await expect(page.locator('.artwork-ticket__restore')).toHaveCount(0);
  }
});
