import _ from 'lodash'
import uuid from 'uuid'

import Invite from './invite.model'

/**
 * Load invite and append to req.
 */
function load(req, res, next, id) {
  Invite.get(id)
    .then((invite) => {
      req.invite = invite
      return next()
    })
    .catch(e => next(e))
}

/**
 * Create new invite
 * @property {string} req.body.email.
 * @property {string} req.body.group - Group ID .
 * @returns {Invite}
 */
function create(req, res, next) {
  const {
      email,
      group
  } = req.body

  const invite = new Invite({
    email,
    code: uuid.v4(),
    group,
    author: req.user
  })

  //TODO: send email

  invite.save()
    .then(savedInvite => res.json(savedInvite.getSafeObject()))
    .catch(e => next(e))
}

/**
 * Accept existing invite
 * @returns {Invite}
 */
function accept(req, res, next, code) {
  const invite = req.invite

  //TODO

  invite.save()
    .then(savedInvite => res.json(savedInvite.getSafeObject()))
    .catch(e => next(e))
}

/**
 * Get invite list.
 * @property {number} req.query.skip - Number of invites to be skipped.
 * @property {number} req.query.limit - Limit number of invites to be returned.
 * @returns {Invite[]}
 */
function list(req, res, next) {
  const {
    limit = 50, skip = 0
  } = req.query
  Invite.list({
      limit,
      skip
    })
    .then(invites => res.json(invites))
    .catch(e => next(e))
}

/**
 * Delete invite.
 * @returns {Invite}
 */
function remove(req, res, next) {
  const invite = req.invite
  invite.remove()
    .then(deletedInvite => res.json(deletedInvite))
    .catch(e => next(e))
}

export default {
  load,
  create,
  accept,
  list,
  remove
}
