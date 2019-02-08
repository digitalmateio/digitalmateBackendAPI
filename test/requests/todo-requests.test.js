const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const {app} = require('../../server/server');
const {Todo} = require('../../server/models/todo');
const {ObjectId} = require('mongodb');
const {todos, users, populateTodos} = require('../seed/seed');
const firstTodoId = todos[0]._id.toHexString();
const secondTodoId = todos[1]._id.toHexString();
const notFound = new ObjectId().toHexString();
const invalidId = '12345678'

beforeEach(populateTodos);

// GET Requests

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).equal(1)
    })
    .end(done)
  });
});

describe('GET /todos/:id', () => {
  it('should return todo when ID is valid', (done) => {
    request(app)
    .get(`/todos/${firstTodoId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).equal('first test todo')
    })
    .end(done);
  });

  it('should not return todo created by other user', (done) => {
    request(app)
    .get(`/todos/${secondTodoId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/${notFound}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('should return 404 object ID is invalid', (done) => {
    request(app)
    .get(`/todos/${invalidId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });
});

// POST Requests

describe('POST/todos', () => {
  it('should create new todo', (done) => {
    var text = 'test todo text'

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).include('test todo text')
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).equal(1);
        expect(todos[0].text).equal(text)
        done();
      }).catch((e) => done(e));
    });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send('')
    .expect(400)
    .expect((res) => {
      expect(res.body._message).equal('Todo validation failed')
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      Todo.find().then((todos) => {
        expect(todos.length).equal(2)
        done();
      }).catch((e) => done(e));
    });
  });
});

// PATCH Requests

describe('PATCH /todos/:id', () => {
  var updateText = 'update'

  it('should update a todo', (done) => {
    request(app)
    .patch(`/todos/${firstTodoId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({
      completed: true,
      text: updateText
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).include('update');
      expect(res.body.todo.completed).to.equal(true);
      expect(res.body.todo.completedAt).to.be.a('number');
    })
    .end(done)
  });

  it('should not update a todo created by other user', (done) => {
    request(app)
    .patch(`/todos/${firstTodoId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      completed: true,
      text: updateText
    })
    .expect(404)
    .end((err, res) => {
      if (err) {
        done(err);
      }
    })
    Todo.findById(firstTodoId).then((todo) => {
      expect(todo).to.exist
      done();
    }).catch((e) => done(e))
  });

  it('should clear completed at when todo not completed', (done) => {
    request(app)
    .patch(`/todos/${secondTodoId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      text: updateText,
      completed: false
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).include('update')
      expect(res.body.todo.completed).to.equal(false)
      expect(res.body.todo.completedAt).to.not.exist
    })
    .end(done)
  });

  it('should return 404 when todo does not exist', (done) => {
    request(app)
    .patch(`/todos/${notFound}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('should return 404 when id invalid', (done) => {
    request(app)
    .patch(`/todos/${invalidId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect((a) => {

    })
    .expect(404)
    .end(done)
  });
});

// DELETE Requests

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    request(app)
    .delete(`/todos/${firstTodoId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).equal(firstTodoId)
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.findById(firstTodoId).then((todo) => {
        expect(todo).to.not.exist
      }).catch((e) => done(e))
      done();
    })
  });

  it('should remove a todo created by other user', (done) => {
    request(app)
    .delete(`/todos/${secondTodoId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.findById(firstTodoId).then((todo) => {
        expect(todo).to.exist
      }).catch((e) => done(e))
      done();
    })
  });

  it('should return 404 when todo not found', (done) => {
    request(app)
    .delete(`/todos/${notFound}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('should return 404 when id not valid', (done) => {
    request(app)
    .delete(`/todos/${invalidId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });
});
