import express from 'express'
import path from 'path'
import validate from 'express-validation'

import userValidation from '../core/user/user.validation'
import userCtrl from '../core/user/user.controller'
import apiRoutes from '../core/api.route'


const router = express.Router()

/** GET / - Get Client's main entry point html file */
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../../client', 'index.html')));

// auth

/** POST /auth/login - Sign in */
router.post('/auth/login', validate(userValidation.login), userCtrl.login)

// import api routes
router.use('/api', apiRoutes)

export default router
