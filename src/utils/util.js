import { cloneDeep } from 'lodash'

/**
 * @param {number} totalElements
 * @param {number} limitPerPage
 * @returns {number}
 */
export const calculateTotalPages = (totalElements, limitPerPage) => {
  return Math.abs(Math.ceil(totalElements / limitPerPage)) || 1
}

export const getObjectByFields = (obj, fields = []) => {
  const cloneObj = cloneDeep(obj)
  const responseObj = {}
  Object.keys(cloneObj).forEach((key) => {
    if (fields.includes(key)) {
      responseObj[key] = cloneObj[key]
    }
  })
  return responseObj
}

export const typeOf = (value) => Object.prototype.toString.call(value).slice(8, -1)
