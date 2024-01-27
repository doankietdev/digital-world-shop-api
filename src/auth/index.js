import bcrypt from 'bcrypt'
import forge from 'node-forge'
import jwt from 'jsonwebtoken'
import { AUTH } from '~/configs/environment'

const { rsa, publicKeyToPem, privateKeyToPem } = forge.pki

export const hashPassword = async (password) => {
  const salt = bcrypt.genSaltSync(10)
  return await bcrypt.hash(password, salt)
}

export const verifyPassword = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash)
}

export const generateKeyPairRSA = () => {
  const keyPair = rsa.generateKeyPair({ bits: 4096, workers: 2, algorithm: 'RS256' })
  return {
    publicKey: publicKeyToPem(keyPair.publicKey),
    privateKey: privateKeyToPem(keyPair.privateKey)
  }
}

export const generateTokenPair = (
  payload = {},
  privateKey = ''
) => {
  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: AUTH.ACCESS_TOKEN_EXPIRES
  })
  const refreshToken = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: AUTH.REFRESH_TOKEN_EXPIRES
  })

  return { accessToken, refreshToken }
}

export const verifyToken = (token, publicKey) => {
  return jwt.verify(token, publicKey)
}
