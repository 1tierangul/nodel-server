const Sequelize = require('sequelize');
const db = require('../db');
const Tag = require('../models/tag');

const Photo = db.define('photo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ownerId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'user',
            key: 'id',
        },
    },
    timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    imgSrc: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    context: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
}, {
    freezeTableName: true,
});

Object.assign(Photo.prototype, {
    async getHashTags() {
        const photoTags = await this.getTags();
        const hashTags = [];

        for (let i = 0; i < photoTags.length; i++) {
            const tag = await Tag.findById(photoTags[i].tagId);
            hashTags.push(tag.name);
        }

        return hashTags;
    },

    getPublicData() {
        return {
            id: this.get('id'),
            timestamp: this.get('timestamp'),
            imgSrc: this.get('imgSrc'),
            context: this.get('context'),
        };
    }
});

module.exports = Photo;
