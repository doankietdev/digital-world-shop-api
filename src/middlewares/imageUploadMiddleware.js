import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import imageUploader from '~/utils/imageUploader'
import { APP } from '~/configs/environment'

const imageUploadMiddleware = ({ maxFileNumber = 1 }) => {
  return asyncHandler(async (req, res, next) => {
    const upload = imageUploader({
      allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      maxFileSize: APP.MAX_AVATAR_SIZE,
      maxFileNumber,
      errorMessage: 'Only .jpeg, .jpg, .png'
    })

    upload.any()(req, res, (error) => {
      if (error) {
        return next(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            error.code === 'LIMIT_FILE_SIZE' ? `Maximum image size is: ${APP.MAX_AVATAR_SIZE} bytes` : error.message)
        )
      }
      next()
    })
  })
}

export default imageUploadMiddleware