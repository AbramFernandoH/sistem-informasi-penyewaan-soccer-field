const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

const generateAccessToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN || '1d' });

const generateRefreshToken = (payload) => jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN || '7d',
})

const verifyAccessToken = (token) => jwt.verify(token, SECRET);

const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
