// Dependencies
const { Sequelize } = require('sequelize');
// Env
const {  host, database_url } = require('./Config');

const sequelize = new Sequelize(database_url, {
  host: host,
  dialect: 'postgres',
});

module.exports = {
  sequelize
}