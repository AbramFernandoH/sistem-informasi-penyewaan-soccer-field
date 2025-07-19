const express = require('express');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const User = require('../models/user');
const { requireAuth } = require("../middleware");
const crypto = require('crypto');
const sendEmail = require("../utils/sendEmail");
const { registrationConfirmationTemplate } = require("../utils/htmlTemplates");

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, telephoneNumber, password, fullName } = req.body;
        const existingEmail = await User.findOne({ email });
        const existingPhoneNumber = await User.findOne({ telephoneNumber });

        if (existingEmail || existingPhoneNumber) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: `${existingEmail && existingPhoneNumber ? 'Email and phone number' : existingEmail ? 'Email' : 'Phone number'} already exists`,
                data: null,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Math.floor((Date.now() + 1000 * 60 * 60) / 1000); // expires in 1 hour

        const user = await User.create({
            ...req.body,
            password: hashedPassword,
            isVerified: false,
            emailVerificationToken: token,
            emailVerificationExpires: tokenExpiry,
        });

        // Send email with verification link
        const verifyLink = `${process.env.FRONT_END_URL}/verify-email?token=${token}`;
        await sendEmail(
            email,
            'Verifikasi Email Anda - Goedang Futsal',
            registrationConfirmationTemplate(fullName, verifyLink),
        );

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Registrasi berhasil. Silakan verifikasi email Anda.',
            data: {
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to register',
            data: null,
        });
    }
});

router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({
            emailVerificationToken: token,
        });

        const currentEpoch = Math.floor(Date.now() / 1000)

        if (user === null) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'User not found',
            });
        } else if (user.emailVerificationExpires < currentEpoch) {
            await User.deleteOne({
                emailVerificationToken: token,
            });

            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Token expired',
            });
        }

        user.isVerified = true;
        user.emailVerificationToken = '';
        user.emailVerificationExpires = null;
        await user.save();

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Email verified successfully. You can now log in.',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to verify email.',
        });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user !== null) {
            if (!user.isVerified) {
                return res.status(403).json({
                    code: 403,
                    success: false,
                    message: 'Please verify your email before logging in.',
                });
            }

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
        return res.status(500).json({
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
        const newAccessToken = generateAccessToken({ id: decoded.id, role: 'pwa' });

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: {
                accessToken: newAccessToken,
                refreshToken: refreshToken,
            },
        });
    } catch {
        return res.status(403).json({
            code: 403,
            success: false,
            message: 'Invalid refresh token',
            data: null,
        });
    }
});

router.delete('/logout', requireAuth('pwa'), (req, res) => {
    return res.status(200).json({
        code: 200,
        success: true,
        message: 'OK',
        data: null,
    });
});

module.exports = router;
