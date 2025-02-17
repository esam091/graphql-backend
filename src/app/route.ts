
import { ApolloServer } from '@apollo/server'
import jwt from 'jsonwebtoken'
import { typeDefs } from '@/schema/typeDefs.generated'
import { resolvers } from '@/schema/resolvers.generated'
import { Context } from '@/context'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloArmor } from '@escape.tech/graphql-armor'

const armor = new ApolloArmor({
  maxDepth: {
    enabled: true,
    n: 5,
  },
})

const { plugins, validationRules } = armor.protect()

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,

  // Enable playground in production so visitors can play around with the API
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({
      footer: false,
    }),
    ...plugins,
  ],
  introspection: true,
  validationRules: [...validationRules],
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