import express from 'express';
import validate from 'express-validation';
import passport from '../../config/passport';

import paramValidation from './user.validation';
import userCtrl from './user.controller';
import userRight from './user.right';

const router = new express.Router();

router
  .route('/')
  /** POST /api/users - Create new user */
  .post(validate(paramValidation.create), userCtrl.create);

/** POST /api/users/login - Sign in */
router.post('/login', validate(paramValidation.login), userCtrl.login);

router
  .route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(passport.auth(), userRight.current, userCtrl.get)
  /** PUT /api/users/:userId - Update user */
  .put(
    passport.auth(),
    userRight.current,
    validate(paramValidation.update),
    userCtrl.update
  )
  /** DELETE /api/users/:userId - Delete user */
  .delete(passport.auth(), userRight.current, userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;
