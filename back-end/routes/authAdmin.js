const express = require('express');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken} = require('../utils/jwt');
const AdminUser = require('../models/admin');
const { requireAuth } = require("../middleware");

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await AdminUser.findOne({ username });

        if (user !== null) {
            const compare = await bcrypt.compare(password, user.password);

            if (compare) {
                const accessToken = generateAccessToken({ id: user._id, role: 'cms' });
                const refreshToken = generateRefreshToken({ id: user._id, role: 'cms' });

                res.status(200).json({
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
                res.status(401).json({
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

router.put('/refresh', async (req, res) => {
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
        const newAccessToken = generateAccessToken({ id: decoded.id, role: 'cms' });

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

router.delete('/logout', requireAuth('cms'), (req, res) => {
    res.status(200).json({
        code: 200,
        success: true,
        message: 'OK',
        data: null,
    });
});

module.exports = router;
