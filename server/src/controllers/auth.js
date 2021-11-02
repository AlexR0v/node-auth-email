import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import User from '../models/User.js'
import ErrorResponse from '../utils/errorResponse.js'
import { sendEmail } from '../utils/sendEmail.js'

const sendToken = (user, statusCode, res) => {
  const token = user.getSignetToken()
  res.status(statusCode).json({ success: true, token })
}

export const register = async (req, res, next) => {
  const { username, email, password } = req.body
  try {
    const existUser = await User.findOne({ email })
    if (existUser) {
      return next(new ErrorResponse(`User with email ${email} already exist`))
    }
    const user = await User.create({ username, email, password })
    sendToken(user, 201, res)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return next(new ErrorResponse('Email and/or password is required', 400))
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return next(new ErrorResponse(`User with email ${email} not register`, 404))
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return next(new ErrorResponse(`Password incorrect`))
    }
    sendToken(user, 200, res)
  } catch (e) {
    next(e)
  }
}

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return next(new ErrorResponse(`User with email ${email} not register`, 404))
    }

    const resetToken = user.getResetPasswordToken()

    await user.save()

    const resetUrl = `${process.env.CLIENT_URL}/passwordreset/${resetToken}`
    const message = `
      <h1>You have request a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href='${resetUrl}' clicktracking='off'>${resetUrl}</a>
    `
    try {
      await sendEmail({
        to: user.email,
        subject: 'Reset Password',
        text: message,
      })
      res.status(200).json({ success: true, data: 'Email Sent' })
    } catch (e) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save()
      return next(new ErrorResponse('Email not be sent', 500))
    }
  } catch (e) {
    next(e)
  }
}

export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')
  try {
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })

    if (!user) {
      return next(new ErrorResponse('Invalid reset token', 400))
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    res.status(201).json({ success: true, data: 'Password reset success' })
  } catch (e) {
    next(e)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json({ success: true, users })
  } catch (e) {
    next(e)
  }
}
