import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql'

import UserModel from '../user/user.model'
import UserType from '../user/user.type'

export default new GraphQLObjectType({
  name: 'Invite',
  description: 'Invitation data',
  fields: () => ({
    _id: {
      type: GraphQLString,
      resolve: invite => invite._id
    },
    email: {
      type: GraphQLString,
      resolve: invite => invite.email
    },
    author: {
      type: UserType,
      resolve: invite => UserModel.get(invite.author)
    }
  })
})
