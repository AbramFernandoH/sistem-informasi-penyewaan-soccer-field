const User = require('./model/user');
const AdminUser = require('./model/admin');

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        return res.json({
            code: 401,
            message: 'You are unauthorized',
            success: false,
            data: null,
        });
    }

    next();
};

// TODO: delete this later on, if there is not a single endpoint that use this middleware
const isGuest = (req, res, next) => {
    if(req.isAuthenticated()){
        return res.redirect('/dashboard');
    }

    next();
};

const isAdmin = async (req, res, next) => {
    if (req.isAuthenticated() && req.user instanceof AdminUser) return next();

    res.json({
        code: 403,
        message: 'Forbidden',
        success: false,
        data: null,
    });
};

const isPWAUser = async (req, res, next) => {
    if (req.isAuthenticated() && req.user instanceof User) return next();

    res.json({
        code: 403,
        message: 'Forbidden',
        success: false,
        data: null,
    });
};

module.exports = { isLoggedIn, isAdmin, isPWAUser };
