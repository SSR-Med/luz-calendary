// Services
const {createUser, login} = require('../services/user/UserService');
// Modules
const {sequelize} = require('../config/Database');

async function generateTokenTesting(role){
    await sequelize.sync({force: true})
    const admin = await createUser("admin","admin@gmail.com","admin",role)
    token = await login(admin.name,"admin");
    return token
}

module.exports = generateTokenTesting 