import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai, {
  expect
} from 'chai'
import app from '../../index'

chai.config.includeStack = true

describe('## Api and Routes', () => {
  describe('# GET /api/ping', () => {
    it('should return Pong!', (done) => {
      request(app)
        .get('/api/ping')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('Pong!')
          done()
        })
        .catch(done)
    })
  })

  describe('# GET /api/404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found')
          done()
        })
        .catch(done)
    })
  })

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
      request(app)
        .get('/api/users/56z787zzz67fc')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error')
          done()
        })
        .catch(done)
    })

    it('should handle express validation error - username is required', (done) => {
      request(app)
        .post('/api/users')
        .send({
          email: 'test@test.test',
          password: 'pwd'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.equal('"name" is required')
          done()
        })
        .catch(done)
    })
  })
})
