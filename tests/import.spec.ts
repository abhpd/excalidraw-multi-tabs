import { expect, test } from '@playwright/test';

test.describe('Import Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('open and close modal on backdrop click', async ({ page }) => {
    const importBtn = page.getByTestId('import-modal-button');
    await importBtn.click();

    const overlay = page.getByTestId('modal-overlay');
    await expect(overlay).toBeVisible();

    // Click backdrop overlay to close
    await overlay.click({ position: { x: 10, y: 10 } });
    await expect(overlay).not.toBeVisible();
  });

  test('validate invalid Excalidraw URL displays error', async ({ page }) => {
    await page.getByTestId('import-modal-button').click();

    const input = page.getByTestId('import-url-input');
    await expect(input).toBeVisible();

    await input.fill('https://invalid-url.com');
    await input.press('Enter');

    const errorMsg = page.getByTestId('import-error-message');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toHaveText('Invalid Excalidraw link');
  });

  test('handles network failure during board fetch', async ({ page }) => {
    // Intercept excalidraw API call and fail it
    await page.route('https://json.excalidraw.com/**', (route) => route.abort());

    await page.getByTestId('import-modal-button').click();
    const input = page.getByTestId('import-url-input');

    await input.fill('https://excalidraw.com/#json=123456789,mockPrivateKey');
    await input.press('Enter');

    const errorMsg = page.getByTestId('import-error-message');
    await expect(errorMsg).toBeVisible();
  });
});
