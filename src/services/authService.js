import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { TOTP } from 'totp-generator'
import { AUTH, CLIENT } from '~/configs/environment'
import authenticationTokenModel from '~/models/authenticationTokenModel'
import emailVerificationTokenModel from '~/models/emailVerificationTokenModel'
import passwordResetOtpModel from '~/models/passwordResetOtpModel'
import userModel from '~/models/userModel'
import passwordHistoryModel from '~/models/passwordHistoryModel'
import ApiError from '~/utils/ApiError'
import {
  checkEmailVerificationTokenExpired,
  checkPasswordResetOTPExpired,
  generateBase64Token,
  generateKeyPairRSA,
  generateToken,
  hash,
  verifyHashed,
  verifyToken
} from '~/utils/auth'
import { formatPlaceHolderUrl } from '~/utils/formatter'
import { sendMailWithHTML } from '~/utils/sendMail'

const createTokenAndSendEmailToVerify = async (userId, email) => {
  const token = generateBase64Token()
  const newEmailVerificationToken = await emailVerificationTokenModel.create({
    userId,
    token: token
  })
  await sendMailWithHTML({
    email,
    subject: 'Please confirm your email',
    pathToView: 'verify-email.ejs',
    data: {
      url: `${CLIENT.URL}/auth/verify-email/${userId}/${newEmailVerificationToken.token}/`
    }
  })
}

