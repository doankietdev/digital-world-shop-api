const asyncHandler = (asyncMiddleware) => {
  return (req, res, next) => {
    asyncMiddleware(req, res, next).catch(next)
  }
}

export default asyncHandler
