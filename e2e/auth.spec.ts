import { test, expect } from '@playwright/test'

const TEST_EMAIL = `test-${Date.now()}@example.com`
const TEST_PASSWORD = 'TestPass123!'

test.describe('Authentication', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h1')).toContainText(/login/i, { timeout: 10000 })
  })

  test('should register a new user and redirect to home', async ({ page }) => {
    await page.goto('/register')
    await page.waitForSelector('input[type="email"]', { timeout: 10000 })

    await page.locator('input[type="email"]').fill(TEST_EMAIL)
    await page.locator('input[type="password"]').fill(TEST_PASSWORD)
    await page.locator('button[type="submit"]').click()

    await page.waitForURL('/', { timeout: 10000 })
    const cookies = await page.context().cookies()
    const accessTokenCookie = cookies.find((c) => c.name === 'access_token')
    expect(accessTokenCookie).toBeTruthy()
  })

  test('should login with credentials and redirect to home', async ({
    page,
  }) => {
    await page.goto('/login')
    await page.waitForSelector('input[type="email"]', { timeout: 10000 })

    await page.locator('input[type="email"]').fill(TEST_EMAIL)
    await page.locator('input[type="password"]').fill(TEST_PASSWORD)
    await page.locator('button[type="submit"]').click()

    await page.waitForURL('/', { timeout: 10000 })
    const cookies = await page.context().cookies()
    const accessTokenCookie = cookies.find((c) => c.name === 'access_token')
    expect(accessTokenCookie).toBeTruthy()
  })

  test('should redirect to login for protected route', async ({ page }) => {
    await page.goto('/create-wishlist')
    await expect(page).toHaveURL(/login/, { timeout: 10000 })
  })

  test('should logout and clear cookies', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[type="email"]').fill(TEST_EMAIL)
    await page.locator('input[type="password"]').fill(TEST_PASSWORD)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('/', { timeout: 10000 })

    await page.locator('[data-testid="logout-button"]').click()

    const cookies = await page.context().cookies()
    const accessTokenCookie = cookies.find((c) => c.name === 'access_token')
    expect(accessTokenCookie?.value).toBe('')
  })
})
