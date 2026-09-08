import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { DB_TOKEN, type DbInstance } from '../database.module'
import { sessions, users } from '@/db/schema'
import { and, eq, lt } from 'drizzle-orm'
import * as bcrypt from 'bcrypt'
import { Response } from 'express'
import type { AppConfig } from '../config/configuration'
import type { LoginDto, RegisterDto } from './dto/auth.dto'

const SALT_ROUNDS = 12
const SESSION_EXPIRY_DAYS = 7
const COOKIE_MAX_AGE = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000

// Browsers reject `Secure` cookies over plain http://localhost, which would
// break `npm run dev`. HTTPS-only in production/test, relaxed in development.
const COOKIE_SECURE = (process.env.NODE_ENV ?? 'development') !== 'development'

interface AuthResponse {
  user: {
    id: string
    email: string
  }
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject(DB_TOKEN) private readonly db: DbInstance,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>
  ) {}

  async register(dto: RegisterDto, response: Response): Promise<AuthResponse> {
    const emailRegisterEnabled = this.configService.get(
      'AUTH_EMAIL_REGISTER_ENABLED'
    )
    if (!emailRegisterEnabled) {
      throw new ForbiddenException('Registration is currently disabled')
    }

    const existingUser = await this.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email))
      .get()

    if (existingUser) {
      throw new ConflictException('A user with this email already exists')
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS)
    const now = new Date().toISOString()

    let newUser: typeof users.$inferSelect
    try {
      newUser = await this.db
        .insert(users)
        .values({
          email: dto.email,
          passwordHash,
          createdAt: now,
          updatedAt: now,
        })
        .returning()
        .get()
    } catch (err: any) {
      // Two concurrent registrations can race past the existence check;
      // the UNIQUE constraint decides. Map it to the same 409.
      if (err?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictException('A user with this email already exists')
      }
      throw err
    }

    await this.createSession(newUser.id, response)

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    }
  }

  async login(dto: LoginDto, response: Response): Promise<AuthResponse> {
    const emailLoginEnabled = this.configService.get('AUTH_EMAIL_LOGIN_ENABLED')
    if (!emailLoginEnabled) {
      throw new ForbiddenException('Email/password login is currently disabled')
    }

    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email))
      .get()

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password')
    }

    // Housekeeping: drop only EXPIRED sessions of this user. Active
    // sessions (other devices) stay valid — multi-device login is intended.
    await this.db
      .delete(sessions)
      .where(
        and(
          eq(sessions.userId, user.id),
          lt(sessions.expiresAt, new Date().toISOString())
        )
      )
      .run()

    await this.createSession(user.id, response)

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    }
  }

  async logout(jti: string, response: Response): Promise<void> {
    // Revoke only the session that is logging out; sessions on other
    // devices remain valid until they expire.
    await this.db.delete(sessions).where(eq(sessions.tokenJti, jti)).run()

    response.cookie('access_token', '', {
      httpOnly: true,
      sameSite: 'strict',
      secure: COOKIE_SECURE,
      maxAge: 0,
      path: '/',
    })

    response.cookie('session_expiry', '', {
      httpOnly: false,
      sameSite: 'strict',
      secure: COOKIE_SECURE,
      maxAge: 0,
      path: '/',
    })
  }

  isEmailLoginEnabled(): boolean {
    return this.configService.get('AUTH_EMAIL_LOGIN_ENABLED') === true
  }

  isEmailRegisterEnabled(): boolean {
    return this.configService.get('AUTH_EMAIL_REGISTER_ENABLED') === true
  }

  async oidcLogin(
    oidcSubject: string,
    email: string,
    oidcIssuer: string,
    emailVerified: boolean,
    response: Response
  ): Promise<AuthResponse> {
    // Primary identity: (oidcIssuer, oidcSubject) — the cryptographically
    // verified pair from the id_token. Email matching only as account
    // LINKING for verified emails, never for unverified ones (otherwise
    // any provider could take over an existing account by claiming the
    // email).
    let user = await this.db
      .select()
      .from(users)
      .where(
        and(
          eq(users.oidcIssuer, oidcIssuer),
          eq(users.oidcSubject, oidcSubject)
        )
      )
      .get()

    if (!user && emailVerified) {
      user = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get()
      if (user) {
        // Link the verified OIDC identity to the existing account.
        await this.db
          .update(users)
          .set({ oidcIssuer, oidcSubject, updatedAt: new Date().toISOString() })
          .where(eq(users.id, user.id))
          .run()
      }
    }

    if (!user) {
      const now = new Date().toISOString()
      try {
        user = await this.db
          .insert(users)
          .values({
            email,
            oidcSubject,
            oidcIssuer,
            createdAt: now,
            updatedAt: now,
          })
          .returning()
          .get()
      } catch (err: any) {
        // Two concurrent OIDC callbacks (same identity or same verified
        // email) can race past the lookups. Re-select: the winner's row
        // now exists and matches one of the lookups above.
        if (err?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          user =
            (await this.db
              .select()
              .from(users)
              .where(
                and(
                  eq(users.oidcIssuer, oidcIssuer),
                  eq(users.oidcSubject, oidcSubject)
                )
              )
              .get()) ||
            (await this.db
              .select()
              .from(users)
              .where(eq(users.email, email))
              .get())
          if (!user) {
            throw new ConflictException(
              'Account with this identity could not be created'
            )
          }
        } else {
          throw err
        }
      }
    }

    await this.createSession(user.id, response)

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    }
  }

  async findUserById(
    userId: string
  ): Promise<{ id: string; email: string } | null> {
    const user = await this.db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .get()

    return user || null
  }

  private async createSession(
    userId: string,
    response: Response
  ): Promise<void> {
    const jti = crypto.randomUUID()
    const expiresAt = new Date(
      Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    )
    const expiresAtISO = expiresAt.toISOString()

    await this.db
      .insert(sessions)
      .values({
        userId,
        tokenJti: jti,
        expiresAt: expiresAtISO,
      })
      .run()

    const token = await this.jwtService.signAsync({
      sub: userId,
      jti,
    })

    response.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: COOKIE_SECURE,
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })

    response.cookie('session_expiry', expiresAtISO, {
      httpOnly: false,
      sameSite: 'strict',
      secure: COOKIE_SECURE,
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
  }
}
