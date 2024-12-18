import { StatusCodes } from 'http-status-codes'
import productModel from '~/models/productModel'
import cloudinaryProvider from '~/providers/cloudinaryProvider'
import productRepo from '~/repositories/productRepo'
import ApiError from '~/utils/ApiError'
import { generateSlug, parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages, convertCurrency } from '~/utils/util'
import currencyService from './currencyService'

const createNew = async (reqBody, reqFile) => {
  try {
    let thumb = null
    if (reqFile) {
      thumb = await cloudinaryProvider.uploadSingle(reqFile)
    }
    return await productModel.create({
      ...reqBody,
      slug: generateSlug(reqBody.title),
      thumb
    })
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Create new product failed'
    )
  }
}

const getProduct = async (id, reqQuery = {}) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const foundProduct = await productModel.findOne({
      _id: id
    })
    if (!foundProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    return await productRepo.getProductApplyDiscount(foundProduct._id, {
      fields
    })
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get product failed')
  }
}

const getProductBySlug = async (slug, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)
    const foundProduct = await productModel.findOne({
      slug
    })
    if (!foundProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    return await productRepo.getProductApplyDiscount(foundProduct._id, {
      fields
    })
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get product failed')
  }
}

const getProducts = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page, currency } =
      parseQueryParams(reqQuery)

    const productQuery = {
      ...query,
      $and: query?.specs?.map((spec) => ({
        'specs.k': spec.k,
        'specs.v': { $in: spec?.v?.map((vItem) => parseInt(vItem)) }
      })) ?? [{}]
    }
    delete productQuery.specs

    const [products, totalProducts] = await Promise.all([
      productModel
        .find(productQuery)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit)
        .populate('category', '-createdAt -updatedAt')
        .populate('brand', '-description -createdAt -updatedAt'),
      productModel.find(productQuery).countDocuments()
    ])

    let productsApplyDiscount =
      await productRepo.convertToProductsApplyDiscount(products)

    const exchangeRate = await currencyService.getExchangeRate(currency)

    productsApplyDiscount = productsApplyDiscount.map(product => {
      if (exchangeRate) {
        return {
          ...product,
          price: convertCurrency(product.price, exchangeRate),
          oldPrice: convertCurrency(product.oldPrice, exchangeRate),
          basePrice: product.price,
          baseOldPrice: product.oldPrice
        }
      }
      return {
        ...product,
        basePrice: product.price,
        baseOldPrice: product.oldPrice
      }
    })


    return {
      page,
      limit,
      totalPages: calculateTotalPages(totalProducts, limit),
      totalProducts: products.length ? totalProducts : 0,
      products: productsApplyDiscount
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
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
    if (!foundProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

    const product = await productModel.findByIdAndUpdate(id, updateData, {
      new: true
    })
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    return product
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Update product failed'
    )
  }
}

const uploadThumb = async (id, reqFile) => {
  try {
    const foundProduct = await productModel.findById(id)
    if (!foundProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

    if (foundProduct.thumb) {
      await cloudinaryProvider.deleteSingle(foundProduct.thumb?.id)
    }

    const thumb = await cloudinaryProvider.uploadSingle(reqFile)

    const { acknowledged } = await productModel.updateOne(
      {
        _id: id
      },
      {
        thumb
      }
    )
    if (!acknowledged)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    return thumb
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Upload thumbnail of product failed'
    )
  }
}

const deleteThumb = async (id) => {
  try {
    const foundProduct = await productModel.findById(id)
    if (!foundProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

    if (foundProduct.thumb) {
      await cloudinaryProvider.deleteSingle(foundProduct.thumb?.id)
    }

    const { acknowledged } = await productModel.updateOne(
      {
        _id: id
      },
      {
        thumb: null
      }
    )
    if (!acknowledged)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Upload thumbnail of product failed'
    )
  }
}

const deleteProduct = async (id) => {
  try {
    const product = await productModel.findByIdAndDelete(id)
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    await cloudinaryProvider.deleteMultiple(
      product.images.map((image) => image.id)
    )
    return product
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Update product failed'
    )
  }
}

