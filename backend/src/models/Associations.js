const Patient = require('./Patient');
const Session = require('./Session');
const User = require('./User');

Patient.hasMany(Session, { onDelete: 'cascade', foreignKey: 'id_patient'});
Session.belongsTo(Patient, {foreignKey: 'id_patient'});
User.hasMany(Patient, { onDelete: 'cascade', foreignKey: 'id_user'});
Patient.belongsTo(User, {foreignKey: 'id_user'});

