import bcrypt from 'bcrypt'
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
import forge from 'node-forge'
import { AUTH } from '~/configs/environment'

const { rsa, publicKeyToPem, privateKeyToPem } = forge.pki

export const hash = async (string) => {
  const salt = bcrypt.genSaltSync(10)
  return {
    hashed: await bcrypt.hash(string, salt),
    salt
  }
}

export const verifyHashed = async (string, hashedString) => {
  return await bcrypt.compare(string, hashedString)
}

export const generateKeyPairRSA = () => {
  const keyPair = rsa.generateKeyPair({
    bits: 4096,
    workers: 2,
    algorithm: 'RS256'
  })
  return {
    publicKey: publicKeyToPem(keyPair.publicKey),
    privateKey: privateKeyToPem(keyPair.privateKey)
  }
}

export const generateToken = (payload = {}, privateKey, tokenLife) => {
  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: tokenLife
  })
}

export const verifyToken = (token, publicKey) => {
  return jwt.verify(token, publicKey)
}

export const generateBase64Token = () => {
  const randomBytes = CryptoJS.lib.WordArray.random(32)
  const randomHex = randomBytes.toString(CryptoJS.enc.Hex)
  const base64String = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Hex.parse(randomHex)
  )
  const modifiedBase64 = base64String.replace(/\//g, '_').replace(/\\/g, '-')
  return modifiedBase64
}

export const checkExpired = (expiresAt) => {
  const msExpiresAt = new Date(expiresAt).getTime()
  const msNow = Date.now()
  return msNow >= msExpiresAt
}

/**
 * @param {string} newPassword
 * @param {[{
 *  password: string,
 *  createdAt: Date
 * }]} passwordHistory
 * @returns {Promise<boolean>}
 */
export const checkNewPasswordPolicy = async (
  newPassword = '',
  passwordHistory = [],
  hashedCurrentPassword = ''
) => {
  const isMatchWithCurrentPassword = await verifyHashed(newPassword, hashedCurrentPassword)
  if (isMatchWithCurrentPassword)
    return { isValid: false, message: 'New password must not be the same as the old password' }

  for (const { password: hashedOldPassword, createdAt } of passwordHistory) {
    const isInvalidTime = Date.now() - new Date(createdAt).getTime() <= AUTH.NEW_PASSWORD_NOT_SAME_OLD_PASSWORD_TIME
    const isMatchWithOldPassword = await verifyHashed(newPassword, hashedOldPassword)

    if (isInvalidTime && isMatchWithOldPassword) {
      const numberDays =
          AUTH.NEW_PASSWORD_NOT_SAME_OLD_PASSWORD_TIME / (1000 * 60 * 60 * 24)
      return {
        isValid: false,
        message: `New password must not be the same as old password for ${numberDays} days`
      }
    }
  }
  return {
    isValid: true,
    message: 'New password is valid'
  }
}