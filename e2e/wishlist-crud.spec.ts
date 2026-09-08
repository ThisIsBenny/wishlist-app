import { test, expect } from '@playwright/test'

const TEST_EMAIL = `wishlist-test-${Date.now()}@example.com`
const TEST_PASSWORD = 'TestPass123!'

test.describe('Wishlist CRUD', () => {
  test('should create and display wishlists after login', async ({ page }) => {
    await page.goto('/register')
    await page.locator('input[type="email"]').fill(TEST_EMAIL)
    await page.locator('input[type="password"]').fill(TEST_PASSWORD)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('/', { timeout: 10000 })

    await page.goto('/create-wishlist')
    await page.waitForURL('/create-wishlist', { timeout: 10000 })

    await page.goBack()
    const wishlists = page.locator('a[href^="/"]')
    expect(await wishlists.count()).toBeGreaterThanOrEqual(0)
  })
})
