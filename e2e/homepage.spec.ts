import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage without JavaScript errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForTimeout(5000)

    expect(consoleErrors).toHaveLength(0)
  })

  test('should load API data successfully', async ({ page }) => {
    const response = await page.request.get(
      'http://localhost:5000/api/wishlist'
    )
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(Array.isArray(data)).toBeTruthy()
  })
})
