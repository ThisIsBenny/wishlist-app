import { spawn } from 'child_process'

export default async function globalSetup() {
  const server = spawn('node', ['dist/api/main.js'], {
    env: {
      ...process.env,
      NODE_ENV: 'test',
      DATABASE_URL: 'file:./data/playwright-test.db',
      API_KEY: 'TOP_SECRET',
      PORT: '5001',
    },
    stdio: 'pipe',
  })

  let resolved = false
  await new Promise<void>((resolve) => {
    server.stdout?.on('data', (data) => {
      const str = data.toString()
      if (str.includes('Server listening') && !resolved) {
        resolved = true
        resolve()
      }
    })
  })

  await fetch('http://localhost:5001/api/wishlist', {
    method: 'POST',
    headers: {
      Authorization: 'API-Key TOP_SECRET',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Test Wishlist',
      slugUrlText: 'test',
      public: true,
    }),
  })

  server.kill()
}
