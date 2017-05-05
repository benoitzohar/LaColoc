import _ from 'lodash'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import mongooseTimestamp from 'mongoose-timestamp'
import APIError from '../../helpers/APIError'

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

/**
 *  Plugins
 */
UserSchema.plugin(mongooseTimestamp)

/**
 *  Hooks
 */
UserSchema.pre('save', function(next) {
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err)
      }
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) {
          return next(err)
        }
        this.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

/**
 * Methods
 */
UserSchema.method({
  // remove password from user object
  getSafeObject: function() {
    return _.omit(this.toObject(), 'password')
  },
  // compare 2 passwords
  comparePassword: function(password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
          reject(err)
        }
        resolve(isMatch)
      })
    })
  }
})

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id).exec().then(user => {
      if (user) {
        return user
      }
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND)
      return Promise.reject(err)
    })
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({
        createdAt: -1
      })
      .skip(skip)
      .limit(limit)
      .exec()
  }
}

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema)
