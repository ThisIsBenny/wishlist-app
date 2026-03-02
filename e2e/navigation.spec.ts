import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h1')).toContainText(/login/i, { timeout: 10000 })
  })

  test('should redirect to login for protected route', async ({ page }) => {
    await page.goto('/create-wishlist')
    await expect(page).toHaveURL(/login/, { timeout: 10000 })
  })
})
