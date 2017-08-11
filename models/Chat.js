const
  mongoose = require('mongoose'),
  chatSchema = new mongoose.Schema({
    //individual chats
    chatType: {type: String, default: 'text'},
    message: String,
    imgUrl: String,
    //must contain _ as convention
    _user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    senderName: String,
    created: {type: Date, default: Date.now}
  })

  const Chat =  mongoose.model('Chat', chatSchema)
  module.exports = Chat
