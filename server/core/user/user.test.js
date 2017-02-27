import mongoose from 'mongoose'
import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai, {
  expect
} from 'chai'
import app from '../../../index'

chai.config.includeStack = true

/**
 * root level hooks
 */
before((done) => {
  // clean collection before running test
  mongoose.connection.collections.users.drop(() => done())
})


after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

describe('## User APIs', () => {
  let user
  let token
  const user1 = {
    email: 'test@test.test',
    password: 'password',
    name: 'test'
  }

  describe('# POST /api/users', () => {

    it('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .send(user1)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user1.email)
          expect(res.body.name).to.equal(user1.name)
          user = res.body
          done()
        })
        .catch(done)
    })

    it('should not allow to create another user with the same email', (done) => {
      request(app)
        .post('/api/users')
        .send(user1)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.equal('This email address has already been taken')
          done()
        })
        .catch(done)
    })

    it('should not contain the password', (done) => {
      request(app)
        .post('/api/users')
        .send({
          email: 'test2@test.test',
          password: 'password',
          name: 'test'
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.not.have.property('password')
          done()
        })
        .catch(done)
    })

    it('should contain the timestampo', (done) => {
      request(app)
        .post('/api/users')
        .send({
          email: 'test3@test.test',
          password: 'password',
          name: 'test'
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
          done()
        })
        .catch(done)
    })
  })

  describe('# POST /api/users/login', () => {
    it('should sign user in properly', (done) => {
      request(app)
        .post('/api/users/login')
        .send({
          email: user1.email,
          password: user1.password
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(true)
          expect(res.body.token).to.not.be.empty
          token = res.body.token
          done()
        })
        .catch(done)
    })

    it('should fail to login with wrong email', (done) => {
      request(app)
        .post('/api/users/login')
        .send({
          email: 'nope@test.test',
          password: user1.password
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.equal('Wrong email address')
          done()
        })
        .catch(done)
    })

    it('should fail to login with wrong password', (done) => {
      request(app)
        .post('/api/users/login')
        .send({
          email: user1.email,
          password: 'NAH'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.equal('Wrong password')
          done()
        })
        .catch(done)
    })
  })

  describe('# GET /api/users/:userId', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/api/users/${user._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email)
          expect(res.body.name).to.equal(user.name)
          done()
        })
        .catch(done)
    })

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/api/users/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found')
          done()
        })
        .catch(done)
    })
  })

  describe('# PUT /api/users/:userId', () => {
    it('should update user details', (done) => {
      user.name = 'KK'
      request(app)
        .put(`/api/users/${user._id}`)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('KK')
          expect(res.body.email).to.equal(user.email)
          done()
        })
        .catch(done)
    })

  })


  //  describe('# GET /api/users/', () => {
  //    it('should get all users', (done) => {
  //      request(app)
  //        .get('/api/users')
  //        .expect(httpStatus.OK)
  //        .then((res) => {
  //          expect(res.body).to.be.an('array')
  //          done()
  //        })
  //        .catch(done)
  //    })
  //  })

  // describe('# DELETE /api/users/', () => {
  //    it('should delete user', (done) => {
  //      request(app)
  //        .delete(`/api/users/${user._id}`)
  //        .expect(httpStatus.OK)
  //        .then((res) => {
  //          expect(res.body.username).to.equal('KK')
  //          expect(res.body.mobileNumber).to.equal(user.mobileNumber)
  //          done()
  //        })
  //        .catch(done)
  //    })
  // })
})
