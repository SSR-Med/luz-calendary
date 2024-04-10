// Dependencies
const { DataTypes } = require('sequelize');
// Modules
const { sequelize } = require('../config/Database');
// Models
const Session = require('./Session');

const Patient = sequelize.define('patient', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    id_user:{
        type: DataTypes.BIGINT,
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
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    document: {
        type: DataTypes.BIGINT,
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