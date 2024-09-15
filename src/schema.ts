import { relations, sql } from 'drizzle-orm'
import { sqliteTable, text, integer, customType } from 'drizzle-orm/sqlite-core'

// Define the custom enum type
const roleEnum = customType<{ data: 'user' | 'admin' }>({
  dataType() {
    return 'text'
  },
})

// Define custom date type
const dateType = customType<{ data: Date; driverData: string }>({
  dataType() {
    return 'text'
  },
  toDriver(value: Date): string {
    return value.toISOString()
  },
  fromDriver(value: string): Date {
    return new Date(value)
  },
})

export const users = sqliteTable('user', {
  id: integer('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('passwordHash').notNull(),
  dateOfBirth: dateType('dateOfBirth').notNull(),
  role: roleEnum('role').notNull(),
  createdAt: dateType('createdAt')
    .default(sql`(datetime('now'))`)
    .notNull(),
  updatedAt: dateType('updatedAt')
    .default(sql`(datetime('now'))`)
    .notNull(),
})

export const shops = sqliteTable('shop', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  createdAt: dateType('createdAt')
    .default(sql`(datetime('now'))`)
    .notNull(),
  updatedAt: dateType('updatedAt')
    .default(sql`(datetime('now'))`)
    .notNull(),
  userId: integer('userId')
    .references(() => users.id)
    .notNull()
    .unique(),
})

export const products = sqliteTable('product', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  stock: integer('stock').notNull(),
  isActive: integer('isActive').notNull(),
  createdAt: dateType('createdAt')
    .default(sql`(datetime('now'))`)
    .notNull(),
  updatedAt: dateType('updatedAt')
    .default(sql`(datetime('now'))`)
    .notNull(),
  shopId: integer('shopId')
    .references(() => shops.id)
    .notNull(),
})

export const userRelations = relations(users, ({ one }) => ({
  shop: one(shops, {
    fields: [users.id],
    references: [shops.userId],
  }),
}))

export const shopRelations = relations(shops, ({ one, many }) => ({
  user: one(users, {
    fields: [shops.userId],
    references: [users.id],
  }),
  products: many(products),
}))

export const productRelations = relations(products, ({ one }) => ({
  shop: one(shops, {
    fields: [products.shopId],
    references: [shops.id],
  }),
}))
