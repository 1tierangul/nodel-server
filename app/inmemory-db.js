const redis = require('redis');
const bluebird = require('bluebird');
const config = require('./config');

// Promisify
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const inmemoryDB = redis.createClient({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
});

inmemoryDB.on('ready', () => {
    console.info('Redis is ready.');
});

inmemoryDB.on('error', (err) => {
    console.error(err);
});

module.exports = inmemoryDB;
