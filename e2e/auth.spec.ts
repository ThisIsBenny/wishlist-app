import { test, expect } from '@playwright/test'

const API_KEY = 'TOP_SECRET'

test.describe('Authentication', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h1')).toContainText(/login/i, { timeout: 10000 })
  })

  test('should login with valid API key', async ({ page }) => {
    await page.goto('/login')

    await page.waitForSelector('input[name="api-key"]', { timeout: 10000 })
    const input = page.locator('input[name="api-key"]')

    await input.click()
    await input.fill(API_KEY)

    await page.waitForTimeout(500)

    await page.keyboard.press('Tab')
    await page.waitForTimeout(1000)

    await page.keyboard.press('Enter')
    await page.waitForTimeout(2000)

    const token = await page.evaluate(() => localStorage.getItem('auth-token'))
    expect(token).toBeTruthy()
  })

  test('should redirect to login for protected route', async ({ page }) => {
    await page.goto('/create-wishlist')
    await expect(page).toHaveURL(/login/, { timeout: 10000 })
  })
})
