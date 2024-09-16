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
  if (fields.username.length < 1 || fields.username.length > 50) {
    throw new GraphQLError('Username must be between 1 and 50 characters', {
      extensions: { code: 'BAD_USER_INPUT' },
    })
  }

  if (fields.password.length < 1 || fields.password.length > 50) {
    throw new GraphQLError('Password must be between 1 and 50 characters', {
      extensions: { code: 'BAD_USER_INPUT' },
    })
  }
  
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
