import dotenv from 'dotenv'
import app from '~/app'
import request from 'supertest'

dotenv.config({ path: '.env.test' })

export const getCredentials = async (email = process.env.EMAIL_LOGIN, password = process.env.PASSWORD_LOGIN) => {
  try {
    const response = await request(app)
      .post('/api/v1/auth/sign-in')
      .set('Content-Type', 'application/json')
      .send({ email, password })

    // TODO: Save credentials to file, read from file, etc.
    // If has data and valid => return data
    // Else get new data
    return response.body?.metadata
  } catch (error) {
    console.log(`[getCredentials] Error: ${JSON.stringify(error)}`)
    return false
  }
}
