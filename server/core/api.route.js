import express from 'express';
import passport from '../config/passport'
import userRoutes from './user/user.route'
import groupRoutes from './group/group.route'
import inviteRoutes from './invite/invite.route'

const router = new express.Router()

/** GET /api/ping - Check service health */
router.get('/ping', (req, res) =>
  res.send('Pong!')
)

// mount user routes at /users
router.use('/users', userRoutes)

// mount group routes at /groups
router.use('/groups', passport.auth(), groupRoutes)

// mount group invites at /invites
router.use('/invites', passport.auth(), inviteRoutes)

export default router;
