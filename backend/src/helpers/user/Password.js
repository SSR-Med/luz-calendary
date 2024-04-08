// Dependencies
const bcrypt = require('bcrypt');
// Env
const {salt} = require('../../config/Config');
// Generate hash for a plain password
function generatePassword(password) {
    return bcrypt.hashSync(password, Number(salt));
}
  // Compare plain password with hash
  function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    generatePassword,
    comparePassword
};