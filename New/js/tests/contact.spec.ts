import { test, expect } from '@playwright/test';

for (const width of [375, 1440]) test(`contact actions and copy feedback at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (value: string) => { (window as any).copiedContact = value; },
    } });
  });
  await page.goto('/Portfolio-YoungSliker/New/#contact');
  const contact = page.locator('#contact');
  await expect(contact.getByRole('link', { name: /发送邮件/ })).toHaveAttribute('href', 'mailto:zyg203320@163.com');
  await expect(contact.getByRole('link', { name: /拨打电话/ })).toHaveAttribute('href', 'tel:+8615248120655');
  await expect(contact.getByRole('link', { name: /打开 QQ/ })).toHaveAttribute('href', /uin=3187134482/);
  await contact.getByRole('button', { name: /复制微信号/ }).click();
  expect(await page.evaluate(() => (window as any).copiedContact)).toBe('YoungSlikera');
  await expect(contact.getByRole('status')).toContainText('微信号已复制');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('Denied')) } }));
  await contact.getByRole('button', { name: /复制微信号/ }).click();
  await expect(contact.getByRole('status')).toContainText('未能自动复制');
});
