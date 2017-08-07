const
  dotenv = require('dotenv').load({silent: true}),
  express = require('express'),
  app = express(),
  ejs = require('ejs'),
  mongoose = require('mongoose'),
  mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/ChatrBox',
  PORT = process.env.PORT || 3000,
  morgan = require('morgan'),
  bodyParser = require ('body-parser'),
  User = require('./models/User.js'),
  jwt = require('jsonwebtoken'),
  cors = require('cors'),
  chatRoutes = require('./routes/chats.js'),
  httpServer = require('http').Server(app),
  io = require('socket.io')(httpServer),
  passport = require('passport')


//mongodb
mongoose.connect(mongoUrl, (err) => {
  console.log(err || "Connected to MongoDB. WHOOP!")
})

//Using CORS, morgan + body-parser
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())

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
app.route('/api/users')
  .get((req, res) => {
    User.find({}, (err, users) => {
      res.json(users)
    })
  })
  .post((req, res) => {
    User.create(req.body, (err, user) => {
      res.json({success: true, message: "User Created", user})
    })
  })

//Updating user
app.route('api/users/:id')
  .get((req, res) => {
    User.findById(req.params.id, (err, user) => {
      res.json(user)
    })
  })
  .patch((req, res) => {
    User.findById(req.params.id, (err, user) => {
      Object.assign(user, req.body)
      user.save((err, updatedUser) => {
        res.json({success: true, message: "User updated.", user: updatedUser})
      })
    })
  })

//all routes will be /api/chats/:id
app.use('/api/chats', chatRoutes)
