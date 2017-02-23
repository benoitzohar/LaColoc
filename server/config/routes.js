import express from 'express'
import path from 'path'

import apiRoutes from '../core/api.route'

const router = express.Router()

/** GET / - Get Client's main entry point html file */
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../../client', 'index.html')));

router.use('/api', apiRoutes)

export default router
