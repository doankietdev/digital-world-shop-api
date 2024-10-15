import transactionModel from '~/models/transactionModel'

const createNew = async (payload) => {
  return await transactionModel.create(payload)
}

export default {
  createNew
}
