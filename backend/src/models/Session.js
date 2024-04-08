// Dependencies
const { DataTypes } = require('sequelize');
// Modules
const { sequelize } = require('../config/Database');

const Session = sequelize.define('session', {
    id_session: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_patient:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'patient',
            key: 'id'
        }
    },
    id_user:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
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
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {tableName: 'session'});

module.exports = Session;