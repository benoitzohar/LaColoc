import express from 'express'
import validate from 'express-validation'
import paramValidation from './group.validation'
import groupCtrl from './group.controller'

const router = new express.Router()

router.route('/')
  /** GET /api/groups - Get list of groups */
  .get(groupCtrl.list)

  /** POST /api/groups - Create new group */
  .post(validate(paramValidation.create), groupCtrl.create)


router.route('/:groupId')
  /** GET /api/groups/:groupId - Get group */
  .get(groupCtrl.get)

  /** PUT /api/groups/:groupId - Update group */
  .put(validate(paramValidation.update), groupCtrl.update)

  /** DELETE /api/groups/:groupId - Delete group */
  .delete(groupCtrl.remove)

/** Load group when API with groupId route parameter is hit */
router.param('groupId', groupCtrl.load)

export default router
