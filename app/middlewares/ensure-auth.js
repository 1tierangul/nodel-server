const User = require('../models/user');
const jwt = require('../utils/jwt');

async function ensureAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(403);
        res.send({ message: 'Authorization header required.' });
        return;
    }

    const token = authHeader.split(' ')[1] || '';
    let userId;
    let decoded;

    try {
        decoded = await jwt.verify(token);
        userId = decoded.id;
    } catch (err) {
        res.status(403);
        res.send({ message: 'Fail to parse token' });
        return;
    }

    const user = await User.findById(userId);

    if (!user) {
        res.status(403);
        res.send({ message: `Invalid token value: ${token}` });
        return;
    } else if (user.isTokenExpired(decoded)) {
        await user.removeToken();

        res.status(403);
        res.send({ message: 'Token expired.' });
        return;
    }

    req.user = user.getPublicData();
    next();
}

module.exports = ensureAuth;
