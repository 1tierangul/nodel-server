const Sequelize = require('sequelize');
const db = require('../db');
const cryptoExtra = require('../utils/crypto-extra');
const jwt = require('../utils/jwt');

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true,
        },
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
});


User.createNew = async function createNew(info) {
    const passwordHash = await cryptoExtra.encrypt(info.password);

    return User.create({
        email: info.email,
        name: info.name,
        password: passwordHash,
    });
};

User.isExists = async function isExists(email) {
    const user = await User.findByEmail(email);
    return !!user;
};

User.findByEmail = async function findByEmail(email) {
    return User.findOne({ where: { email } });
};

Object.assign(User.prototype, {
    comparePassword(password) {
        const decrypted = cryptoExtra.decrypt(this.get('password'));
        return decrypted === password;
    },

    getPublicData() {
        return {
            id: this.get('id'),
            name: this.get('name'),
            email: this.get('email'),
        };
    },
});

module.exports = User;
