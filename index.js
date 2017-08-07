const
  bodyParser = require ('body-parser'),
  ejs = require('ejs'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  passport = require('passport'),
  express = require('express'),
  app = express(),
  httpServer = require('http').Server(app),
  io = require('socket.io')(httpServer),
  PORT = process.env.PORT || 3000

//mongodb
mongoose.connect('mongodb://localhost/ChatrBox')

//socket.io

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg)
  })
})




//server
httpServer.listen(PORT, function(err) {
  console.log(err || `Server running on port ${PORT}`)
})

//view engine
app.set('view engine', 'ejs')


//route
app.get('/', function(req,res) {
  res.render('index')
})

//User routes
