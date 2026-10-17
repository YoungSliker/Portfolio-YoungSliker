import { test, expect } from '@playwright/test';
const base = '/Portfolio-YoungSliker/New/';
for (const viewport of [{width:1440,height:900}, {width:375,height:667}]) {
  test('ticket appearance and keyboard tear at ' + viewport.width, async ({page}) => {
    await page.setViewportSize(viewport);
    await page.goto(base);
    const tickets = page.locator('.tear-ticket');
    await expect(tickets).toHaveCount(4);
    await expect(page.locator('.tear-ticket__scrim')).toHaveCount(0);
    await expect(page.locator('.artwork-ticket__restore')).toHaveCount(0);
    await expect(page.locator('.artwork-ticket__stub')).toHaveCount(4);
    for (let i=0;i<4;i++) {
      const ticket=tickets.nth(i);
      await expect(ticket).toHaveAttribute('data-orientation',i===1?'vertical':'horizontal');
      await expect(ticket).toHaveCSS('color','rgb(217, 74, 28)');
      await expect(ticket.locator('.tear-ticket__image')).toBeVisible();
      await expect(ticket.locator('.artwork-ticket__qr')).toBeVisible();
      await expect.poll(() => ticket.locator('.tear-ticket__image').evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      const box=await ticket.boundingBox(); expect(box!.width).toBeGreaterThan(70);
    }
    await page.screenshot({path:'docs/screenshots/tear-ticket-'+viewport.width+'.png'});
    for (const i of [0,1]) {
      const ticket=tickets.nth(i);
      await ticket.getByRole('button').focus();
      await page.keyboard.press('Enter');
      await expect(ticket).toHaveAttribute('data-used','');
      await expect(page.locator('.artwork-ticket__restore')).toHaveCount(0);
    }
  });
}
test('horizontal and vertical stubs tear with pointer drag', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base);
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
