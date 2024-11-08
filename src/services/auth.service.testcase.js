import { StatusCodes } from 'http-status-codes'
import { dataSignIn } from '~/mockData/data.test.mock'
import ApiError from '~/utils/ApiError'

export const signUpTestCases = [
  {
    description: 'Should sign up failed - error: email is already in use',
    input: {
      firstName: 'A',
      lastName: 'Nguyen Van',
      email: 'nguyenvana@gmail.com',
      password: 'Test@123'
    },
    expectedError: new ApiError(
      StatusCodes.CONFLICT,
      'The information entered is invalid. Please check and try again!',
      {
        errors: {
          field: 'email',
          message: 'Email is already in use'
        }
      }
    )
  },
  {
    description: 'Should sign up successfully and send email token',
    input: {
      firstName: 'Test',
      lastName: 'Unit',
      email: 'test@gmail.com',
      password: 'Test@123'
    },
    expectedResult: { email: 'test@gmail.com', token: expect.any(String) }
  }
]

export const signInTestCases = [
  {
    mockData: {
      userFindOneEmail: null
    },
    description: 'Should sign in failed - error: incorrect email',
    input: {
      email: 'wrong@gmail.com',
      password: 'Test@123'
    },
    expectedError: new ApiError(
      StatusCodes.BAD_REQUEST,
      'Incorrect email or password'
    )
  },
  {
    mockData: {
      userFindOneEmail: dataSignIn.users[0]
    },
    description: 'Should sign in failed - error: incorrect password',
    input: {
      email: 'nguyenvana@gmail.com',
      password: 'wrong'
    },
    expectedError: new ApiError(
      StatusCodes.BAD_REQUEST,
      'Incorrect email or password'
    )
  },
  {
    mockData: {
      userFindOneEmail: dataSignIn.users[1]
    },
    description: 'Should sign in failed - error: user has been blocked',
    input: {
      email: 'nguyenvanb@gmail.com',
      password: 'Test@123'
    },
    expectedError: new ApiError(StatusCodes.FORBIDDEN, 'Account has been blocked')
  },
  {
    mockData: {
      userFindOneEmail: dataSignIn.users[2]
    },
    description: 'Should sign in failed - error: user has not been verified',
    input: {
      email: 'nguyenvanc@gmail.com',
      password: 'Test@123'
    },
    expectedError: new ApiError(
      StatusCodes.FORBIDDEN,
      'Account has not been verified. Please check your email and verify account!',
      {
        email: 'nguyenvanc@gmail.coml',
        token: expect.any(String)
      }
    )
  },
  {
    mockData: {
      userFindOneEmail: dataSignIn.users[0],
      loginSession: { clientId: 'clientId' },
      responsedUser: { _id: dataSignIn.users[0]._id }
    },
    description: 'Should sign in successfully',
    input: {
      email: 'nguyenvana@gmail.com',
      password: 'Test@123'
    },
    expectedResult: expect.objectContaining({
      user: expect.any(Object),
      clientId: 'clientId',
      accessToken: expect.any(String),
      refreshToken: expect.any(String)
    })
  }
]

export const signOutTestCases = [
  {
    description: 'Should sign out successfully',
    input: {
      loginSessionId: 'f77ab384-a14b-4cb5-8756-9dd550f06f15'
    },
    expectedResult: undefined
  }
]
