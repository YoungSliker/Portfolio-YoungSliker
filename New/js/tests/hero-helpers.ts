import { expect, type Page } from '@playwright/test';
export async function enterArchive(page:Page) {
 const skip=page.getByRole('button',{name:'跳过开场'});
 if(await skip.isVisible())await skip.click();
 await expect(page.locator('.hero-title-group')).toHaveCSS('opacity','1');
 await expect(page.locator('.hero-landing')).not.toHaveAttribute('inert','');
}
