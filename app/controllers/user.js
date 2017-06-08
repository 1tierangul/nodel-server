const { Router } = require('express');
const ensureAuth = require('../middlewares/ensure-auth');
const User = require('../models/user');

const router = new Router();

// Register user
router.post('/', async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    if (await User.isExists(email)) {
        res.status(409);
        res.end();
        return;
    }

    const user = await User.createNew({ email, name, password });

    res.status(200);
    res.send(user.getPublicData());
});

// Check auth
router.get('/auth', ensureAuth, (req, res) => {
    res.status(200);
    res.end();
});

// Login
router.post('/auth', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findByEmail(email);

    if (!user) {
        res.status(401);
        res.end();
        return;
    }

    if (!user.comparePassword(password)) {
        res.status(401);
        res.end();
        return;
    }

    const token = await user.makeToken();

    res.status(200);
    res.send({ token });
});

// Logout
router.delete('/auth', ensureAuth, async (req, res) => {
    const userId = req.user.id;

    await User.removeToken(userId);

    res.status(200);
    res.end();
});

module.exports = router;
