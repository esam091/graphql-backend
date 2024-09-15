import { shops } from '@/schema'
import type { QueryResolvers } from './../../../types.generated'
import { db } from '@/db'
import { eq } from 'drizzle-orm'

export const shop: NonNullable<QueryResolvers['shop']> = async (
  _,
  { id },
  __
) => {
  const [dbShop] = await db
    .select()
    .from(shops)
    .where(eq(shops.id, Number(id)))
  return dbShop
}
