const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  userSchema = new mongoose.Schema({
    local: {
        name: String,
        email: String,
        password: {type: String}
        //With {...select: false}, passwords won't be included in query searches of users.
      }
  })

//Encrypts passwords when users are created
  userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  }

//CompareSync: compares provided password with encrypted one in DB
  userSchema.methods.validPassword = function(password) {
    if(!password) return false
    return bcrypt.compareSync(password, this.local.password)
  }

// Encrypts passwords if changed upon update of users
  // userSchema.pre('save', function(next) {
  //   if(!this.isModified('local.password')) return next()
  //   this.local.password = this.generateHash(this.local.password)
  //   next()
  // })

const User = mongoose.model('User', userSchema)
  module.exports = User
