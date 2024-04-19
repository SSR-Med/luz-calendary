// Dependencies
const jwt = require("jsonwebtoken");
const crpyto = require("crypto");
const { Op } = require("sequelize");
// Models
const User = require('../../models/User')
// Helpers
const { generatePassword, comparePassword } = require('../../helpers/user/Password')
// Env
const { host, jwt_key, email_host, crypt_algorithm, crypt_secret_key } = require("../../config/Config");
// Modules
const transportMail = require("../../config/Email");

const emailRegex = /^[A-Z0-9]+@[A-Z0-9.-]+\.com$/i;

// Get all users
async function getUsers() {
  const users = await User.findAll({
    attributes: {'exclude': ['contrasena']},
  });
  return users;
}
// Delete user
async function deleteUser(id) {
  const user = await User.findOne({where: {id: id}});
  if (!user) {
    return null;
  }
  user.destroy();
  return user;
}
// Create user
async function createUser(name,email,password,role = false) {
  const searchUserName = await User.findOne({where: {name: name}});
  const searchUserEmail = await User.findOne({where: {email: email}});
  if (searchUserName) {
    return null;
  }
  if (searchUserEmail) {
    return null;
  }
  if (!emailRegex.test(email)) {
    return null;
  }
  const newUser = new User({
    name: name,
    email: email,
    password: generatePassword(password),
    role: role
  });
  await newUser.save();
  return newUser;
}
// Modify user
async function modifyUser(id,newName,newEmail,newPassword,newRole) {
  const searchUserName = await User.findOne({where: {name: newName, id: {[Op.not]: id}}});
  const searchUserEmail = await User.findOne({where: {email: newEmail, id: {[Op.not]: id}}});
  if (searchUserName) {
    return false;
  }
  if (searchUserEmail) {
    return false;
  }
  if (!emailRegex.test(newEmail)) {
    return false;
  }
  const user = await User.findOne({where: {id: id}});
  if (!user) {
    return null;
  }
  user.update({
    name : newName,
    email : newEmail,
    password : generatePassword(newPassword),
    role : newRole
  });
  return user;
}
// User Login
async function login(name, password) {
  const user = await User.findOne({where: {name: name}});
  if (!user) {
    return null;
  }
  const id = user.id;
  if (user && comparePassword(password, user.password)) {
    const token = jwt.sign({ id }, jwt_key, { expiresIn: "24h" });
    return token;
  } else {
    return null;
  }
}

// Get link for password recovery
async function sendLink(email) {
  const user = await User.findOne({where: {email: email}});
  if (!user) {
    return null;
  }
  const token = jwt.sign({ id: user.id }, jwt_key, { expiresIn: "15m" });
  return `${host}/user/password_recovery/${user.id}/${token}`;
}

// Send link to email for passwordRecovery
async function sendEmailPasswordRecovery(link, email) {
  const emailInfo = await transportMail.sendMail({
    from: email_host,
    to: email,
    subject: "Password Recovery",
    html: `
    <p>I hope this email finds you well. We noticed that you've encountered some difficulty accessing your account, and we're here to help. Your security is our utmost priority, and we understand the importance of regaining access to your account promptly.</p>
    <p>Our automated password recovery system has detected a request for assistance regarding your account. To proceed with the recovery process and ensure the security of your information, please follow the instructions outlined below:</p>
    <ol>
      <li>Click on the following link to initiate the password recovery process: <a href=${link}>Click here to recover your password</a></li>
      <li>Follow the on-screen instructions carefully to reset your password securely.</li>
    </ol>
    `
  })
}

// Recover password
async function recoverPassword(id, token, password) {
  try{
    const payload = jwt.verify(token, jwt_key);
    const userId = payload.id;
    if (userId != id) {
      return null;
    }
    const userDB = await User.findOne({where: {id: id}});
    if (!userDB) {
      return null;
    }
    userDB.update({
      password: generatePassword(password)
    });
    return userDB;
  }
  catch{
    return null;
  }
  
}

// Encrypt user data
function encryptUserData(text) {
  const cipher = crpyto.createCipher(crypt_algorithm, crypt_secret_key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decrypt user data
function decryptUserData(text) {
  const decipher = crpyto.createDecipher(crypt_algorithm, crypt_secret_key);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Create link for user creation
function createLinkUserCreation(encryptedText){
  return `${host}/user/creation/${encryptedText}`;

}

// Send email to create account
async function sendEmailCreateAccount(link, email) {
  const emailInfo = await transportMail.sendMail({
    from: email_host,
    to: email,
    subject: "Account creation",
    html: `
    <p>We're thrilled to invite you to join our community! Creating an account with us opens up a world of possibilities and exclusive benefits.</p>
    <p>To get started, simply click on the link below to create your account:</p>
    <p><a href=${link}>Create Account</a></p>
    <p>You'll stay updated on the latest news, offers, and exciting developments.</p>
    <p>We can't wait to see you onboard!</p>
    `
  })
}


module.exports = {
    getUsers,
    deleteUser,
    createUser,
    modifyUser,
    login,
    sendLink,
    sendEmailPasswordRecovery,
    recoverPassword,
    encryptUserData,
    decryptUserData,
    createLinkUserCreation,
    sendEmailCreateAccount
};