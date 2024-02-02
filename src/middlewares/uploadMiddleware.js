import multer from 'multer'
import { diskStorage } from '~/configs/multer'

const uploadMiddleware = multer({ storage: diskStorage })

export default uploadMiddleware
