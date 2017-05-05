import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} from 'graphql'

import { UserError } from 'graphql-errors'

import UserType from './user/user.type'
import User from './user/user.model'

export default new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Top level query',
  fields: {
    me: {
      type: UserType,
      args: {
        token: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (obj, args, { user }) => {
        if (args.token !== 'coucou') {
          throw new UserError('Invalid token.')
        }

        //Grab the current user from the JWT
        //TODO: set up a proper JWT token parser
        return User.get('58b395d8ae316918fd2592e6')
      }
    }
  }
})
