import Joi from 'joi'

export default {
  // POST /api/users
  create: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().required()
    }
  },

  // UPDATE /api/users/:userId
  update: {
    body: {
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      password: Joi.string()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/users/login
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  }
}
