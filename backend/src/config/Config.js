// Dependencies
const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  database_url: process.env.DATABASE_URL,
  host: process.env.HOST,
  port: process.env.PORT,
  salt : process.env.SALT,
  jwt_key : process.env.JWT_KEY,
  email_host: process.env.EMAIL,
  email_password: process.env.EMAIL_PASSWORD,
  email_port: process.env.EMAIL_PORT,
};