import { v4 as uuidv4 } from 'uuid'
import { AUTH } from '~/configs/environment'
import { dataSignOut, dataSignUp } from '~/mockData/data.test.mock'
import emailTokenModel from '~/models/emailTokenModel'
import userModel from '~/models/userModel'
import { signInTestCases, signUpTestCases, signOutTestCases } from './auth.service.testcase'
import authService from './authService'
import cartService from './cartService'
import loginSessionService from './loginSessionService'
import userService from './userService'

describe('Auth Service', () => {
  describe('Call signUp', () => {
    let { users, emailTokens } = dataSignUp

    signUpTestCases.forEach(({ input, description, expectedResult, expectedError }) => {
      it(description, async () => {
        jest.spyOn(userModel, 'findOne').mockImplementation((filter = {}) => {
          return users.find(user => Object.keys(filter).some(filterKey => user[filterKey] === filter[filterKey])) ?? null
        })

        jest.spyOn(userModel, 'create').mockImplementation((userData) => {
          return {
            ...userData,
            _id: uuidv4()
          }
        })

        jest.spyOn(emailTokenModel, 'findOneAndUpdate').mockImplementation((filter = {}, update = {}) => {
          let foundEmailToken = emailTokens.find(emailToken => Object.keys(filter).some(filterKey => emailToken[filterKey] === filter[filterKey]))
          if (!foundEmailToken) {
            const newEmailToken = {
              ...filter,
              ...update,
              _id: uuidv4(),
              expiresAt: Date.now() + AUTH.EMAIL_VERIFICATION_TOKEN_LIFE
            }
            emailTokens = [...emailTokens, newEmailToken]
            return newEmailToken
          }

          foundEmailToken = {
            ...foundEmailToken,
            ...update,
            expiresAt: Date.now() + AUTH.EMAIL_VERIFICATION_TOKEN_LIFE
          }
        })

        jest.spyOn(cartService, 'createNewCart').mockImplementation(() => Promise.resolve())

        if (expectedError) {
          return await expect(authService.signUp(input)).rejects.toThrowError(expectedError)
        }
        expect(await authService.signUp(input)).toEqual(expect.objectContaining(expectedResult))
      })
    })
  })

  describe('Call signIn', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    signInTestCases.forEach(({ mockData, input, description, expectedResult, expectedError }) => {
      it(description, async () => {
        jest.spyOn(userModel, 'findOne')
          .mockReturnValueOnce(mockData.userFindOneEmail)
        jest.spyOn(loginSessionService, 'createNew')
          .mockReturnValue(Promise.resolve(mockData.loginSession))
        jest.spyOn(userService, 'getUser')
          .mockReturnValue(Promise.resolve(mockData.responsedUser))

        if (expectedError) {
          return await expect(authService.signIn(input)).rejects.toThrowError(expectedError)
        }
        expect(await authService.signIn(input)).toEqual(expectedResult)
      })
    })
  })

  describe('Call signOut', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    signOutTestCases.forEach(({ input, description, expectedResult }) => {
      it(description, async () => {
        jest.spyOn(loginSessionService, 'deleteById')
          .mockImplementation((id) => {
            return new Promise((resolve) => {
              dataSignOut.loginSessions = dataSignOut.loginSessions.filter(session => session._id !== id)
              resolve()
            })
          })

        expect(await authService.signOut(input)).toBe(expectedResult)
        expect(dataSignOut.loginSessions).toHaveLength(2)
        expect(dataSignOut.loginSessions.find(({ _id }) => input.loginSessionId === _id )).toBeUndefined()
      })
    })
  })
})