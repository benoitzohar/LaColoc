import express from 'express';
import validate from 'express-validation';
import paramValidation from './invite.validation';
import inviteCtrl from './invite.controller';

const router = new express.Router();

router
  .route('/')
  /** GET /api/invites - Get list of invites for current user */
  .get(inviteCtrl.list)
  /** POST /api/invites - Create new invite */
  .post(validate(paramValidation.create), inviteCtrl.create);

/** GET /api/invites/:inviteId/accept - accept invite */
router.get('/:inviteId/accept', inviteCtrl.accept);

router
  .route('/:inviteId')
  /** DELETE /api/invites/:inviteId - Delete invite */
  .delete(inviteCtrl.remove);

/** Load invite when API with inviteId route parameter is hit */
router.param('inviteId', inviteCtrl.load);

export default router;
