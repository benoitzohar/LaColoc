import Joi from 'joi'

export default {
  // POST /api/invites
  create: {
    body: {
      email: Joi.string().required(),
      group: Joi.string().hex().required()
    }
  }
}
