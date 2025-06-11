const User = require('./models/user');
const AdminUser = require('./models/admin');
const { verifyAccessToken } = require("./utils/jwt");

const requireAuth = (role) => async (req, res, next) => {
    const token = String(req.headers.authorization).replace('Bearer ', '')

    if (token === 'undefined') {
        return res.status(401).json({
            code: 401,
            message: 'You are unauthorized',
            success: false,
            data: null,
        });
    }

    try {
        const decoded = verifyAccessToken(token);

        if (decoded.role !== role) {
            return res.status(403).json({
                code: 403,
                message: 'Forbidden',
                success: false,
                data: null,
            });
        } else {
            req.user = decoded;
            next();
        }
    } catch {
        return res.status(401).json({
            code: 401,
            message: 'Invalid token',
            success: false,
            data: null,
        });
    }
}

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

module.exports = { isLoggedIn, isAdmin, isPWAUser, requireAuth };
