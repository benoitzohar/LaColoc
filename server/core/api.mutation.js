import { GraphQLObjectType } from 'graphql'

import { UpdateUserName } from './user/user.mutation'

export default new GraphQLObjectType({
  name: 'Mutations',
  description: 'All mutations',
  fields: {
    UpdateUserName
  }
})
