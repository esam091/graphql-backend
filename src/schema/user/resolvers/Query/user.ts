import type { QueryResolvers } from '../../../types.generated'
import { userLoader } from '@/schema/loader/userLoader'
import { GraphQLError } from 'graphql'

export const user: NonNullable<QueryResolvers['user']> = async (
  _parent,
  { id },
) => {
  const idNumber = Number(id)

  if (isNaN(idNumber)) {
    throw new GraphQLError('Invalid user id')
  }
  return userLoader.load(idNumber)
}
