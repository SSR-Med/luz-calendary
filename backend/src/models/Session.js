// Dependencies
const { DataTypes } = require('sequelize');
// Modules
const { sequelize } = require('../config/Database');
// Models
import Patient from './Patient';

const Session = sequelize.define('Session', {
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
            model: Patient,
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
});

module.exports = Session;