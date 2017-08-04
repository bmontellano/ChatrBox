const
  bodyParser = require ('body-parser'),
  ejs = require('ejs'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  passport = require('passport'),
  express = require('express'),
  app = express(),
  httpServer = require('http').Server(app),
  socketServer = require('socket.io')(httpServer),
  PORT = process.env.PORT || 3000

mongoose.connect('mongodb://localhost/ChatrBox')

httpServer.listen(PORT, function(err) {
  console.log(err || `Server running on port ${PORT}`)
})
  
app.set('view engine', 'ejs')

app.get('/', function(req,res) {
  console.log('====================')
  console.log('HI IM STARTING')
  console.log('====================')
  res.render('index')
})
