const Sequelize = require('sequelize');
const db = require('../db');

const PhotoTag = db.define('photo_tag', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    photoId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'photo',
            key: 'id',
        },
    },
    tagId: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
}, {
    freezeTableName: true,
});

module.exports = PhotoTag;
