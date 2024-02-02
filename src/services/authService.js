import { StatusCodes } from 'http-status-codes'
import userModel from '~/models/userModel'
import tokenModel from '~/models/tokenModel'
import ApiError from '~/utils/ApiError'
import {
  verifyPassword,
  generateKeyPairRSA,
  generateToken,
  verifyToken,
  hashPassword
} from '~/utils/auth'
import { APP, AUTH } from '~/configs/environment'
import sendMail from '~/utils/sendMail'

const signUp = async ({ firstName, lastName, mobile, email, password }) => {
  try {
    const foundUser = await userModel.findOne({ email })
    if (foundUser) {
      let errorMessage = '"email" is already in use'
      if (foundUser.mobile === mobile) {
        errorMessage = `${errorMessage}. "mobile" are already in use`
      }
      throw new ApiError(StatusCodes.CONFLICT, errorMessage)
    }

    const { publicKey, privateKey } = generateKeyPairRSA()
    const newUser = await userModel.create({
      firstName, lastName, mobile, email,
      password, publicKey, privateKey
    })
    return {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      mobile: newUser.mobile,
      address: newUser.address,
      cart: newUser.cart,
      wishlist: newUser.wishlist
    }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const signIn = async ({ email, password }) => {
  try {
    const foundUser = await userModel.findOne({ email })
    if (!foundUser) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
    if (foundUser.isBlocked) throw new ApiError(StatusCodes.FORBIDDEN, 'User is blocked')
    const isValidPassword = await verifyPassword(password, foundUser.password)
    if (!isValidPassword) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')

    const payload = { userId: foundUser._id, email: foundUser.email }
    const accessToken = generateToken(payload, foundUser.privateKey, AUTH.ACCESS_TOKEN_EXPIRES)
    const refreshToken = generateToken(payload, foundUser.privateKey, AUTH.REFRESH_TOKEN_EXPIRES)
    await tokenModel.create({ userId: foundUser._id, accessToken, refreshToken })

    return {
      _id: foundUser._id,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      image: foundUser.image,
      email: foundUser.email,
      mobile: foundUser.mobile,
      address: foundUser.address,
      cart: foundUser.cart,
      wishlist: foundUser.wishlist,
      accessToken,
      refreshToken
    }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Sign in failed')
  }
}

const handleRefreshToken = async (userId, refreshToken) => {
  try {
    if (!userId && !refreshToken)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')
    const foundUser = await userModel.findById(userId)
    if (!foundUser)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')
    if (foundUser.usedRefreshTokens.includes(refreshToken)) {
      await tokenModel.deleteMany({ userId: foundUser?._id })
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')
    }
    const token = await tokenModel.findOne({ userId, refreshToken })
    if (!token)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')

    verifyToken(refreshToken, foundUser.publicKey)

    const payload = { userId: foundUser._id, email: foundUser.email }
    const newAccessToken = generateToken(
      payload,
      foundUser.privateKey,
      AUTH.ACCESS_TOKEN_EXPIRES
    )
    const newRefreshToken = generateToken(
      payload,
      foundUser.privateKey,
      AUTH.REFRESH_TOKEN_EXPIRES
    )

    await tokenModel.create({
      userId: foundUser?._id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    })
    await tokenModel.deleteOne({ userId: foundUser?._id, refreshToken })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      await tokenModel.deleteOne({ userId, refreshToken })
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Expired refresh token')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token')
    }
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Handling refresh token failed')
  }
}

const signOut = async (token) => {
  try {
    await tokenModel.deleteOne({ _id: token?._id })
    await userModel.updateOne(
      { _id: token.userId },
      { $push: { usedRefreshTokens: token.refreshToken } }
    )
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Sign out failed')
  }
}

const forgotPassword = async (email) => {
  try {
    if (!email) throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing email')
    const foundUser = await userModel.findOne({ email })
    if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    const passwordResetToken = generateToken(
      {
        userId: foundUser._id,
        email: foundUser.email
      },
      foundUser.privateKey,
      AUTH.PASSWORD_RESET_TOKEN_EXPIRES
    )
    await userModel.findOneAndUpdate(
      { _id: foundUser?._id },
      { passwordResetToken }
    )

    const html = `
      Please click on the link below to change your password
      <a href="${APP.PROTOCOL}://${APP.HOST}:${APP.PORT}/api/v1/auth/reset-password/${foundUser._id}/${passwordResetToken}">Click here</a>
    `
    const mailResult = await sendMail(email, {
      subject: 'Forgot password',
      html
    })
    return mailResult.accepted[0]
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Handling forgot password failed')
  }
}

const resetPassword = async ({ userId, token, password }) => {
  try {
    const foundUser = await userModel.findById(userId)
    if (!foundUser)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Reset password failed')
    if (foundUser.passwordResetToken !== token) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Reset password failed')
    }

    verifyToken(token, foundUser.publicKey)
    await userModel.updateOne(
      { _id: foundUser?._id },
      { password: await hashPassword(password), passwordChangedAt: Date.now() }
    )
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      await userModel.updateOne(
        { _id: userId },
        { passwordResetToken: null }
      )
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Expired token')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    }
    if (error.name === 'ApiError') throw error
    throw new ApiError( StatusCodes.INTERNAL_SERVER_ERROR, 'Reset password failed')
  }
}

export default {
  signUp,
  signIn,
  signOut,
  handleRefreshToken,
  forgotPassword,
  resetPassword
}
