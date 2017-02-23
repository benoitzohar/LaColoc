import express from 'express'
import userRoutes from '../core/user/user.route'

const router = express.Router()

/** GET /ping - Check service health */
router.get('/ping', (req, res) =>
  res.send('Pong!')
);

// mount user routes at /users
router.use('/users', userRoutes);

export default router;
