import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql'

import GroupModel from '../group/group.model'
import GroupType from '../group/group.type'

export default new GraphQLObjectType({
  name: 'User',
  description: 'User data',
  fields: () => ({
    _id: {
      type: GraphQLString,
      resolve: user => user._id
    },
    name: {
      type: GraphQLString,
      resolve: user => user.name
    },
    email: {
      type: GraphQLString,
      resolve: user => user.email
    },
    groups: {
      type: new GraphQLList(GroupType),
      resolve: user => GroupModel.find({ users: { _id: user._id } })
    }
  })
})
