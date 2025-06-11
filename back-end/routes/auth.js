const express = require('express');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const User = require('../models/user');
const { requireAuth } = require("../middleware");

const router = express.Router();

router.post(
    '/register',
    async (req, res) => {
        try {
            const { email, password } = req.body;
            const existing = await User.findOne({ email });

            if (existing !== null) {
                res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'User already exists',
                    data: null,
                });
            } else {
                const hashed = await bcrypt.hash(password, 10);
                const user = await User.create({ ...req.body, password: hashed });

                res.status(200).json({
                    code: 200,
                    success: true,
                    message: 'OK',
                    data: user,
                });
            }
        } catch {
            res.status(500).json({
                code: 500,
                success: false,
                message: 'Failed to register',
                data: null,
            });
        }
    }
);

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user !== null) {
            const compare = await bcrypt.compare(password, user.password);

            if (compare) {
                const accessToken = generateAccessToken({ id: user._id, role: 'pwa' });
                const refreshToken = generateRefreshToken({ id: user._id, role: 'pwa' });

                return res.status(200).json({
                    code: 200,
                    success: true,
                    message: 'OK',
                    data: {
                        user,
                        accessToken,
                        refreshToken,
                    },
                });
            } else {
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'Invalid credentials',
                    data: null,
                });
            }
        } else {
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'Invalid credentials',
                data: null,
            });
        }
    } catch {
        res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to login',
            data: null,
        });
    }
});

router.put('/refresh', requireAuth('pwa'), async (req, res) => {
    const refreshToken = String(req.body.refreshToken).replace('Bearer ', '')

    if (refreshToken === 'undefined') {
        return res.status(401).json({
            code: 401,
            message: 'You are unauthorized',
            success: false,
            data: null,
        });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken({ id: decoded.id, role: 'pwa' });

        res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: {
                accessToken: newAccessToken,
                refreshToken: refreshToken,
            },
        });
    } catch {
        res.status(403).json({
            code: 403,
            success: false,
            message: 'Invalid refresh token',
            data: null,
        });
    }
});

router.delete('/logout', requireAuth('pwa'), (req, res) => {
    res.status(200).json({
        code: 200,
        success: true,
        message: 'OK',
        data: null,
    });
});

module.exports = router;
