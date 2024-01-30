import express from 'express'
import blogValidation from '~/validations/blogValidation'
import blogController from '~/controllers/blogController'
import authMiddleware from '~/middlewares/authMiddleware'
import { ROLES } from '~/utils/constants'

const router = express.Router()

router.route('/:id')
  .get(blogValidation.getBlog, blogController.getBlog)

router.route('/')
  .get(blogController.getBlogs)

router.use(authMiddleware.authenticate)

router.route('/like/:id')
  .patch(blogValidation.like, blogController.like)
router.route('/dislike/:id')
  .patch(blogValidation.dislike, blogController.dislike)

router.route('/:id')
  .patch(
    authMiddleware.checkPermission(ROLES.ADMIN),
    blogValidation.updateBlog,
    blogController.updateBlog
  )
  .delete(
    authMiddleware.checkPermission(ROLES.ADMIN),
    blogValidation.deleteBlog,
    blogController.deleteBlog
  )

router.route('/')
  .post(
    authMiddleware.checkPermission(ROLES.ADMIN),
    blogValidation.createNew,
    blogController.createNew
  )

export default router
