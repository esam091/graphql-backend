
import { ApolloServer } from '@apollo/server'
import jwt from 'jsonwebtoken'
import { typeDefs } from '@/schema/typeDefs.generated'
import { resolvers } from '@/schema/resolvers.generated'
import { Context } from '@/context'
import { startServerAndCreateNextHandler } from '@as-integrations/next'

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  // includeStacktraceInErrorResponses: false,
})

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {

    // @ts-expect-error types not matching
    const token = req.headers.get('authorization') || ''
    try {
      const payload = jwt.verify(
        token.replace('Bearer ', ''),
        process.env.JWT_SECRET!
      )

      if (
        typeof payload !== 'object' ||
        typeof payload.id !== 'string' ||
        typeof payload.role !== 'string' ||
        !(payload.role === 'user' || payload.role === 'admin')
      ) {
        return { currentUser: null }
      }

      return {
        currentUser: { id: payload.id, role: payload.role as 'user' | 'admin' },
      }
    } catch (error) {
      return { currentUser: null }
    }
  },
})

export { handler as GET, handler as POST }