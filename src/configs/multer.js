import multer from 'multer'

export const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
