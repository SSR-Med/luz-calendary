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
    id_user:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        } 
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
    },
}, {
    tableName: 'patient',
    indexes: [
        {
            unique: true,
            fields: ['document',"id_user"]
        }
    ]
});
module.exports = Patient;