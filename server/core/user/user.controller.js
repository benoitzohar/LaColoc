import _ from 'lodash'
import jwt from 'jsonwebtoken'

import User from './user.model'
import APIError from '../../helpers/APIError'
import config from '../../config/config'

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user
      return next()
    })
    .catch(e => next(e))
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user)
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {

  const {
    email,
    password,
    name
  } = req.body

  User.findOne({
      email
    })
    .then((existingUser) => {

      if (existingUser) {
        return Promise.reject(new APIError('This email address has already been taken', 400, true))
      }

      const user = new User({
        email,
        password,
        name
      })

      return user.save()

    })
    .then(savedUser => res.json(savedUser.getSafeObject()))
    .catch(e => next(e))

}

/**
 * Update existing user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.name - The name of user.
 * @property {string} req.body.password - [Optionnal] Only to update the current password.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user

  _.each(['email', 'name'], (key) => {
    user[key] = req.body[key]
  })

  // only update the password if it's set
  if (req.body.password) {
    user.password = req.body.password
  }

  user.save()
    .then(savedUser => res.json(savedUser.getSafeObject()))
    .catch(e => next(e))
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const {
    limit = 50, skip = 0
  } = req.query
  User.list({
      limit,
      skip
    })
    .then(users => res.json(users))
    .catch(e => next(e))
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e))
}

/**
 * Login user.
 * @returns {JWTToken}
 */
function login(req, res, next) {

  const {
    email,
    password
  } = req.body

  let foundUser = null

  User.findOne({
      email
    })
    .then((user) => {

      if (!user) {
        return Promise.reject(new APIError('Wrong email address', 400, true))
      }

      foundUser = user

      // Check if password matches
      return foundUser.comparePassword(password)
    })
    .then((isMatch) => {
      if (isMatch) {
        // Create token if the password matched and no error was thrown
        var token = jwt.sign(foundUser, config.secret, {
          expiresIn: 10080 // in seconds
        })
        res.json({
          success: true,
          token: 'JWT ' + token
        })
      } else {
        return Promise.reject(new APIError('Wrong password', 400, true))
      }
    })
    .catch(e => next(e))
}



export default {
  load,
  get,
  create,
  update,
  list,
  remove,
  login
}
