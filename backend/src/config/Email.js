const nodemailer = require('nodemailer');
const {email_host, email_password, email_port} = require('./Config');

const transportMail = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: Number(email_port),
    secure: true,
    auth: {
        user: email_host,
        pass: email_password
    }
})

module.exports = transportMail