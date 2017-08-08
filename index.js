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
  Chat = require('./models/Chat.js'),
  cors = require('cors'),
  chatRoutes = require('./routes/chats.js'),
  httpServer = require('http').Server(app),
  io = require('socket.io')(httpServer),
  ejsLayouts = require('express-ejs-layouts'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  MongoDBStore = require('connect-mongodb-session')(session),
  passport = require('passport'),
  passportConfig = require('./config/passport.js')

//mongodb
mongoose.connect(mongoUrl, (err) => {
  console.log(err || "Connected to MongoDB. WHOOP!")
})

//store session
const store = new MongoDBStore({
  uri: mongoUrl,
  collection: 'sessions'
})

//public folder declaration
app.use(express.static(__dirname + '/public'))


//session + passport
app.use(session({
  secret: 'bananas',
  cookie: {maxAge: 60000000},
  resave: true,
  saveUninitialized: false,
  store: store
}))

app.use(passport.initialize())
app.use(passport.session())


//Use middleware
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//socket.io
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    //save to database
    var newMessage = new Chat({message: msg})
    newMessage.save()
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
