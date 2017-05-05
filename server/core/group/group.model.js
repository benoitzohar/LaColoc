import _ from 'lodash'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import mongooseTimestamp from 'mongoose-timestamp'
import APIError from '../../helpers/APIError'

/**
 * Group Schema
 */
const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  currency: {
    type: String,
    default: '€'
  },
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
})

/**
 *  Plugins
 */
GroupSchema.plugin(mongooseTimestamp)

/**
 * Methods
 */
GroupSchema.method({
  // remove password from group object
  getSafeObject: function() {
    return this.toObject()
  }
})

/**
 * Statics
 */
GroupSchema.statics = {
  /**
   * Get group
   * @param {ObjectId} id - The objectId of group.
   * @returns {Promise<Group, APIError>}
   */
  get(id) {
    return this.findById(id).exec().then(group => {
      if (group) {
        return group
      }
      const err = new APIError('No such group exists!', httpStatus.NOT_FOUND)
      return Promise.reject(err)
    })
  },

  /**
   * List groups in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of groups to be skipped.
   * @param {number} limit - Limit number of groups to be returned.
   * @returns {Promise<Group[]>}
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
 * @typedef Group
 */
export default mongoose.model('Group', GroupSchema)
