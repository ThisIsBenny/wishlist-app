import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { wishlists } from './wishlists'

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  url: text('url').default(''),
  imageSrc: text('imageSrc').default(''),
  description: text('description').notNull(),
  bought: integer('bought', { mode: 'boolean' }).default(false).notNull(),
  wishlistId: text('wishlistId')
    .notNull()
    .references(() => wishlists.id, { onDelete: 'cascade' }),
})

export type Item = typeof items.$inferSelect
export type NewItem = typeof items.$inferInsert
