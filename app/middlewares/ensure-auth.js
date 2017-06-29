function ensureAuth(req, res, next) {
    if (req.session.isAuthorized()) {
        next();
        return;
    }

    res.status(401);
    res.end();
}

module.exports = ensureAuth;
