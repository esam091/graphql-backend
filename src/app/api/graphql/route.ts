
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
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

const handler = startServerAndCreateNextHandler(server)

export { handler as GET, handler as POST }