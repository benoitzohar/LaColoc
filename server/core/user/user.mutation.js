import { GraphQLString, GraphQLNonNull } from 'graphql'

import { UserError } from 'graphql-errors'

import User from './user.model'
import UserType from './user.type'

export const UpdateUserName = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'ID of the user'
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Name of the user'
    }
  },
  resolve: (source, args) => {
    return User.get(args.id).then(user => {
      if (!user) {
        throw new UserError('Unknown user')
      }

      user.name = args.name

      return user.save()
    })
  }
}
