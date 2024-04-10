// Modules
const User = require('../../models/User');

async function checkRole(userId){
    const user = await User.findOne({where: {id: userId}});
    if(!user){
        return null;
    }
    return user.role;
}


module.exports = checkRole;