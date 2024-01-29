/**
 * @param {number} totalElements
 * @param {number} limitPerPage
 * @returns {number}
 */
export const calculateTotalPages = (totalElements, limitPerPage) => {
  return Math.ceil(totalElements / limitPerPage)
}