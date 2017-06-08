const Sequelize = require('sequelize');
const db = require('../db');

const Tag = db.define('tag', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        isUnique: true,
    },
}, {
    freezeTableName: true,
});

module.exports = Tag;
