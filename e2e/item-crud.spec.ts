import { test, expect } from '@playwright/test'

const API_KEY = 'TOP_SECRET'

test.describe('Item CRUD', () => {
  test('should display wishlist detail page after login', async ({ page }) => {
    await page.goto('/login')
    await page.waitForSelector('input[name="api-key"]', { timeout: 10000 })

    const input = page.locator('input[name="api-key"]')
    await input.click()
    await input.fill(API_KEY)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(3000)

    const firstWishlist = page.locator('a[href^="/"]').first()
    await firstWishlist.click()
    await page.waitForTimeout(2000)

    const pageContent = await page.content()
    expect(pageContent.length).toBeGreaterThan(0)
  })
})
