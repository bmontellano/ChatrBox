const
  mongoose = require('mongoose'),
  chatSchema = new mongoose.Schema({
    //individual chats
    message: String,
    //must contain _ as convention
    _user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  })

  const Chat =  mongoose.model('chat', chatSchema)
  module.exports = Chat
