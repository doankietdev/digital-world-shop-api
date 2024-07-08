import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import imageUploader from '~/utils/imageUploader'

const imageUploadMiddleware = ({ maxFileNumber = 1 }) => {
  return asyncHandler(async (req, res, next) => {
    const upload = imageUploader({
      allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      maxFileSize: 1000000,
      maxFileNumber,
      errorMessage: 'Only .jpeg, .jpg, .png'
    })

    upload.any()(req, res, (error) => {
      if (error) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
      }
      next()
    })
  })
}

export default imageUploadMiddleware