import bcrypt from 'bcrypt'
import forge from 'node-forge'
import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'

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

export const generateToken = (payload = {}, privateKey, expiresIn) => {
  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn
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

export const checkEmailVerificationTokenExpired = (expireAt) => {
  const msExpireAt = new Date(expireAt).getTime()
  const msNow = Date.now()
  return msNow >= msExpireAt
}

export const checkPasswordResetOTPExpired = (expireAt) => {
  const msExpireAt = new Date(expireAt).getTime()
  const msNow = Date.now()
  return msNow >= msExpireAt
}
