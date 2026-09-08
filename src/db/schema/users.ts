import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text('email').unique().notNull(),
    passwordHash: text('passwordHash'),
    oidcIssuer: text('oidcIssuer'),
    oidcSubject: text('oidcSubject'),
    createdAt: text('createdAt')
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updatedAt')
      .notNull()
      .$defaultFn(() => new Date().toISOString())
      .$onUpdateFn(() => new Date().toISOString()),
  },
  (table) => ({
    oidcUniqueIdx: uniqueIndex('oidc_issuer_subject_idx').on(
      table.oidcIssuer,
      table.oidcSubject
    ),
  })
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
