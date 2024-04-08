const Patient = require('./Patient');
const Session = require('./Session');
const User = require('./User');

Patient.hasMany(Session, { onDelete: 'cascade' });
User.hasMany(Session, { onDelete: 'cascade' });