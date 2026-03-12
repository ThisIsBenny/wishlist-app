import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const wishlists = sqliteTable('Wishlist', {
  id: text('id').primaryKey(),
  public: integer('public', { mode: 'boolean' }).default(true).notNull(),
  title: text('title').notNull(),
  imageSrc: text('imageSrc').default(''),
  slugUrlText: text('slugUrlText').unique().notNull(),
  description: text('description').default(''),
})

export type Wishlist = typeof wishlists.$inferSelect
export type NewWishlist = typeof wishlists.$inferInsert
