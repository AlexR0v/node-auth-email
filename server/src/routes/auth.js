import { Router } from 'express'
import { forgotPassword, getAllUsers, login, register, resetPassword } from '../controllers/auth.js'
import { protectJWT } from '../middleware/auth.js'

const router = new Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:resetToken').post(resetPassword)
router.route('/get-all-users').get(protectJWT, getAllUsers)

export default router
