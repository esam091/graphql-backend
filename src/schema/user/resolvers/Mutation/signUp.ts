import { GraphQLError } from 'graphql'
import { db } from '../../../../db'
import { users } from '../../../../schema'
import type { MutationResolvers } from '../../../types.generated'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signUp: NonNullable<MutationResolvers['signUp']> = async (
  _parent,
  fields,
) => {
  const newUser = await db
    .insert(users)
    .values({
      username: fields.username,
      passwordHash: await bcrypt.hash(fields.password, 10),
      dateOfBirth: new Date(fields.dateOfBirth),
      role: fields.role === 'ADMIN' ? 'admin' : 'user',
    })
    .returning()
    .get()

  if (!newUser) {
    throw new GraphQLError('Failed to create user', {
      extensions: { code: 'USER_CREATION_FAILED' },
    })
  }

  const payload = {
    id: newUser.id.toString(),
    role: newUser.role,
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET!)
  return token
}
