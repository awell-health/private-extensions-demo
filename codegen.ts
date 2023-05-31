import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/api/schema.graphql',
  documents: './src/api/graphql/*.graphql',
  generates: {
    // "src/api/gql": {
    //   preset: "client",
    //   plugins: []
    // },
    './src/api/graphql-request.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
    },
  },
}

export default config
