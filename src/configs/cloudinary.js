import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY } from './environment'

cloudinary.config({
  cloud_name: CLOUDINARY.NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
  secure: true
})

export default cloudinary