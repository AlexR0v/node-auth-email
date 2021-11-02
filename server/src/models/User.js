import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import pkg from 'mongoose'

const { model, Schema } = pkg

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Provide a username'],
  },
  email: {
    type: String,
    required: [true, 'Provide a email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Provide a password'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  //const salt = await bcrypt.getSalt('7')
  this.password = await bcrypt.hashSync(this.password, 7)
  next()
})

UserSchema.methods.getSignetToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)
  return resetToken
}

const User = model('User', UserSchema)

export default User
