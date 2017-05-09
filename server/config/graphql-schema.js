import { GraphQLSchema } from 'graphql'
import { maskErrors } from 'graphql-errors'

import RootQuery from '../core/api.query'
import Mutations from '../core/api.mutation'

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations
})

maskErrors(schema)

export default schema
