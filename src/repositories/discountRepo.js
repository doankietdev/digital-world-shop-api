import { Types } from 'mongoose'
import discountModel from '~/models/discountModel'
import { DISCOUNT_APPLY_TYPES } from '~/utils/constants'

const createQueryByProductIdsStage = (productIds) => ({
  $match: {
    $and: [
      {
        $or: [
          {
            $and: [
              { applyFor: DISCOUNT_APPLY_TYPES.SPECIFIC },
              { products: { $in: productIds.map(productId => new Types.ObjectId(productId)) } }
            ]
          },
          { applyFor: DISCOUNT_APPLY_TYPES.ALL }
        ]
      },
      {
        expireAt: { $gt: new Date() }
      },
      {
        isActive: true
      },
      {
        $or: [
          {
            $expr: { $lt: ['$currentUsage', '$maxUsage'] }
          },
          {
            $and: [{ currentUsage: null }, { maxUsage: null }]
          }
        ]
      }
    ]
  }
})

const findByProductIds = async (productIds = [], select = {}) => {
  const projectStage = {
    $project: select
  }

  return await discountModel.aggregate([
    createQueryByProductIdsStage(productIds),
    projectStage
  ])
}

export default {
  findByProductIds
}
