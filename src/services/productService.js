import { StatusCodes } from 'http-status-codes'
import productModel from '~/models/productModel'
import ApiError from '~/utils/ApiError'
import { generateSlug, parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'
import productRepo from '~/repositories/productRepo'
import cloudinaryProvider from '~/providers/cloudinaryProvider'

const createNew = async (reqBody) => {
  try {
    return await productModel.create({
      ...reqBody,
      slug: generateSlug(reqBody.title)
    })
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Create new product failed')
  }
}

const getProduct = async (id, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    return await productRepo.getProductApplyDiscount(id, { fields })
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get product failed')
  }
}

const getProducts = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page } = parseQueryParams(reqQuery)
    const [products, totalProducts] = await Promise.all([
      productModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit)
        .populate('category', '-createdAt -updatedAt'),
      productModel.countDocuments()
    ])

    const productsApplyDiscount = await productRepo.convertToProductsApplyDiscount(products)

    return {
      page,
      totalPages: calculateTotalPages(totalProducts, limit),
      totalProducts,
      products: productsApplyDiscount
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get products failed')
  }
}

const updateProduct = async (id, reqBody) => {
  try {
    const updateData = reqBody?.title
      ? {
        ...reqBody,
        slug: generateSlug(reqBody.title)
      }
      : { ...reqBody }
    const foundProduct = await productModel.findById(id)
    if (!foundProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

    const product = await productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    return product
  } catch (error) {
    console.log(error);
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update product failed')
  }
}

const deleteProduct = async (id) => {
  try {
    const product = await productModel.findByIdAndDelete(id)
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    await cloudinaryProvider.deleteMultiple(product.images.map((image) => image.id))
    return product
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update product failed')
  }
}

const rating = async (userId, { productId, star, comment }) => {
  try {
    const foundProduct = await productModel.findById(productId)
    if (!foundProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

    let isRated = false
    const sumStar =
      foundProduct.ratings?.reduce((accumulator, rating) => {
        if (rating.postedBy.equals(userId)) {
          isRated = true
          return accumulator
        }
        return (accumulator += rating.star)
      }, 0) + star

    const numberRatings = foundProduct.ratings?.length
    let averageRatings = isRated ? sumStar / numberRatings : sumStar / numberRatings + 1

    let updatedProduct = null
    if (isRated) {
      updatedProduct = await productModel.findOneAndUpdate(
        { _id: productId, ratings: { $elemMatch: { postedBy: userId } } },
        {
          $set: { 'ratings.$.star': star, 'ratings.$.comment': comment, averageRatings }
        },
        { new: true }
      )
    } else {
      updatedProduct = await productModel.findOneAndUpdate(
        { _id: productId },
        {
          $push: { ratings: { star, comment, postedBy: userId } },
          $set: { averageRatings }
        },
        { new: true }
      )
    }
    if (!updatedProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    return updatedProduct
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Rating failed')
  }
}

const addVariant = async (productId, reqFiles, reqBody) => {
  try {
    const images = await cloudinaryProvider.uploadMultiple(reqFiles)
    const variant = { images, ...reqBody }
    const product = await productModel.findByIdAndUpdate(productId, {
      '$push': { 'variants': variant }
    }, { new: true })
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    return product
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Add variant failed')
  }
}

export default {
  createNew,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  rating,
  addVariant
}
