import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import ErrorResponse from '../utils/errorResponse.js'

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

export const forgotPassword = (req, res, next) => {
  res.send('forgotPassword')
}

export const resetPassword = (req, res, next) => {
  res.send(req.params.resetToken)
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json({ success: true, users })
  } catch (e) {
    next(e)
  }
}
