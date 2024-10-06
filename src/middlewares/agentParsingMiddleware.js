'use strict'

import { UAParser } from 'ua-parser-js'
import asyncHandler from '~/utils/asyncHandler'

const agentParsingMiddleware = asyncHandler(async (req, res, next) => {
  const { browser, os, device } = new UAParser(req.headers['user-agent']).getResult()
  const ip =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress ||
    ''

  req.agent = {
    browser: {
      name: browser?.name,
      version: browser?.version
    },
    os: {
      name: os?.name,
      version: os?.version
    },
    device: {
      deviceType: device?.type,
      model: device?.model,
      vendor: device?.vendor
    },
    ip
  }

  next()
})

export default agentParsingMiddleware
