import mongoose from 'mongoose'
import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai, { expect } from 'chai'
import app from '../../../index'

let invite
const invite1 = {
  email: 'test-invite@test.test',
  group: '1234'
}

before(done => {
  // clean collection before running test
  if (mongoose.connection.collections.invites) {
    mongoose.connection.collections.invites.drop(() => done())
  } else {
    done()
  }
})

describe('# Rights ', () => {
  ;[
    ['get', '/api/invites'],
    ['post', '/api/invites'],
    ['get', '/api/invites/123'],
    ['post', '/api/invites/123'],
    ['delete', '/api/invites/123']
  ].forEach(([type, route]) => {
    it(`should be secure on [${type}] ${route}`, done => {
      request(app)
        [type](route)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          done()
        })
        .catch(done)
    })
  })
})
/* TODO: finish tests
describe('# POST /api/invites', () => {

it('should create a new invite and return all fields', (done) => {
  request(app)
    .post('/api/invites')
    .set('Authorization', token)
    .send(invite1)
    .expect(httpStatus.OK)
    .then((res) => {
      expect(res.body.name).to.equal(invite1.name)
      expect(res.body.description).to.equal(invite1.description)
      expect(res.body.currency).to.equal(invite1.currency)

      expect(res.body).to.have.property('group')
      expect(res.body).to.have.property('author')

      expect(res.body).to.have.property('createdAt')
      expect(res.body).to.have.property('updatedAt')
      invite = res.body
      done()
    })
    .catch(done)
})

})

describe('# GET /api/invites/:inviteId', () => {
it('should get invite details', (done) => {
  request(app)
    .get(`/api/invites/${invite._id}`)
    .set('Authorization', token)
    .expect(httpStatus.OK)
    .then((res) => {
      expect(res.body.email).to.equal(invite.email)
      expect(res.body.name).to.equal(invite.name)
      done()
    })
    .catch(done)
})

it('should report error with message - Not found, when invite does not exists', (done) => {
  request(app)
    .get('/api/invites/56c787ccc67fc16ccc1a5e92')
    .set('Authorization', token)
    .expect(httpStatus.NOT_FOUND)
    .then((res) => {
      expect(res.body.message).to.equal('Not Found')
      done()
    })
    .catch(done)
})
})

describe('# PUT /api/invites/:inviteId', () => {
it('should update invite details', (done) => {
  invite.name = 'KK'
  request(app)
    .put(`/api/invites/${invite._id}`)
    .set('Authorization', token)
    .send(invite)
    .expect(httpStatus.OK)
    .then((res) => {
      expect(res.body.name).to.equal('KK')
      expect(res.body.email).to.equal(invite.email)
      done()
    })
    .catch(done)
})

})


//  describe('# GET /api/invites/', () => {
//    it('should get all invites', (done) => {
//      request(app)
//        .get('/api/invites')
//        .expect(httpStatus.OK)
//        .then((res) => {
//          expect(res.body).to.be.an('array')
//          done()
//        })
//        .catch(done)
//    })
//  })

// describe('# DELETE /api/invites/', () => {
//    it('should delete invite', (done) => {
//      request(app)
//        .delete(`/api/invites/${invite._id}`)
//        .expect(httpStatus.OK)
//        .then((res) => {
//          expect(res.body.invitename).to.equal('KK')
//          expect(res.body.mobileNumber).to.equal(invite.mobileNumber)
//          done()
//        })
//        .catch(done)
//    })
// })

*/
