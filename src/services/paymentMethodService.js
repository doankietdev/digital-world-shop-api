import paymentMethodModel from '~/models/paymentMethodModel'

const createNew = async (payload) => {
  return await paymentMethodModel.create(payload)
}

export default {
  createNew
}