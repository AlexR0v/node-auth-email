import { Router } from 'express'
import { getPrivateData } from '../controllers/private.js'
import { protectJWT } from '../middleware/auth.js'

const router = new Router()
router.route('/').get(protectJWT, getPrivateData)

export default router
