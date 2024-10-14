import v1Route from './v1'
import v2Route from './v2'

export const route = (app) => {
  app.use('/api/v1', v1Route)
  app.use('/api/v2', v2Route)
}
