import { QuerysearchProductsArgs } from '@/schema/types.generated'
import { Context } from './context'
import { GraphQLError } from 'graphql'
import { db } from './db'
import { products, shops, users } from './schema'
import {
  gte,
  lte,
  gt,
  lt,
  asc,
  desc,
  eq,
  like,
  and,
  SQLWrapper,
  or,
} from 'drizzle-orm'

interface SearchProductsArgs extends QuerysearchProductsArgs {
  shopId?: number
}

interface SearchProductParams {
  args: SearchProductsArgs
  context: Context
}

export async function searchProducts({ args, context }: SearchProductParams) {
  const { currentUser } = context
  const {
    name,
    minPrice,
    maxPrice,
    inStockOnly,
    first: firstItems,
    after,
    last,
    before,
    shopId,
  } = args
  let first = firstItems
  if (!first && !last) {
    first = 5
  }

  if (first && (last || before)) {
    throw new GraphQLError('Can only pair first with after')
  }

  if (last && (first || after)) {
    throw new GraphQLError('Can only pair last with before')
  }

  if (before && after) {
    throw new GraphQLError('Cannot use both before and after')
  }

  let query = db
    .select()
    .from(products)
    .innerJoin(shops, eq(products.shopId, shops.id))
    .innerJoin(users, eq(shops.userId, users.id))
    .$dynamic()

  const conditions: SQLWrapper[] = []

  if (name) {
    conditions.push(like(products.name, `%${name}%`))
  }

  if (minPrice) {
    conditions.push(gte(products.price, minPrice))
  }

  if (maxPrice) {
    conditions.push(lte(products.price, maxPrice))
  }

  if (inStockOnly) {
    conditions.push(gte(products.stock, 1))
  }

  if (shopId) {
    conditions.push(eq(products.shopId, shopId))
  }

  if (after) {
    conditions.push(gt(products.id, parseInt(after, 10)))
  } else if (before) {
    conditions.push(lt(products.id, parseInt(before, 10)))
  }

  if (first) {
    query = query.limit(first + 1).orderBy(asc(products.id))
  } else if (last) {
    query = query.limit(last + 1).orderBy(desc(products.id))
  }

  if (currentUser?.role !== 'admin') {
    const orCondition = or(
      eq(products.isActive, 1),

      //only add this condition when there is a current user
      !!currentUser ? and(eq(users.id, Number(currentUser.id))) : undefined
    )

    if (orCondition) {
      conditions.push(orCondition)
    }
  }

  query = query.where(and(...conditions))

  const results = await query

  const hasNextPage = first ? results.length > first : false
  const hasPreviousPage = last ? results.length > last : false

  let edges = results.map(({ product }) => ({
    cursor: product.id.toString(),
    node: {
      ...product,
      isActive: Boolean(product.isActive),
    },
  }))

  if (first) {
    edges = edges.slice(0, first)
  } else if (last) {
    edges = edges.slice(-last).reverse()
  }

  return {
    edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor: edges.length > 0 ? edges[0]?.cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1]?.cursor : null,
    },
  }
}
