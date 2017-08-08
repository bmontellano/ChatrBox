const
  express = require('express'),
  passport = require('passport'),
  userRouter = express.Router(),
  flash = require('connect-flash'),
  app = express()


app.use(flash())


  //create session using password
  userRouter.route('/login')
  	.get((req,res) => {
  		res.render('login')
  	})
  	.post(passport.authenticate('local-login', {
  		successRedirect: '/profile',
  		failureRedirect: '/login'
  	}))

    userRouter.route('/signup')
    	.get((req,res) => {
    		// render create account form
    		res.render('signup')
    	})
    	.post(passport.authenticate('local-signup', {
    		successRedirect: '/profile',
    		failureRedirect: '/signup'
    	}))

      userRouter.get('/profile', isLoggedIn, (req,res) => {
      	res.render('profile', {user: req.user})
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
