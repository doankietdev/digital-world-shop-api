import paypalAxiosClient from '~/configs/paypalAxiosClient'
import { PARTNERS } from '~/configs/environment'
import { PARTNER_APIS } from '~/utils/constants'
import { parsePlaceHolderUrl } from '~/utils/formatter'

const generateAccessToken = async () => {
  try {
    const { PAYPAL } = PARTNERS
    if (!PAYPAL.CLIENT_ID || !PAYPAL.SECRET_KEY) {
      throw new Error('MISSING_API_CREDENTIALS')
    }
    const auth = Buffer.from(
      PAYPAL.CLIENT_ID + ':' + PAYPAL.SECRET_KEY
    ).toString('base64')
    const { access_token } = await paypalAxiosClient.post(
      PARTNER_APIS.PAYPAL.APIS.GENERATE_ACCESS_TOKEN,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    )
    return access_token
  } catch (error) {
    throw new Error('Failed to generate Access Token')
  }
}

/**
 *
 * @param {{
 *    items: [{
 *      name: string,
 *      quantity: number,
 *      unit_amount: {
 *        currency_code: 'USD',
 *        value: number
 *      }
 *    }],
 *    amount: {
 *        currency_code: 'USD',
 *        value: string,
 *        breakdown: {
 *          item_total: {
 *            currency_code: 'USD',
 *            value: number
 *          },
 *          shipping: {
 *            currency_code: 'USD',
 *            value: number
 *          },
 *          discount: {
 *            currency_code: 'USD',
 *            value: number
 *          }
 *        }
 *    }
 *  }} payload
 * @returns
 */
const createOrder = async (payload) => {
  const accessToken = await generateAccessToken()
  return await paypalAxiosClient.post(
    PARTNER_APIS.PAYPAL.APIS.CREATE_ORDER,
    {
      intent: 'CAPTURE',
      purchase_units: [payload]
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}

const captureOrder = async (orderId) => {
  const accessToken = await generateAccessToken()
  return await paypalAxiosClient.post(
    parsePlaceHolderUrl(PARTNER_APIS.PAYPAL.APIS.CAPTURE_ORDER, {
      orderId
    }),
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}

export default { createOrder, captureOrder }
