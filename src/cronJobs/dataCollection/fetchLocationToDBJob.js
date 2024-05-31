import cron from 'node-cron'
import locationService from '~/services/locationService'

const start = () => {
  cron.schedule('0 0 1 * *', () => {
    locationService.fetchLocationToDB()
  })
}

export default { start }