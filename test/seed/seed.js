const {ObjectId} = require('mongodb');
const {Todo} = require('../../server/models/todo');
const {User} = require('../../server/models/user');
const jwt = require('jsonwebtoken');
const userOneId = new ObjectId()
const userTwoId = new ObjectId()

const todos = [{
  _id: new ObjectId(),
  text: 'first test todo',
  _creator: userOneId
}, {
  _id: new ObjectId(),
  text: 'second test todo',
  _creator: userTwoId,
  completed: true,
  completedAt: 1234
}];

const users = [{
  _id: userOneId,
  email: 'qwerty@gmail.com',
  password: '12345678',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'qwertyu@gmail.com',
  password: '12345678',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

const populateTodos = (done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done());
};


module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
