import v1Route from './v1'

export const route = (app) => {
  app.use('/api/v1', v1Route)
}
