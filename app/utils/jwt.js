const jwt = require('jsonwebtoken');
const config = require('../config');

async function sign(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, config.SECRET, {}, (err, token) => {
            if (err) reject(err);
            else resolve(token);
        });
    });
}

async function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.SECRET, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
}

module.exports = {
    sign,
    verify,
};
