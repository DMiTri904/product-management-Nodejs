const nodemailer = require('nodemailer')
module.exports.sendMail = (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const mailOptions = {
    from: 'dangminhtri94@gmail.com',
    to: email,
    subject,
    html
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Email sent: ' + info.response)
  })
}
