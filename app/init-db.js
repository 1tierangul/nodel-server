const db = require('./db');

async function initDB() {
    await db.authenticate();

    const Photo = require('./models/photo');
    const User = require('./models/user');
    const PhotoTag = require('./models/photo-tag');

    User.hasMany(Photo, {
        as: 'photos',
        foreignKey: 'ownerId',
    });

    Photo.hasMany(PhotoTag, {
        as: 'tags',
        foreignKey: 'photoId',
    });

    await db.sync();
}

module.exports = initDB;
