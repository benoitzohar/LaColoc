import { GraphQLSchema } from 'graphql'
import { maskErrors } from 'graphql-errors'

import RootQuery from '../core/api.query'

const schema = new GraphQLSchema({
  query: RootQuery
})

maskErrors(schema)

export default schema
