import slugify from 'slugify'

export const parseQueryParams = (reqQuery = {}) => {
  const queryObj = { ...reqQuery }
  const excludeFields = [
    '_limit',
    '_sort',
    '_page',
    '_fields'
  ]
  excludeFields.forEach(field => delete queryObj[field])

  let queryString = JSON.stringify(queryObj)
  const query = JSON.parse(queryString.replace(
    /("gt":|"gte":|"lt":|"lte":)/g,
    match => `"$${match.slice(1, match.length - 2)}":`
  ))
  if (query.title) query.title = { $regex: query.title, $options: 'i' }

  let sort = reqQuery._sort ? reqQuery._sort.split(',').join(' ') : 'createdAt'
  const fields = reqQuery._fields && reqQuery._fields.split(',').join(' ')
  const page = reqQuery._page * 1 || 1
  const limit = reqQuery._limit * 1 || 100
  const skip = (page - 1) * limit

  return { query, sort, fields, skip, limit, page }
}

export const generateSlug = (string) => {
  return slugify(`${string}-${Date.now()}`, { lower: true, locale: 'vi', strict: true })
}
