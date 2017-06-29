const path = require('path');
require('dotenv').config();

const rootPath = path.resolve(__dirname, '../');

const config = {
    PORT: process.env.PORT || 9090,
    SECRET: process.env.SECRET,
    DB_NAME: process.env.DB_NAME || 'saver_seokju',
    DB_TYPE: process.env.DB_TYPE || 'mysql',
    DB_USER: process.env.DB_USER || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_PORT: process.env.DB_PORT || 3306,
    DB_HOST: process.env.DB_HOST || 'localhost',
    CRYPTO_ALOGORITHM: process.env.CRYPTO_ALOGORITHM,
    CRYPTO_SECRET: process.env.CRYPTO_SECRET,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    paths: {
        static: path.resolve(rootPath, 'static/'),
    },
};

module.exports = config;
