import { expect, test } from '@playwright/test';

test.describe('Theme Synchronization', () => {
  test('toggle theme updates data-theme attribute, excalidraw canvas theme, and persists across reload', async ({
    page,
  }) => {
    await page.goto('/');
    const htmlElement = page.locator('html');
    const excalidraw = page.locator('.excalidraw');
    await expect(excalidraw).toBeVisible();

    const initialTheme =
      (await htmlElement.getAttribute('data-theme')) || 'light';

    // 1. Toggle theme to opposite
    const toggleButton = page.getByTestId('theme-toggle-button');
    await toggleButton.click();

    const expectedTheme = initialTheme === 'dark' ? 'light' : 'dark';
    await expect(htmlElement).toHaveAttribute('data-theme', expectedTheme);
    if (expectedTheme === 'dark') {
      await expect(excalidraw).toHaveClass(/theme--dark/);
    } else {
      await expect(excalidraw).not.toHaveClass(/theme--dark/);
    }

    // Verify stored theme in localStorage
    await expect
      .poll(async () => {
        return await page.evaluate(() => {
          const raw = localStorage.getItem('excalidraw-tabs-data');
          if (!raw) return null;
          const data = JSON.parse(raw);
          return data.state ? data.state.theme : data.theme;
        });
      })
      .toBe(expectedTheme);

    // 2. Reload and verify persistence (no flash of wrong theme, canvas is dark)
    await page.reload();
    await expect(htmlElement).toHaveAttribute('data-theme', expectedTheme);
    if (expectedTheme === 'dark') {
      await expect(excalidraw).toHaveClass(/theme--dark/);
    } else {
      await expect(excalidraw).not.toHaveClass(/theme--dark/);
    }

    // 3. Toggle back and verify return to initialTheme
    await page.getByTestId('theme-toggle-button').click();
    await expect(htmlElement).toHaveAttribute('data-theme', initialTheme);
    if (initialTheme === 'dark') {
      await expect(excalidraw).toHaveClass(/theme--dark/);
    } else {
      await expect(excalidraw).not.toHaveClass(/theme--dark/);
    }
  });

  test('respects system dark mode preference on initial session', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const htmlElement = page.locator('html');
    const excalidraw = page.locator('.excalidraw');
    await expect(htmlElement).toHaveAttribute('data-theme', 'dark');
    await expect(excalidraw).toHaveClass(/theme--dark/);
  });
});
