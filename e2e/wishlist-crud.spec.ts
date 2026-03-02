import { test, expect } from '@playwright/test'

const API_KEY = 'TOP_SECRET'

test.describe('Wishlist CRUD', () => {
  test('should display wishlists on homepage after login', async ({ page }) => {
    await page.goto('/login')
    await page.waitForSelector('input[name="api-key"]', { timeout: 10000 })

    const input = page.locator('input[name="api-key"]')
    await input.click()
    await input.fill(API_KEY)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(3000)

    const wishlists = page.locator('a[href^="/"]')
    expect(await wishlists.count()).toBeGreaterThan(0)
  })
})
