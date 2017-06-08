const crypto = require('crypto');
const config = require('../config');

module.exports = {
    decrypt(plainText) {
        const cipher = crypto.createDecipher(config.CRYPTO_ALOGORITHM, config.CRYPTO_SECRET);
        let dec = cipher.update(plainText, 'hex', 'utf8');

        dec += cipher.final('utf8');

        return dec;
    },

    encrypt(plainText) {
        const cipher = crypto.createCipher(config.CRYPTO_ALOGORITHM, config.CRYPTO_SECRET);
        let crypted = cipher.update(plainText, 'utf8', 'hex');

        crypted += cipher.final('hex');

        return crypted;
    },
};
