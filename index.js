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
  io = require('socket.io')(httpServer)


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

//Log in route
app.post('/api/authenticate', (req, res) => {
  //find user by email from the request body
  //when retreiving the user from the database, include the password
  User.findOne({email: req.body.email}, '+password', (err, user) => {
      //if no user is found / wrong password
    if(!user || (user && !user.validPassword(req.body.password))) {
      //return success: false and message
      return res.json({success: false, message: "Incorrect email or password"})
    }
    //otherwise, use mongoose document's toObject() method to get a stripped down version of just the user's data
    const userData = user.toObject()
    //delete password from the object before creating the token
    delete userData.password

    //create token, embedding the user's info in the payload of the token
    const token = jwt.sign(userData, process.env.SECRET)

    //send the token back to the client in our response:
    res.json({success: true, message: "Logged in successfully.", token})
  })
})

// any routes declared after this middleware must include a valid token in order access:
app.use(verifyToken)

//all routes will be /api/beers/:id
app.use('/api/chats', chatRoutes)


//Middleware to restrict access.
//user must include a token in their requests to process
function verifyToken(req, res, next) {
  //try to find token in headers:
    const token = req.headers['token']
    //if token exists
    if(token) {
      //verify tokens authenticity
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        //if error authenticating
        if(err) return res.json({success: false, messages: "Token could not be verified."})
        //Otherwise, get user info from decoded token
        //and make it available from the req Object
        req.user = decoded

        next()
      })
    } else {
      //if token not provided in the req headers
      res.json({success: false, message: "No token provided. Access denied."})
    }
}
