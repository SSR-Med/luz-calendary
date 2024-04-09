// Dependencies
const { Sequelize } = require('sequelize');
// Env
const {  database_host, database_url } = require('./Config');

const sequelize = new Sequelize(database_url, {
  host: database_host,
  dialect: 'postgres',
  logging: false
});

module.exports = {
  sequelize
}