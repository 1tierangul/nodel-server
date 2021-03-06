const Sequelize = require('sequelize');
const config = require('./config');

const db = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
    dialect: config.DB_TYPE,
    host: config.DB_HOST,
    port: config.DB_PORT,
});

module.exports = db;
