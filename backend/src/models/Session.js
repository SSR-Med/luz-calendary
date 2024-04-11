// Dependencies
const { DataTypes } = require('sequelize');
// Modules
const { sequelize } = require('../config/Database');

const Session = sequelize.define('session', {
    id_session: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    id_patient:{
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'patient',
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    start_hour: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    end_hour: {
        type: DataTypes.TIME,
        allowNull: false,
    },  
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {tableName: 'session'});

module.exports = Session;