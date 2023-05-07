import nodemailer from 'nodemailer'

export const registerEmail = async (data) => {

  const { email, username, token } = data

  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const info = await transport.sendMail({
    from: 'PROJECT_TASKS_APP',
    to: email,
    subject: 'PROJECT_TASKS_APP, Confirm your account',
    text: 'Confirm your account',
    html: `<p>Hola ${username}, Welcome to project tasks app</p>
    <p>Your account is almost ready, just verify your email by clicking in the next link:</p>
    <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Verify account</a>
    <p>if you are not the addressee of this e-mail, ignore this message</p>
    `
  })
}

export const forgotEmail = async (data) => {

  const { email, username, token } = data

  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const info = await transport.sendMail({
    from: 'PROJECT_TASKS_APP - ',
    to: email,
    subject: 'PROJECT_TASKS_APP - Reset your password',
    text: 'Confirm your account',
    html: `<p>Hola ${username}, </p>
    <p>Your required a reset password, follow the next link to continue with the process:</p>
    <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset password</a>
    <p>if you are not the addressee of this e-mail, ignore this message</p>
    `
  })
}