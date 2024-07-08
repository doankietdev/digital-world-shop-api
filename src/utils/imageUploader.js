import multer from 'multer'
import storage from '~/configs/cloudinaryStorage'
import ApiError from './ApiError'
import { StatusCodes } from 'http-status-codes'

const imageUploader = ({
  allowedFileTypes,
  maxFileSize,
  maxFileNumber,
  errorMessage
}) => {
  return multer({
    storage,
    limits: {
      fileSize: maxFileSize
    },
    fileFilter: (req, file, cb) => {
      if (req.files.length > maxFileNumber) {
        return cb(new ApiError(
          StatusCodes.BAD_REQUEST,
          `Maximum ${maxFileNumber} files are allowed to upload!`
        ))
      }
      if (allowedFileTypes.includes(file.mimetype)) {
        return cb(null, true)
      }
      cb(new ApiError(StatusCodes.BAD_REQUEST, errorMessage))
    }
  })
}

export default imageUploader
