const moment = require('moment');
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
    token: {
        type: Sequelize.STRING,
    },
}, {
    freezeTableName: true,
});


User.createNew = async function createNew(info) {
    const passwordHash = await cryptoExtra.encrypt(info.password);

    const user = await User.create({
        email: info.email,
        name: info.name,
        password: passwordHash,
    });

    await user.makeToken();

    return user;
};

User.isExists = async function isExists(email) {
    const user = await User.findByEmail(email);
    return !!user;
};

User.findByEmail = async function findByEmail(email) {
    return User.findOne({ where: { email } });
};

Object.assign(User.prototype, {
    isTokenExpired(decoded) {
        const now = moment();

        return moment(decoded.expireDate).isBefore(now)
            || this.get('token') === null;
    },

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

    async makeToken() {
        const data = this.getPublicData();
        let token = '';

        try {
            token = await jwt.sign(data);
            await this.update({ token });
        } catch (err) {
            console.error('Error while update token', err);
        }

        return token;
    },

    async removeToken() {
        return this.update({ token: null });
    }
});

module.exports = User;
