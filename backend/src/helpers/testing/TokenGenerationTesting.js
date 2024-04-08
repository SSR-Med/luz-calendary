// Services
const {createUser, login} = require('../../services/user/UserService');
// Modules
const {sequelize} = require('../../config/Database');
// Models
const User = require('../../models/User');

async function generateTokenTesting(name,email,password,role){
    await User.sync({force: true})
    const admin = await createUser(name,email,password,role)
    token = await login(admin.name,password);
    return token
}

module.exports = generateTokenTesting 