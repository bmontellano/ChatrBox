const
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('../models/User.js'),
  flash = require('connect-flash')

  passport.serializeUser((user,done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  //Local signup
  passport.use('local-signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, (req, email, password, done) => {
	User.findOne({'local.email': email}, (err, user) => {
		if(err) return done(err)
		if(user) return done(null, false, req.flash('signupMessage', 'That email is taken.'))
		var newUser = new User({local: req.body})
		newUser.save((err) => {
			if(err) throw err
			return done(null, newUser, null)
		})
	})
}))

//Local Signin
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({'local.email':email}, (err, user) => {
    if(err) return done(err)
    if(!user) return done(null, false, req.flash('loginMessage', 'No user found...'))
    // if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Wrong Password.'))
    if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Wrong Password!!!!.'))
    return done(null, user)
  })
}))

module.exports = passport
