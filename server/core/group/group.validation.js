import Joi from 'joi'

export default {
  // POST /api/groups
  create: {
    body: {
      name: Joi.string().required(),
      description: Joi.string(),
      currency: Joi.string().required()
    }
  },

  // UPDATE /api/groups/:groupId
  update: {
    body: {
      name: Joi.string().required(),
      description: Joi.string(),
      currency: Joi.string().required()
    },
    params: {
      groupId: Joi.string().hex().required()
    }
  }
}
