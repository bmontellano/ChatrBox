const
  express = require('express'),
  passport = require('passport'),
  userRouter = express.Router(),
  User = require('../models/User.js')


  //create session using password
  userRouter.route('/login')
  	.get((req,res) => {
  		res.render('login')
  	})
  	.post(passport.authenticate('local-login', {
  		successRedirect: '/',
  		failureRedirect: '/login'
  	}))

    userRouter.route('/signup')
    	.get((req,res) => {
    		// render create account form
    		res.render('signup')
    	})
    	.post(passport.authenticate('local-signup', {
    		successRedirect: '/',
    		failureRedirect: '/signup'
    	}))

      // edit user


      //show profile
      userRouter.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile', {user: req.user})
      })

      userRouter.post('/updateprofile', isLoggedIn, function(req, res) {
        User.findById(req.user._id, (err, user) => {
          Object.assign(user, {local: req.body})
          user.save((err, updatedUser) => {
            res.redirect('/profile')
          })
        })
      });



    userRouter.get('/', isLoggedIn, (req, res) => {
      User.find({}).exec(function(err, users) {
        if (err) throw err;
        res.render('index.ejs', {"users": users})
      })
    })

    userRouter.get('/logout', (req,res) => {
    	req.logout()
    	res.redirect('/')
    })

  // a method used to authorize a user BEFORE allowing them to proceed to the profile page:
  function isLoggedIn(req, res, next){
  	if(req.isAuthenticated()) return next()
  	res.redirect('/login')
  }

  module.exports = userRouter
