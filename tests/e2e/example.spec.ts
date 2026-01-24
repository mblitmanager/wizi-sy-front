import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  // Change this to match your app's actual title or text
  await expect(page).toHaveTitle(/Wizi/i);
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  // You can add more complex interactions here
  // await page.getByRole('link', { name: 'Se connecter' }).click();
  // await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
});
