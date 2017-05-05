import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import chai, { expect } from 'chai'
import app from '../../index'

chai.config.includeStack = true

describe('## Express and Routes', () => {
  describe('# GET /', () => {
    it('should return a html index file', done => {
      request(app)
        .get('/')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.text).to.contain('<!doctype html>')
          expect(res.text).to.contain('<html')
          expect(res.text).to.contain('</html>')
          done()
        })
        .catch(done)
    })
  })
})
