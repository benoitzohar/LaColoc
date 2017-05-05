import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';

let group;
const group1 = {
  name: 'Group 1',
  description: 'descr',
  currency: '$'
};

describe('# Rights ', () => {
  [
    ['get', '/api/groups'],
    ['post', '/api/groups'],
    ['get', '/api/groups/123'],
    ['post', '/api/groups/123'],
    ['delete', '/api/groups/123']
  ].forEach(([type, route]) => {
    it(`should be secure on [${type}] ${route}`, done => {
      request(app)
        [type](route)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          done();
        })
        .catch(done);
    });
  });
});

describe('# POST /api/groups', () => {
  it('should create a new group', done => {
    request(app)
      .post('/api/groups')
      .send(group1)
      .set('Authorization', token)
      .expect(httpStatus.OK)
      .then(res => {
        expect(res.body.name).to.equal(group1.name);
        expect(res.body.description).to.equal(group1.description);
        expect(res.body.currency).to.equal(group1.currency);
        group = res.body;
        done();
      })
      .catch(done);
  });

  it('should contain the timestamp', done => {
    request(app)
      .post('/api/groups')
      .send(group1)
      .set('Authorization', token)
      .expect(httpStatus.OK)
      .then(res => {
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
        done();
      })
      .catch(done);
  });
});

describe('# GET /api/groups/:groupId', () => {
  it('should get group details', done => {
    request(app)
      .get(`/api/groups/${group._id}`)
      .set('Authorization', token)
      .expect(httpStatus.OK)
      .then(res => {
        expect(res.body.email).to.equal(group.email);
        expect(res.body.name).to.equal(group.name);
        done();
      })
      .catch(done);
  });

  it('should report error with message - Not found, when group does not exists', done => {
    request(app)
      .get('/api/groups/56c787ccc67fc16ccc1a5e92')
      .set('Authorization', token)
      .expect(httpStatus.NOT_FOUND)
      .then(res => {
        expect(res.body.message).to.equal('Not Found');
        done();
      })
      .catch(done);
  });
});

describe('# PUT /api/groups/:groupId', () => {
  it('should update group details', done => {
    group.name = 'KK';
    request(app)
      .put(`/api/groups/${group._id}`)
      .set('Authorization', token)
      .send(group)
      .expect(httpStatus.OK)
      .then(res => {
        expect(res.body.name).to.equal('KK');
        expect(res.body.email).to.equal(group.email);
        done();
      })
      .catch(done);
  });
});

//  describe('# GET /api/groups/', () => {
//    it('should get all groups', (done) => {
//      request(app)
//        .get('/api/groups')
//        .expect(httpStatus.OK)
//        .then((res) => {
//          expect(res.body).to.be.an('array')
//          done()
//        })
//        .catch(done)
//    })
//  })

// describe('# DELETE /api/groups/', () => {
//    it('should delete group', (done) => {
//      request(app)
//        .delete(`/api/groups/${group._id}`)
//        .expect(httpStatus.OK)
//        .then((res) => {
//          expect(res.body.groupname).to.equal('KK')
//          expect(res.body.mobileNumber).to.equal(group.mobileNumber)
//          done()
//        })
//        .catch(done)
//    })
// })
