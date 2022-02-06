import staticFiles from 'fastify-static'
import path from 'path'
import { initApp } from './config'
import routes from './routes'

const build = async (opts = {}) => {
  const app = await initApp(opts)

  routes.register(app)
  app.register(staticFiles, {
    root: path.join(__dirname, '..', 'static'),
  })
  app.setNotFoundHandler((req, res) => {
    res.sendFile('index.html')
  })

  app.get('/healthz', async () => {
    return { status: 'ok' }
  })

  // TODO: disconnet prisma client when server will be shutdown
  return app
}

export default build
