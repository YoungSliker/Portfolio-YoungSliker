import { test, expect } from '@playwright/test';

for (const width of [375, 1440]) {
  test(`background grain stays behind content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/Portfolio-YoungSliker/New/#contact');
    const contact = page.locator('#contact');
    await contact.scrollIntoViewIfNeeded();
    for (const selector of ['.hero-landing', '#about', '.about-portal', '.flowing-menu', '.site-header', '#journey', '#works', '#contact', '.contact-methods a']) {
      await expect(page.locator(selector).first()).toHaveCSS('background-image', /background-grain.*png/);
    }
    const loaded = await contact.evaluate(async element => {
      const url = getComputedStyle(element).backgroundImage.slice(5, -2);
      const image = new Image();
      image.src = url;
      await image.decode();
      return image.width;
    });
    expect(loaded).toBe(256);
    await expect(page.getByRole('link', { name: '发送邮件至 zyg203320@163.com' })).toBeVisible();
    await page.getByRole('button', { name: /浏览体验 · 多设备演示/ }).click();
    await expect(page.locator('#contact-experience')).toBeVisible();
    await page.getByRole('button', { name: /浏览体验 · 多设备演示/ }).click();
    await contact.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/background-grain-${width}.png` });
    await page.locator('#hero').scrollIntoViewIfNeeded();
    await expect(page.locator('.artwork-ticket')).toHaveCount(4);
    for (const ticket of await page.locator('.artwork-ticket').all()) {
      const patina = await ticket.locator('.tear-ticket__paper').first().evaluate(el => {
        const style = getComputedStyle(el, '::after');
        return { texture: style.backgroundImage, events: style.pointerEvents };
      });
      expect(patina.texture).toContain('background-grain');
      expect(patina.events).toBe('none');
    }
    await page.screenshot({ path: `test-results/aged-tickets-${width}.png` });
  });
}
