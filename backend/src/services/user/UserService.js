// Dependencies
const jwt = require("jsonwebtoken");
// Models
const User = require('../../models/User')
// Helpers
const { generatePassword, comparePassword } = require('../../helpers/user/Password')
// Env
const { jwt_key } = require("../../config/Config");

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

module.exports = {
    getUsers,
    deleteUser,
    createUser,
    modifyUser,
    login
};