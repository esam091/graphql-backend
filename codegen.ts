import type { CodegenConfig } from '@graphql-codegen/cli'
import { defineConfig } from '@eddeee888/gcg-typescript-resolver-files'

const config: CodegenConfig = {
  schema: '**/schema.graphql',
  generates: {
    'src/schema': defineConfig({

      typesPluginsConfig: {
        contextType: '@/context#Context',
      },
    }),
  },
}
export default config
