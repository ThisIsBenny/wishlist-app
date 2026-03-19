import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { Request, Response, NextFunction } from 'express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const configService = app.get(ConfigService)
  const isDevelopment = configService.get('NODE_ENV') !== 'production'

  app.enableCors({
    origin: isDevelopment ? /https?:\/\/localhost(:\d+)?/ : false,
    credentials: true,
  })

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; script-src 'self'"
    )
    next()
  })

  const staticPath = join(__dirname, '..', 'static')
  app.useStaticAssets(staticPath, {
    maxAge: '1y',
    immutable: true,
  })

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) {
      return next()
    }
    if (req.method === 'GET' && !req.path.includes('.')) {
      return res.sendFile(join(staticPath, 'index.html'))
    }
    next()
  })

  app.setGlobalPrefix('api')

  const port = configService.get('PORT') || 5000
  await app.listen(port, '0.0.0.0')
  console.log(`Server listening on http://localhost:${port}`)
}

bootstrap()
