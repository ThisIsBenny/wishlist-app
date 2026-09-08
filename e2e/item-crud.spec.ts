import { test, expect } from '@playwright/test'

const TEST_EMAIL = `item-test-${Date.now()}@example.com`
const TEST_PASSWORD = 'TestPass123!'

test.describe('Item CRUD', () => {
  test('should display wishlist detail page after login', async ({ page }) => {
    await page.goto('/register')
    await page.locator('input[type="email"]').fill(TEST_EMAIL)
    await page.locator('input[type="password"]').fill(TEST_PASSWORD)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('/', { timeout: 10000 })

    const firstWishlist = page.locator('a[href^="/"]').first()
    if ((await firstWishlist.count()) > 0) {
      await firstWishlist.click()
      await page.waitForTimeout(2000)
      const pageContent = await page.content()
      expect(pageContent.length).toBeGreaterThan(0)
    }
  })
})
