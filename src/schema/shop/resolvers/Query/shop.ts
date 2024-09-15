import { shops } from '@/schema'
import type { QueryResolvers } from './../../../types.generated'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { shopLoader } from '@/schema/loader/shopLoader'

export const shop: NonNullable<QueryResolvers['shop']> = async (
  _,
  { id },
) => {
  return shopLoader.load(Number(id))
}
