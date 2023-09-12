const nodemailer = require('nodemailer')
const emailTemplate = require('../views/verifyEmail')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})



const sendEmail = async (options) => {
    const {email, id} = options
    const html = emailTemplate(id)
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Email Verification',
        html: html
    }

    await transporter.sendMail(mailOptions, )

}