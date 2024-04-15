// https://dev.to/documatic/send-email-in-nodejs-with-nodemailer-using-gmail-account-2gd1
import nodemailer from 'nodemailer'
import ejs from 'ejs'
import { EMAIL, APP } from '~/configs/environment'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL.NAME,
    pass: EMAIL.APP_PASSWORD
  }
})

/**
 * @param {string} email
 * @param {object} content
 * @param {string} content.subject
 * @param {string} content.text
 * @param {string} content.html
 * @returns {object}
 */
const sendMail = async (email, content = {}) => {
  const { subject, text, html } = content || {}
  const info = await transporter.sendMail({
    from: {
      name: APP.BRAND_NAME,
      address: 'confirm@digitalworld.com'
    },
    to: email,
    subject: subject,
    text: text,
    html: html
  })
  return info
}

export const sendMailWithHTML = async ({
  email = '',
  subject = '',
  pathToView = '',
  data = {}
}) => {
  const html = await ejs.renderFile(
    `${__dirname}/../views/${pathToView}`,
    data,
    { async: true }
  )
  return await sendMail(email, { subject, html })
}

export default sendMail
