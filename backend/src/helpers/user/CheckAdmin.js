// Models
const User = require('../../models/User');

async function checkAdmin(req, res, next) {
  const user = await User.findOne({where: {id: req.id}});
  if(user && user.role) {
    next();
  }
  else{
    return res.status(403).json({ message: "User is not superAdmin" });
  }
}

module.exports = {
    checkAdmin
};