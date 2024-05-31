/* eslint-disable no-console */
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import config from '~/configs/config.json'
import districtModel from '~/models/districtModel'
import provinceModel from '~/models/provinceModel'
import wardModel from '~/models/wardModel'
import ApiError from '~/utils/ApiError'
import { parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'

const fetchProvincesToDB = async () => {
  const { viettelPost } = config.partners
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    await provinceModel.deleteMany()
    const response = await axios({
      baseURL: viettelPost.apiRoot,
      url: viettelPost.services.getProvinces.api,
      method: viettelPost.services.getProvinces.method,
      params: {
        provinceId: -1
      }
    })
    if (response.status === StatusCodes.OK && response.data?.data) {
      const insertOperations = response.data?.data.map((province) => ({
        insertOne: {
          document: {
            _id: province.PROVINCE_ID,
            code: province.PROVINCE_CODE,
            name: province.PROVINCE_NAME
          }
        }
      }))
      await provinceModel.bulkWrite(insertOperations, { session })
      await session.commitTransaction()
      await session.endSession()
    }
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}

const fetchDistrictsToDB = async () => {
  const { viettelPost } = config.partners
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    await districtModel.deleteMany()
    const response = await axios({
      baseURL: viettelPost.apiRoot,
      url: viettelPost.services.getDistricts.api,
      method: viettelPost.services.getDistricts.method,
      params: {
        provinceId: -1
      }
    })
    if (response.status === StatusCodes.OK && response.data?.data) {
      const insertOperations = response.data?.data.map((district) => ({
        insertOne: {
          document: {
            _id: district.DISTRICT_ID,
            provinceId: district.PROVINCE_ID,
            code: district.DISTRICT_VALUE,
            name: district.DISTRICT_NAME
          }
        }
      }))
      await districtModel.bulkWrite(insertOperations, { session })
      await session.commitTransaction()
      await session.endSession()
    }
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}

const fetchWardsToDB = async () => {
  const { viettelPost } = config.partners
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    await wardModel.deleteMany()
    const response = await axios({
      baseURL: viettelPost.apiRoot,
      url: viettelPost.services.getWards.api,
      method: viettelPost.services.getDistricts.method,
      params: {
        districtId: -1
      }
    })
    if (response.status === StatusCodes.OK && response.data?.data) {
      const insertOperations = response.data?.data.map((ward) => ({
        insertOne: {
          document: {
            _id: ward.WARDS_ID,
            districtId: ward.DISTRICT_ID,
            name: ward.WARDS_NAME
          }
        }
      }))
      await wardModel.bulkWrite(insertOperations, { session })
      await session.commitTransaction()
      await session.endSession()
    }
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}

const fetchLocationToDB = async () => {
  try {
    console.log('Fetching location to database')
    await fetchProvincesToDB()
    await fetchDistrictsToDB()
    await fetchWardsToDB()
    console.log('Fetched location to successfully')
  } catch (error) {
    console.error('Fetched location to failed:: ', error)
  }
}

const getProvinces = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page } =
      parseQueryParams(reqQuery)

    const [provinces, totalProvinces] = await Promise.all([
      await provinceModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit === -1 ? 0 : limit),
      await provinceModel.find(query).countDocuments()
    ])

    return {
      page,
      limit,
      totalPages: calculateTotalPages(totalProvinces, limit),
      totalItems: totalProvinces,
      items: provinces
    }
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong')
  }
}

const getDistricts = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page } =
      parseQueryParams(reqQuery)

    const [districts, totalDistricts] = await Promise.all([
      await districtModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit === -1 ? 0 : limit),
      await districtModel.find(query).countDocuments()
    ])

    return {
      page,
      limit,
      totalPages: calculateTotalPages(totalDistricts, limit),
      totalItems: totalDistricts,
      items: districts
    }
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong')
  }
}


const getWards = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page } =
      parseQueryParams(reqQuery)

    const [wards, totalWards] = await Promise.all([
      await wardModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit === -1 ? 0 : limit),
      await wardModel.find(query).countDocuments()
    ])

    return {
      page,
      limit,
      totalPages: calculateTotalPages(totalWards, limit),
      totalItems: totalWards,
      items: wards
    }
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong')
  }
}


export default {
  fetchLocationToDB,
  getProvinces,
  getDistricts,
  getWards
}
