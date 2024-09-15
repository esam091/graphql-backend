import { GraphQLError } from 'graphql'
import { db } from '../../../../db'
import { users } from '../../../../schema'
import type { MutationResolvers } from '../../../types.generated'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signIn: NonNullable<MutationResolvers['signIn']> = async (
  _parent,
  fields,
) => {
  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, fields.username))

  const notFoundError = new GraphQLError(
    'User not found or password is incorrect'
  )

  if (!dbUser) {
    throw notFoundError
  }

  const passwordMatch = await bcrypt.compare(
    fields.password,
    dbUser.passwordHash
  )

  if (!passwordMatch) {
    throw notFoundError
  }

  const payload = {
    id: dbUser.id.toString(),
    role: dbUser.role,
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET!)
  return token
}
