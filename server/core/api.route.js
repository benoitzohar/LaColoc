import express from 'express';
import userRoutes from './user/user.route'

const router = express.Router();

/** GET /api/ping - Check service health */
router.get('/ping', (req, res) =>
  res.send('Pong!')
)

// mount user routes at /users
router.use('/users', userRoutes)

export default router;
