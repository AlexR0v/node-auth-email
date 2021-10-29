import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import ErrorResponse from '../utils/errorResponse.js'

export const protectJWT = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 403))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      return next(new ErrorResponse('User not found', 404))
    }
    req.user = user
    next()
  } catch (e) {
    next(new ErrorResponse(e.message, 500))
  }
}
