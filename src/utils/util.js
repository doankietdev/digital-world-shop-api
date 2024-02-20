import { cloneDeep } from 'lodash'

/**
 * @param {number} totalElements
 * @param {number} limitPerPage
 * @returns {number}
 */
export const calculateTotalPages = (totalElements, limitPerPage) => {
  return Math.ceil(totalElements / limitPerPage)
}

export const getObjectByFields = (obj, fields = []) => {
  const cloneObj = cloneDeep(obj)
  const responseObj = {}
  Object.keys(cloneObj).forEach(key => {
    if (fields.includes(key)) {
      responseObj[key] = cloneObj[key]
    }
  })
  return responseObj
}
