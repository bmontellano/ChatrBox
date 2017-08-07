const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: {type: String, select: false},
    //With {...select: false}, passwords won't be included in query searches of users.
  })

//Encrypts passwords when users are created
  userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  }

//CompareSync: compares provided password with encrypted one in DB
  userSchema.methods.validPassword = function(password) {
    if(!password) return false
    return bcrypt.compareSync(password, this.password)
  }

//Encrypts passwords if changed upon update of users
  userSchema.pre('save', function(next) {
    if(!this.isModified('password')) return next()
    this.password = this.generateHash(this.password)
    next()
  }

  module.exports = mongoose.model('User', userSchema)
