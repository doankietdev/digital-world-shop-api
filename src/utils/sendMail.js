// https://dev.to/documatic/send-email-in-nodejs-with-nodemailer-using-gmail-account-2gd1
import nodemailer from 'nodemailer'
import { EMAIL } from '~/configs/environment';

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
    from: '"Digital Shop" <no-reply@gmail.com>',
    to: email,
    subject: subject,
    text: text,
    html: html
  })
  return info
}

export default sendMail
