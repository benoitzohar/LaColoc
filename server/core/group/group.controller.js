import _ from 'lodash'

import Group from './group.model'

/**
 * Load group and append to req.
 */
function load(req, res, next, id) {
  Group.get(id)
    .then(group => {
      req.group = group
      return next()
    })
    .catch(e => next(e))
}

/**
 * Get group
 * @returns {Group}
 */
function get(req, res) {
  return res.json(req.group)
}

/**
 * Create new group
 * @property {string} req.body.name
 * @property {string} req.body.description
 * @property {string} req.body.currency
 * @returns {Group}
 */
function create(req, res, next) {
  const { name, description, currency } = req.body

  const group = new Group({
    name,
    description,
    currency
  })

  group
    .save()
    .then(savedGroup => res.json(savedGroup.getSafeObject()))
    .catch(e => next(e))
}

/**
 * Update existing group
 * @property {string} req.body.name - The name of group.
 * @property {string} req.body.description - The description of group.
 * @property {string} req.body.currency - The currency used by the group.
 * @returns {Group}
 */
function update(req, res, next) {
  const group = req.group

  _.each(['name', 'description', 'currency'], key => {
    group[key] = req.body[key]
  })

  group
    .save()
    .then(savedGroup => res.json(savedGroup.getSafeObject()))
    .catch(e => next(e))
}

/**
 * Get group list.
 * @property {number} req.query.skip - Number of groups to be skipped.
 * @property {number} req.query.limit - Limit number of groups to be returned.
 * @returns {Group[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query
  Group.list({
    limit,
    skip
  })
    .then(groups => res.json(groups))
    .catch(e => next(e))
}

/**
 * Delete group.
 * @returns {Group}
 */
function remove(req, res, next) {
  const group = req.group
  group
    .remove()
    .then(deletedGroup => res.json(deletedGroup))
    .catch(e => next(e))
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove
}
