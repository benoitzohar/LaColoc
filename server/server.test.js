import mongoose from 'mongoose'
import chai, {
  expect
} from 'chai'

//
// Test suite
//

//config
chai.config.includeStack = true

// 1. Dump all the collections
before((done) => {
  // clean collection before running test
    if (mongoose.connection.collections.users) {
        mongoose.connection.collections.users.drop(() => done())
    } else {
        done()
    }
})
before((done) => {
  // clean collection before running test
    if (mongoose.connection.collections.groups) {
        mongoose.connection.collections.groups.drop(() => done())
    } else {
        done()
    }
})


// 2. ensure mongo release after tests
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})


// 3. launch tests:

    // API Tests
    describe('# Api and Routes', () => {
        require('./core/api.test.js')
    })

    // Core: User
    describe('# User API', () => {
        require('./core/user/user.test.js')
    })

    // Core: Group
    describe('# Group API', () => {
        require('./core/group/group.test.js')
    })

    // Core: Invite
    describe('# Invite API', () => {
        require('./core/invite/invite.test.js')
    })
