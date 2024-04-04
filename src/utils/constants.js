export const DEV_ENV = 'development'

export const PROD_ENV = 'production'

export const WHITE_LIST_DOMAINS = ['http://localhost']

export const HEADER_KEYS = {
  USER_ID: 'x-user-id',
  AUTHORIZATION: 'authorization'
}

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
}

export const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed'
}

export const DISCOUNT_APPLY_TYPES = {
  ALL: 'all',
  SPECIFIC: 'specific'
}

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELED: 'canceled'
}

export const PAYMENT_METHODS = {
  COD: 'cod',
  DIGITAL_WALLET: 'digital_wallet'
}

export const COLLECTION_NAMES = {
  USER: 'users',
  TOKEN: 'keyTokens',
  PRODUCT: 'products',
  PRODUCT_CATEGORY: 'categories',
  BLOG: 'blogs',
  DISCOUNT: 'discounts',
  ADDRESS: 'addresses',
  ORDER: 'orders'
}

export const MODEL_NAMES = {
  USER: 'User',
  TOKEN: 'KeyToken',
  PRODUCT: 'Product',
  PRODUCT_CATEGORY: 'Category',
  BLOG: 'Blog',
  DISCOUNT: 'Discount',
  ADDRESS: 'Address',
  ORDER: 'Order'
}
