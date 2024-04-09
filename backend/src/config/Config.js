// Dependencies
const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  host: process.env.HOST,
  database_url: process.env.DATABASE_URL,
  database_host: process.env.DATABASE_HOST,
  port: process.env.PORT,
  salt : process.env.SALT,
  jwt_key : process.env.JWT_KEY,
  email_host: process.env.EMAIL,
  email_password: process.env.EMAIL_PASSWORD,
  email_port: process.env.EMAIL_PORT,
  crypt_algorithm: process.env.CRYPT_ALGORITHM,
  crypt_secret_key: process.env.CRYPT_SECRET_KEY,
};