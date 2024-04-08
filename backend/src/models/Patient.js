// Dependencies
const { DataTypes } = require('sequelize');
// Modules
const { sequelize } = require('../config/Database');
// Models
const Session = require('./Session');

const Patient = sequelize.define('patient', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cellphone: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    document: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
}, {tableName: 'patient'});
module.exports = Patient;