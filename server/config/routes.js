import express from 'express'
import path from 'path'
import passport from 'passport'
import User from '../core/user/user.model'

import apiRoutes from '../core/api.route'

const router = express.Router()

/** GET / - Get Client's main entry point html file */
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../../client', 'index.html')));

router.get("/secret", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  res.json({
    message: "Success! You can not see this without a token"
  })
})

router.use('/api', apiRoutes)

export default router