const rating = async (userId, { productId, star, comment }) => {
  try {
    const foundProduct = await productModel.findById(productId)
    if (!foundProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

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
    let averageRatings = isRated
      ? sumStar / numberRatings
      : sumStar / numberRatings + 1

    let updatedProduct = null
    if (isRated) {
      updatedProduct = await productModel.findOneAndUpdate(
        { _id: productId, ratings: { $elemMatch: { postedBy: userId } } },
        {
          $set: {
            'ratings.$.star': star,
            'ratings.$.comment': comment,
            averageRatings
          }
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
    if (!updatedProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    return updatedProduct
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Rating failed')
  }
}

const addVariant = async (productId, reqFiles, reqBody) => {
  try {
    const images = await cloudinaryProvider.uploadMultiple(reqFiles)
    const variant = { images, ...reqBody }
    const product = await productModel.findByIdAndUpdate(
      productId,
      {
        $push: { variants: variant }
      },
      { new: true }
    )
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    return product
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Add variant failed')
  }
}

const editVariant = async (productId, variantId, reqFiles, reqBody) => {
  try {
    const { name, quantity, deletedImageIds } = reqBody || {}
    const foundProduct = await productModel.findOne({
      _id: productId,
      variants: { $elemMatch: { _id: variantId } }
    })
    if (!foundProduct)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product or variant not found')

    let uploadedImages = []
    if (deletedImageIds?.length) {
      await cloudinaryProvider.deleteMultiple(deletedImageIds)
    } else if (reqFiles?.length) {
      uploadedImages = await cloudinaryProvider.uploadMultiple(reqFiles)
    }

    // default value at case: no upload images
    let query = {
      _id: productId,
      variants: { $elemMatch: { _id: variantId } }
    }
    let updateData = {
      $set: { 'variants.$.name': name, 'variants.$.quantity': quantity }
    }
    if (uploadedImages.length) {
      updateData = {
        ...updateData,
        $push: { 'variants.$.images': { $each: uploadedImages } }
      }
    }

    const product = await productModel.findOneAndUpdate(query, updateData, {
      new: true
    })
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

    if (deletedImageIds?.length) {
      const variant = product.variants.find((variant) =>
        variant._id.equals(variantId)
      )
      if (variant) {
        variant.images = variant?.images.filter(
          (image) => !deletedImageIds.includes(image.id)
        )
        await product.save()
      }
    }

    return product
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Edit variant failed')
  }
}

const deleteVariant = async (productId, variantId) => {
  try {
    const product = await productModel.findOneAndUpdate(
      {
        _id: productId,
        variants: { $elemMatch: { _id: variantId } }
      },
      {
        $pull: { variants: { _id: variantId } }
      },
      { new: true }
    )
    if (!product)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product or variant not found')
    return product
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Add variant failed')
  }
}

const search = async (reqQuery) => {
  const { query, sort, fields, skip, limit, page } =
      parseQueryParams(reqQuery)

  const productQuery = {
    ...query,
    $text: { $search: query.q }
  }
  delete productQuery.q

  const [products, totalProducts] = await Promise.all([
    productModel
      .find(productQuery)
      .sort(sort)
      .select(fields)
      .skip(skip)
      .limit(limit)
      .populate('category', '-createdAt -updatedAt')
      .populate('brand', '-description -createdAt -updatedAt'),
    productModel.find(productQuery).countDocuments()
  ])

  const productsApplyDiscount =
      await productRepo.convertToProductsApplyDiscount(products)

  return {
    page,
    limit,
    totalPages: calculateTotalPages(totalProducts, limit),
    totalProducts: products.length ? totalProducts : 0,
    products: productsApplyDiscount
  }
}

export default {
  createNew,
  getProduct,
  getProductBySlug,
  getProducts,
  updateProduct,
  uploadThumb,
  deleteThumb,
  deleteProduct,
  rating,
  addVariant,
  editVariant,
  deleteVariant,
  search
}
