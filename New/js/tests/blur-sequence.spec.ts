import {test,expect} from '@playwright/test';
test('contact text waits for its card, then resolves clearly',async({page})=>{
 await page.goto('/Portfolio-YoungSliker/New/#contact');
 const card=page.locator('.contact-methods li').first();
 await card.scrollIntoViewIfNeeded();
 const text=card.locator('.contact-method-value .blur-text');
 await expect(text).toHaveAttribute('data-blur-phase','from');
 await expect(card).not.toHaveAttribute('data-entrance-pending','true');
 await expect(text).toHaveAttribute('data-blur-phase','in');
 await expect(text.locator('span[aria-hidden]').first()).toHaveCSS('filter','blur(0px)',{timeout:6000});
});
