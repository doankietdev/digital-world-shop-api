import { OAuth2Client } from 'google-auth-library'
import { AUTH } from '~/configs/environment'

const client = new OAuth2Client({
  clientId: AUTH.GOOGLE_CLIENT_ID,
  clientSecret: AUTH.GOOGLE_SECRET,
  redirectUri: 'postmessage'
})

const getProfile = async (code) => {
  const { tokens } = await client.getToken(code)
  const idToken = tokens.id_token

  const ticket = await client.verifyIdToken({
    idToken,
    audience: AUTH.GOOGLE_CLIENT_ID
  })
  return ticket.getPayload()
}

export default {
  getProfile
}