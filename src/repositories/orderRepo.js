import orderModel from '~/models/orderModel'

const findById = async (id) => {
  return (
    await orderModel.findOne({
      _id: id
    })
  ).toObject({
    virtuals: true
  })
}

export default {
  findById
}
