const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const {app} = require('../../server/server');
const {User} = require('../../server/models/user');
const {ObjectId} = require('mongodb');
const {users,  populateUsers} = require('../seed/seed');

beforeEach(populateUsers);

// GET Requests

describe('GET users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).equal(users[0]._id.toHexString());
      expect(res.body.email).equal(users[0].email);
    })
    .end(done)
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).include({})
    })
    .end(done)
  });
});

// POST Requests

describe('POST /users', () => {

  var password = '12345678'

  it('should create new user when body data valid', (done) => {
    var email = 'asdfghj@gmail.com'
    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).to.exist
      expect(res.body._id).to.exist
      expect(res.body.email).equal(email)
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      User.find().then((users) => {
        expect(users.length).equal(3)
        expect(users[2].email).equal(email)
        expect(users[2].password).to.not.equal(password)
        done();
      })
      .catch((e) => done(e))
    })
  });

  it('should send 400 when body data empty', (done) => {
    request(app)
    .post('/users')
    .send('')
    .expect(400)
    .end(done)
  });

  it('should send 400 when body data invalid', (done) => {
    var email = 'qwerty'
    var password = '1234567'

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done)
  });

  it('should send 400 when email in use', (done) => {
    request(app)
    .post('/users')
    .send({email: users[0].email, password})
    .expect(400)
    .end(done)
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({email: users[0].email, password: users[0].password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).to.exist
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens[1]).include({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e) => done(e))
    });
  });

  it('should send 400 when email user does not exist in db', (done) => {
    var email = 'qwertyq@gmail.com'

    request(app)
    .post('/users/login')
    .send({email, password: users[0].password})
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).to.not.exist
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens[1].length).equal(0)
        done();
      }).catch((e) => done())
    });
  });

  it('should send 400 when request password does not match db password', (done) => {
    var password = '12456789'

    request(app)
    .post('/users/login')
    .send({email: users[0].email, password})
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).to.not.exist
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens[1].length).equal(0)
        done();
      }).catch((e) => done())
    });
  });
});

// DELETE requests

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens[0].token).to.not.exist
        done();
      }).catch((e) => done())
    });
  });
});
