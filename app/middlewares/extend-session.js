const User = require('../models/user');

function extendSession(req, res, next) {
    if (!req.session) {
        res.status(449);
        res.end();
        return;
    }

    // Extend session
    Object.assign(req.session, {
        isAuthorized() {
            return this.authorized;
        },

        authorize(user) {
            this.userId = user.get('id');
            this.authorized = true;
        },

        unauthorize() {
            this.userId = null;
            this.authorized = false;
        },

        async getUser() {
            if (!this.isAuthorized()) {
                return null;
            }

            return User.findById(this.userId);
        },
    });

    next();
}

module.exports = extendSession;
