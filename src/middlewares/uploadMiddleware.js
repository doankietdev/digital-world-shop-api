import multer from 'multer'
import storage from '~/configs/cloudinaryStorage'

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const uploadMiddleware = multer({
  limits: 500000,
  storage,
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]
    let error = isValid ? null : new Error('Invalid mime type!')
    cb(error, isValid)
  }
})

export default uploadMiddleware
