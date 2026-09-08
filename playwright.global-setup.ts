import { spawn } from 'child_process'

export default async function globalSetup() {
  const server = spawn('node', ['dist/api/main.js'], {
    env: {
      ...process.env,
      NODE_ENV: 'test',
      DATABASE_URL: 'file:./data/playwright-test.db',
      JWT_SECRET: 'test-jwt-secret-at-least-32-characters-long!!',
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

  server.kill()
}
