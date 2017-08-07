const
  express = require('express'),
  chatsRouter = new express.Router(),
  Chat = require('../models/Chat.js')

chatsRouter.get('/', (req,res) => {
  Chat.find({_user: req.user._id}, (err, chats) => {
    res.json(chats)
  })
})

chatsRouter.post('/', (req,res) => {
  const newChat = new Chat(req.body)
  newChat._user = req.user._id
  newChat.save((err, chat) => {
    res.json({success: true, message: "New chat created ^_^!", chat})
  })
})

module.exports = chatsRouter
