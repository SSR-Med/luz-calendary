// Dependencies
const jwt = require("jsonwebtoken");
// Models
const User = require('../../models/User')
// Helpers
const { generatePassword, comparePassword } = require('../../helpers/user/Password')
// Env
const { jwt_key, port, email_host } = require("../../config/Config");
// Modules
const transportMail = require("../../config/Email");

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
  const searchUser = await User.findOne({where: {name: name}});
  if (searchUser) {
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
  const searchUserName = await User.findOne({where: {name: newName}});
  const searchUserEmail = await User.findOne({where: {email: newEmail}});
  if (searchUserName && searchUserName.id != id) {
    return false;
  }
  if (searchUserEmail && searchUserEmail.id != id) {
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
  return `http://localhost:${port}/user/password_recovery/${user.id}/${token}`;
}

// Send link to email
async function sendEmail(link, email) {
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

module.exports = {
    getUsers,
    deleteUser,
    createUser,
    modifyUser,
    login,
    sendLink,
    sendEmail,
    recoverPassword
};