import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '~/configs/cloudinary'

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'digital_world_shop/avatar'
    // allowedFormats: ['jpeg', 'png', 'jpg']
  }
})

export default cloudinaryStorage
