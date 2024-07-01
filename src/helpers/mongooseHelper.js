import { typeOf } from '~/utils/util'

const convertMongooseObjectToVanillaObject = (mongooseObject) => {
  if (typeOf(mongooseObject.toObject) === Function.name) {
    return mongooseObject.toObject({ virtuals: true })
  }
  return mongooseObject
}

const convertMongooseArrayToVanillaArray = (mongooseArray = []) => {
  return mongooseArray.map((mongooseObject) =>
    convertMongooseObjectToVanillaObject(mongooseObject)
  )
}

export default {
  convertMongooseObjectToVanillaObject,

  convertMongooseArrayToVanillaArray
}
