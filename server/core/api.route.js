import express from 'express';
import userRoutes from './user/user.route'
import groupRoutes from './group/group.route'

const router = new express.Router()

/** GET /api/ping - Check service health */
router.get('/ping', (req, res) =>
  res.send('Pong!')
)

// mount user routes at /users
router.use('/users', userRoutes)

// mount group routes at /groups
router.use('/groups', groupRoutes)

export default router;
