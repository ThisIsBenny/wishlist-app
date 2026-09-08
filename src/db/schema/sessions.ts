import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core'
import { users } from './users'

export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('userId')
      .notNull()
      .references(() => users.id),
    tokenJti: text('tokenJti').unique().notNull(),
    expiresAt: text('expiresAt').notNull(),
    createdAt: text('createdAt')
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => ({
    userIdIdx: index('sessions_user_id_idx').on(table.userId),
  })
)

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