const signUp = async ({ firstName, lastName, mobile, email, password }) => {
  try {
    let errorMessages = []
    const [foundUserByEmail, foundUserByMobile] = await Promise.all([
      userModel.findOne({ email }),
      userModel.findOne({ mobile })
    ])
    if (foundUserByEmail) {
      errorMessages = [
        ...errorMessages,
        {
          field: 'email',
          message: 'is already in use'
        }
      ]
    }
    if (foundUserByMobile) {
      errorMessages = [
        ...errorMessages,
        {
          field: 'mobile',
          message: 'is already in use'
        }
      ]
    }
    if (errorMessages.length) {
      throw new ApiError(StatusCodes.CONFLICT, errorMessages)
    }

    const { publicKey, privateKey } = generateKeyPairRSA()
    const { hashed } = await hash(password)

    const newUser = await userModel.create({
      firstName,
      lastName,
      mobile,
      email,
      password: hashed,
      publicKey,
      privateKey
    })

    await createTokenAndSendEmailToVerify(newUser._id, email)

    return {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      mobile: newUser.mobile,
      email: newUser.email
    }
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

const verifyEmail = async ({ userId, token }) => {
  try {
    const foundEmailVerificationToken =
      await emailVerificationTokenModel.findOne({
        userId,
        token
      })
    if (!foundEmailVerificationToken)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Verify email failed')

    if (
      checkEmailVerificationTokenExpired(foundEmailVerificationToken.expireAt)
    ) {
      await emailVerificationTokenModel.deleteOne({
        _id: foundEmailVerificationToken._id
      })
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Verify email failed')
    }

    const updatedUser = await userModel.findOneAndUpdate(
      {
        _id: userId
      },
      { verified: true }
    )
    if (!updatedUser)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Verify email failed')
    await emailVerificationTokenModel.deleteOne({
      _id: foundEmailVerificationToken._id
    })
  } catch (error) {
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

const signIn = async ({ email, password }) => {
  try {
    const foundUser = await userModel.findOne({ email })
    if (!foundUser)
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Incorrect email or password'
      )
    if (foundUser.isBlocked)
      throw new ApiError(StatusCodes.FORBIDDEN, 'User is blocked')
    const isValidPassword = await verifyHashed(password, foundUser.password)
    if (!isValidPassword)
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Incorrect email or password'
      )

    if (!foundUser.verified) {
      const foundEmailVerificationToken =
        await emailVerificationTokenModel.findOne({
          userId: foundUser._id
        })
      if (foundEmailVerificationToken) {
        if (
          !checkEmailVerificationTokenExpired(
            foundEmailVerificationToken.expireAt
          )
        ) {
          throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            `An email has been sent to <<${foundUser.email}>>. Please check your email again to verify this email.`
          )
        }
        await emailVerificationTokenModel.deleteOne({
          _id: foundEmailVerificationToken._id
        })
      }
      await createTokenAndSendEmailToVerify(foundUser._id, foundUser.email)
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        `An email has been sent to <<${foundUser.email}>>. Please check your email to verify this email.`
      )
    }

    const payload = { userId: foundUser._id, email: foundUser.email }
    const accessToken = generateToken(
      payload,
      foundUser.privateKey,
      AUTH.ACCESS_TOKEN_EXPIRES
    )
    const refreshToken = generateToken(
      payload,
      foundUser.privateKey,
      AUTH.REFRESH_TOKEN_EXPIRES
    )
    await authenticationTokenModel.create({
      userId: foundUser._id,
      accessToken,
      refreshToken
    })

    return {
      user: {
        _id: foundUser._id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        image: foundUser.image,
        email: foundUser.email,
        mobile: foundUser.mobile,
        address: foundUser.address
      },
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

const forgotPassword = async ({ email }) => {
  try {
    const foundUser = await userModel.findOne({ email })
    if (!foundUser)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect email')

    const userId = foundUser._id

    // delete OTP if exists
    await passwordResetOtpModel.deleteOne({
      userId
    })

    const { otp } = TOTP.generate(AUTH.PASSWORD_RESET_OTP_SECRET_KEY, {
      algorithm: 'SHA3-512',
      timestamp: Date.now() + AUTH.PASSWORD_RESET_OTP_TIME
    })
    const token = generateToken(
      {
        userId,
        email: foundUser.email
      },
      foundUser.privateKey,
      AUTH.PASSWORD_RESET_OTP_TIME
    )
    const newPasswordResetOtp = await passwordResetOtpModel.create({
      userId,
      otp: (await hash(otp)).hashed,
      token
    })

    await sendMailWithHTML({
      email,
      subject: 'Password Reset OTP',
      pathToView: 'password-reset-otp.ejs',
      data: {
        otp,
        otpFormUrl:
          CLIENT.URL +
          formatPlaceHolderUrl(CLIENT.CLIENT_OTP_FORM_PATH, {
            userId,
            token
          }),
        firstName: foundUser.firstName
      }
    })

    return {
      userId,
      email,
      token,
      expireAt: newPasswordResetOtp.expireAt
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

const getPasswordForgotInfo = async ({ userId, token }) => {
  try {
    const [foundUser, foundPasswordResetOtp] = await Promise.all([
      userModel.findOne({
        _id: userId
      }),
      passwordResetOtpModel.findOne({
        userId,
        token
      })
    ])
    if (!foundUser || !foundPasswordResetOtp)
      throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)

    const decodedUser = verifyToken(token, foundUser.publicKey)
    if (
      !foundUser._id.equals(decodedUser.userId) ||
      decodedUser.email !== foundUser.email
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    }

    const { expireAt } = foundPasswordResetOtp

    if (checkPasswordResetOTPExpired(expireAt))
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Expired OTP')

    return {
      userId,
      email: foundUser.email,
      token,
      expireAt
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)
    }
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }
}

const resetPassword = async ({ userId, email, otp, token, newPassword }) => {
  try {
    const foundUser = await userModel.findOne({
      _id: userId,
      email
    })
    if (!foundUser)
      throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)

    const decodedUser = verifyToken(token, foundUser.publicKey)
    if (
      !foundUser._id.equals(decodedUser.userId) ||
      decodedUser.email !== foundUser.email
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    }

    const foundPasswordResetOtp = await passwordResetOtpModel.findOne({
      userId,
      token
    })
    if (!foundPasswordResetOtp)
      throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)

    if (checkPasswordResetOTPExpired(foundPasswordResetOtp.expireAt))
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Expired OTP')

    const isValid = await verifyHashed(otp, foundPasswordResetOtp.otp)
    if (!isValid) throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect OTP')


    // check new password same old passwords
    const passwordHistory = await passwordHistoryModel.find({
      userId,
      createdAt: {
        $gte: Date.now() - AUTH.NEW_PASSWORD_NOT_SAME_OLD_PASSWORD_TIME
      }
    })
    let isSame = false
    for (const { password: hashedOldPassword } of passwordHistory) {
      isSame = await verifyHashed(newPassword, hashedOldPassword)
      if (isSame) break
    }
    if (isSame) {
      const numberDays =
        AUTH.NEW_PASSWORD_NOT_SAME_OLD_PASSWORD_TIME / (1000 * 60 * 60 * 24)
      throw new ApiError(
        StatusCodes.CONFLICT,
        `New password must not be the same as old password for ${numberDays} days`
      )
    }

    // delete current OTP
    await passwordResetOtpModel.deleteOne({
      _id: foundPasswordResetOtp._id
    })

    // push current password to history
    await passwordHistoryModel.create({
      userId,
      password: foundUser.password
    })

    // reset password
    await userModel.updateOne(
      {
        _id: userId,
        email
      },
      {
        password: (await hash(newPassword)).hashed
      }
    )
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)
    }
    if (error.name === ApiError.name) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
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
      await authenticationTokenModel.deleteMany({ userId: foundUser?._id })
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token failed')
    }
    const token = await authenticationTokenModel.findOne({
      userId,
      refreshToken
    })
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

    await authenticationTokenModel.create({
      userId: foundUser?._id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    })
    await authenticationTokenModel.deleteOne({
      userId: foundUser?._id,
      refreshToken
    })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      await authenticationTokenModel.deleteOne({ userId, refreshToken })
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Expired refresh token')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token')
    }
    if (error.name === 'ApiError') throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Handling refresh token failed'
    )
  }
}

const signOut = async (userId, token) => {
  try {
    await Promise.all([
      authenticationTokenModel.deleteOne({ _id: token._id }),
      userModel.updateOne(
        { _id: userId },
        { $push: { usedRefreshTokens: token.refreshToken } }
      )
    ])
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Sign out failed')
  }
}

export default {
  signUp,
  signIn,
  verifyEmail,
  forgotPassword,
  getPasswordForgotInfo,
  resetPassword,
  signOut,
  handleRefreshToken
}
