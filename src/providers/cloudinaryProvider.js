import cloudinary from '~/configs/cloudinaryStorage'

const uploadSingle = async (file = {}) => {
  const result = await cloudinary.uploader.upload(file.path, { folder: 'digital-shop' })
  if (result) {
    const fs = require('fs')
    fs.unlinkSync(file.path)
    return {
      url: result.secure_url,
      id: result.public_id
    }
  }
}

const uploadMultiple = async (files = []) => {
  const uploadSinglePromises = files.map(file => uploadSingle(file))
  return await Promise.all(uploadSinglePromises)
}

const deleteSingle = async (id) => {
  const { result } = await cloudinary.uploader.destroy(id)
  if (result === 'not found') throw new Error('File not found')
  if (result === 'ok') return result
  throw new Error('Something went wrong')
}

const deleteMultiple = async (ids = []) => {
  const deleteSinglePromises = ids.map(id => deleteSingle(id))
  return await Promise.all(deleteSinglePromises)
}

const resizeImage = (id, h, w) => {
  return cloudinary.url(id, {
    height: h,
    width: w,
    crop: 'scale',
    format: 'jpg'
  })
}

export default {
  uploadSingle,
  uploadMultiple,
  deleteSingle,
  deleteMultiple,
  resizeImage
}
