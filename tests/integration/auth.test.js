import request from 'supertest'
import app from '~/app'
import userModel from '~/models/userModel'

describe('Auth API', () => {
  const MOCK_USER_INFO = {
    firstName: 'Test',
    lastName: 'Integration',
    email: 'test@gmail.com',
    password: 'test@123'
  }

  it('should sign up successfully', async () => {
    const response = await request(app)
      .post('/api/v1/auth/sign-up')
      .set('Content-Type', 'application/json')
      .send(MOCK_USER_INFO)

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      statusCode: 201,
      message: `An email has been sent to ${MOCK_USER_INFO.email}. Please check and verify your account before sign in!`,
      metadata: {
        email: MOCK_USER_INFO.email,
        token: expect.any(String)
      }
    })

    const email = response.body?.metadata?.email
    const token = response.body?.metadata?.token

    const verificationResponse = await request(app)
      .post('/api/v1/auth/verify-account')
      .set('Content-Type', 'application/json')
      .send({
        email,
        token
      })

    expect(verificationResponse.status).toBe(200)
    expect(verificationResponse.body).toEqual({
      statusCode: 200,
      message: 'Account verified successfully! Now you can sign in to buy our products! Have a good day!',
      metadata: {
        email: email
      }
    })
  })

  it('should sign in successfully', async () => {
    const response = await request(app)
      .post('/api/v1/auth/sign-in')
      .set('Content-Type', 'application/json')
      .send({
        email: MOCK_USER_INFO.email,
        password: MOCK_USER_INFO.password
      })
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      statusCode: 200,
      message: 'Sign in successfully',
      metadata: {
        user: expect.objectContaining({
          _id: expect.any(String),
          firstName: MOCK_USER_INFO.firstName,
          lastName: MOCK_USER_INFO.lastName,
          email: MOCK_USER_INFO.email,
          addresses: expect.any(Array)
        }),
        clientId: expect.any(String),
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      }
    })
  })

  // Add more tests as needed
  it('should sign out successfully', async () => {
    const response = await request(app)
      .delete('/api/v1/auth/sign-out')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${global.accessToken}`)
      .set('X-Client-Id', global.clientId)
      .set('X-User-Id', global.user?._id)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      statusCode: 200,
      message: 'Sign out successfully'
    })
  })

  afterAll(async () => {
    await userModel.deleteOne({ email: MOCK_USER_INFO.email })
  })
})
