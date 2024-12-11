import productModel from '~/models/productModel'
import productRepo from '~/repositories/productRepo'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages, convertCurrency } from '~/utils/util'
import currencyService from './currencyService'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { BIG_DISCOUNTS_PRICE_CONDITION } from '~/utils/constants'

const getProductBySlug = async (slug, reqQuery) => {
  const { fields, _currency } = parseQueryParams(reqQuery)
  const foundProduct = await productModel.findOne({
    slug
  })
  if (!foundProduct)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

  const productApplyDiscount = await productRepo.getProductApplyDiscount(foundProduct._id, {
    fields
  })

  const exchangeRate = await currencyService.getExchangeRate(_currency)

  if (exchangeRate) {
    return {
      ...productApplyDiscount,
      price: convertCurrency(productApplyDiscount.price, exchangeRate),
      oldPrice: convertCurrency(productApplyDiscount.oldPrice, exchangeRate),
      basePrice: productApplyDiscount.price,
      baseOldPrice: productApplyDiscount.oldPrice
    }
  }
  return {
    ...productApplyDiscount,
    basePrice: productApplyDiscount.price,
    baseOldPrice: productApplyDiscount.oldPrice
  }
}

const getProduct = async (id, reqQuery = {}) => {
  const { fields, _currency } = parseQueryParams(reqQuery)
  const foundProduct = await productModel.findOne({
    _id: id
  })
  if (!foundProduct)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

  const productApplyDiscount = await productRepo.getProductApplyDiscount(foundProduct._id, {
    fields
  })

  const exchangeRate = await currencyService.getExchangeRate(_currency)

  if (exchangeRate) {
    return {
      ...productApplyDiscount,
      price: convertCurrency(productApplyDiscount.price, exchangeRate),
      oldPrice: convertCurrency(productApplyDiscount.oldPrice, exchangeRate),
      basePrice: productApplyDiscount.price,
      baseOldPrice: productApplyDiscount.oldPrice
    }
  }
  return {
    ...productApplyDiscount,
    basePrice: productApplyDiscount.price,
    baseOldPrice: productApplyDiscount.oldPrice
  }
}

const getProducts = async (reqQuery) => {
  const { query, sort, fields, skip, limit, page, _currency } =
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

  const exchangeRate = await currencyService.getExchangeRate(_currency)

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
}

const getBigDiscountProducts = async (reqQuery) => {
  const { query, sort, fields, skip, limit, page, _currency } =
    parseQueryParams(reqQuery)

  const productQuery = {
    ...query,
    $and: query?.specs?.map((spec) => ({
      'specs.k': spec.k,
      'specs.v': { $in: spec?.v?.map((vItem) => parseInt(vItem)) }
    })) ?? [{}]
  }
  delete productQuery.specs

  const products = await productModel
    .find(productQuery)
    .sort(sort)
    .select(fields)
    .skip(skip)
    .limit(limit)
    .populate('category', '-createdAt -updatedAt')
    .populate('brand', '-description -createdAt -updatedAt')

  let productsApplyDiscount =
    await productRepo.convertToProductsApplyDiscount(products)

  let bigDiscountProducts = productsApplyDiscount.filter(
    ({ oldPrice, price }) => {
      return oldPrice - price >= BIG_DISCOUNTS_PRICE_CONDITION
    }
  )
  // sort by descending
  bigDiscountProducts = bigDiscountProducts.sort(
    (prevProduct, nextProduct) =>
      (nextProduct.oldPrice - nextProduct.price) > (prevProduct.oldPrice - prevProduct.price)
  )

  const exchangeRate = await currencyService.getExchangeRate(_currency)

  bigDiscountProducts = bigDiscountProducts.map(product => {
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

  const totalBigDiscountProducts = bigDiscountProducts.length

  return {
    page,
    limit,
    totalPages: calculateTotalPages(totalBigDiscountProducts, limit),
    totalProducts: bigDiscountProducts.length ? totalBigDiscountProducts : 0,
    products: bigDiscountProducts.slice(skip, skip + limit)
  }
}

const search = async (reqQuery) => {
  const { query, sort, fields, skip, limit, page, _currency } =
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

  let productsApplyDiscount =
      await productRepo.convertToProductsApplyDiscount(products)

  const exchangeRate = await currencyService.getExchangeRate(_currency)

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
}

export default {
  getProductBySlug,
  getProduct,
  getProducts,
  getBigDiscountProducts,
  search
}