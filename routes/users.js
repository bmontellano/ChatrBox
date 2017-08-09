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
    userRouter.get('/edituser', isLoggedIn, (req,res) => {
        User.find({}).exec(function(err, users) {
          if (err) throw err;
          users.save(function(err) {
          if (err) return next(err)
          // What's happening in passport's session? Check a specific field...
              console.log("Before relogin: "+req.session.passport.user.changedField)
              req.login(user, function(err) {
                if (err) return next(err)
                console.log("After relogin: "+req.session.passport.user.changedField)
                res.send(200)
            })
          })
        })
      })



    //show profile
    userRouter.get('/profile', isLoggedIn, (req, res) => {
    	res.render('profile', {user: req.user})
    })


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
  	res.redirect('/')
  }

  module.exports = userRouter
