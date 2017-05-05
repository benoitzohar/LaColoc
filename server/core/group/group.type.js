import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql'

import UserModel from '../user/user.model'
import UserType from '../user/user.type'

import InviteModel from '../invite/invite.model'
import InviteType from '../invite/invite.type'

export default new GraphQLObjectType({
  name: 'Group',
  description: 'Group data',
  fields: () => ({
    _id: {
      type: GraphQLString,
      resolve: group => group._id
    },
    name: {
      type: GraphQLString,
      resolve: group => group.name
    },
    description: {
      type: GraphQLString,
      resolve: group => group.description
    },
    currency: {
      type: GraphQLString,
      resolve: group => group.currency
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: group => group.users.map(userId => UserModel.get(userId))
    },
    invites: {
      type: new GraphQLList(InviteType),
      resolve: group => InviteModel.find({ group: group._id, usedAt: null })
    }
  })
})
