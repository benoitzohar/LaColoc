import _ from 'lodash';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import mongooseTimestamp from 'mongoose-timestamp';
import APIError from '../../helpers/APIError';

/**
 * Invite Schema
 */
const InviteSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  group: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group'
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  usedAt: {
    type: Date
  }
});

/**
 *  Plugins
 */
InviteSchema.plugin(mongooseTimestamp);

/**
 * Methods
 */
InviteSchema.method({
  // remove password from invite object
  getSafeObject: function() {
    return this.toObject();
  }
});

/**
 * Statics
 */
InviteSchema.statics = {
  /**
   * Get invite
   * @param {ObjectId} id - The objectId of invite.
   * @returns {Promise<Invite, APIError>}
   */
  get(id) {
    return this.findById(id).exec().then(invite => {
      if (invite) {
        return invite;
      }
      const err = new APIError('No such invite exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  /**
   * List invites in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of invites to be skipped.
   * @param {number} limit - Limit number of invites to be returned.
   * @returns {Promise<Invite[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({
        createdAt: -1
      })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

/**
 * @typedef Invite
 */
export default mongoose.model('Invite', InviteSchema);
