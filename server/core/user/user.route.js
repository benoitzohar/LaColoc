import express from 'express';
import validate from 'express-validation';
import paramValidation from './user.validation';
import userCtrl from './user.controller';

const router = express.Router();

router.route('/')
  /** GET /api/users - Get list of users */
  //.get(userCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.create), userCtrl.create)

/** POST /api/users/login - Sign in */
router.post('/login', validate(paramValidation.login), userCtrl.login)

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.update), userCtrl.update)

/** DELETE /api/users/:userId - Delete user */
//.delete(userCtrl.remove)

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load)

export default router;
