/* eslint-disable no-console */
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { PARTNERS } from '~/configs/environment'
import ApiError from '~/utils/ApiError'
import { PARTNER_APIS } from '~/utils/constants'

const getProvinces = async () => {
  try {
    const response = await axios({
      baseURL: PARTNER_APIS.GHN.API_ROOT,
      url: PARTNER_APIS.GHN.APIS.GET_PROVINCES,
      headers: {
        token: PARTNERS.GHN.TOKEN
      },
      method: 'GET'
    })

    if (response.status === StatusCodes.OK && response.data?.data) {
      return response.data?.data
        .map((province) => ({
          id: province.ProvinceID,
          code: province.Code,
          name: province.ProvinceName,
          nameExtension: province.NameExtension
        }))
        .sort((province1, province2) =>
          province1.name
            .toLocaleLowerCase()
            .localeCompare(province2.name.toLocaleLowerCase())
        )
    }
    throw new Error('Fetch API error')
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

const getDistricts = async (provinceId) => {
  try {
    const response = await axios({
      baseURL: PARTNER_APIS.GHN.API_ROOT,
      url: PARTNER_APIS.GHN.APIS.GET_DISTRICTS,
      params: {
        province_id: provinceId
      },
      headers: {
        token: PARTNERS.GHN.TOKEN
      },
      method: 'GET'
    })

    if (response.status === StatusCodes.OK && response.data?.data) {
      return response.data?.data
        .map((district) => ({
          provinceId: district.ProvinceID,
          id: district.DistrictID,
          code: district.Code,
          name: district.DistrictName,
          nameExtension: district.NameExtension
        }))
        .sort((district1, district2) =>
          district1.name
            .toLocaleLowerCase()
            .localeCompare(district2.name.toLocaleLowerCase())
        )
    }
    throw new Error('Fetch API error')
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

const getWards = async (districtId) => {
  try {
    const response = await axios({
      baseURL: PARTNER_APIS.GHN.API_ROOT,
      url: PARTNER_APIS.GHN.APIS.GET_WARDS,
      params: {
        district_id: districtId
      },
      headers: {
        token: PARTNERS.GHN.TOKEN
      },
      method: 'GET'
    })

    if (response.status === StatusCodes.OK && response.data?.data) {
      return response.data?.data
        .map((ward) => ({
          districtId: ward.DistrictID,
          code: ward.WardCode,
          name: ward.WardName,
          nameExtension: ward.NameExtension
        }))
        .sort((ward1, ward2) =>
          ward1.name
            .toLocaleLowerCase()
            .localeCompare(ward2.name.toLocaleLowerCase())
        )
    }
    throw new Error('Fetch API error')
  } catch (error) {
    console.log(error)
    if (error?.response?.status === StatusCodes.BAD_REQUEST)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Ward not found')
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

const getProvince = async (provinceId) => {
  try {
    const province = (await getProvinces()).find(
      (province) => province.id === provinceId
    )
    if (!province) throw new ApiError(StatusCodes.NOT_FOUND, 'Province not found')
    return province
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw error
  }
}

const getDistrict = async ({ provinceId, districtId }) => {
  try {
    const district = (await getDistricts(provinceId)).find(
      (district) => district.id === districtId
    )
    if (!district) throw new ApiError(StatusCodes.NOT_FOUND, 'District not found')
    return district
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw error
  }
}

const getWard = async ({ districtId, wardCode }) => {
  try {
    const ward = (await getWards(districtId)).find(
      (ward) => ward.code === wardCode
    )
    if (!ward) throw new ApiError(StatusCodes.NOT_FOUND, 'Ward not found')
    return ward
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw error
  }
}

const checkLocation = async ({ provinceId, districtId, wardCode }) => {
  const [provinces, districts, wards] = await Promise.all([
    getProvinces(),
    getDistricts(provinceId),
    getWards(districtId)
  ])
  const isProvinceExist = provinces.some(
    (province) => province.id == provinceId
  )
  const isDistrictExist = districts.some(
    (district) => district.id == districtId
  )
  const isWardExist = wards.some((ward) => ward.code == wardCode)
  if (isProvinceExist && isDistrictExist && isWardExist) {
    return true
  }
  return false
}

export default {
  getProvinces,
  getDistricts,
  getWards,
  getProvince,
  getDistrict,
  getWard,
  checkLocation
}
