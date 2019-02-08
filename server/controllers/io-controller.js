
const { generateMessage, generateLocationMessage } = require('../utils/message');
const {isRealString } = require('../utils/validation');

module.exports = (app, io) => {
  app.get('/chat', (req, res) => {
    res.render('../../public/views/chat')
   })

  io.on('connection', (socket) => {

    // SERVER LOGS

    console.log('new user connceted');

    // ___________________________

    // SERVER DISCONNECTED TO CLIENT

    socket.on('disconnect', () => {
      console.log('disconnected from client');
    });

    // ___________________________

    // SERVER EVENT LISTENERS:

    // ___________________________

    // MESSAGE LISTENER

    socket.on('createMessage', (message, callback) => {
      console.log('createMessage', message);
      io.to(message.room).emit('newMessage', generateMessage(message.from, message.text));
      callback(`server and other clients received message: ${ message.text }`);
    });

    // ___________________________

    // LOCATION BUTTON LISTENER

    socket.on('createLocationMessage', (message, callback) => {

      socket.broadcast.to(message.room).emit('newLocationMessage', generateLocationMessage('admin', message.latitude, message.longitude));
      callback(`server and other clients received location: ${ message.text }`);
    })

    // ___________________________

    // ROOM JOIN

    socket.on('join', (params, callback) => {
      if (!isRealString(params['display-name']) || !isRealString(params['room-name'])) {
        callback('display name and room name are required');
      }
      socket.join(params['room-name']);
      socket.emit('newMessage', generateMessage('admin', `hello ${ params['display-name'] }, welcome to the ${ params['room-name'] } chatroom!`))

      socket.broadcast.to(params['room-name']).emit('userInOut', generateMessage('admin', `${ params['display-name'] } joined the chatroom`));
      callback();
    })

    // ___________________________

    // ROOM LEAVE

    socket.on('leaveRoom', (params) => {
      console.log(`${ params['display-name'] } left the ${ params['room-name'] } chatroom`)

      socket.leave(params['room-name'])
      socket.broadcast.to(params['room-name']).emit('userInOut', generateMessage('admin', `${ params['display-name'] } has left this chatroom`));
    });
  })
}
