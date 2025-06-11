const express = require('express');
const router = express.Router();
const AdminUser = require('../models/admin');
const { requireAuth } = require('../middleware');
const bcrypt = require("bcrypt");

router.get('/', requireAuth('cms'), async (req, res) => {
    try {
        const { skip } = req.query
        const currentSkip = skip ? Number(skip) : 0
        const listUser = await AdminUser.find({}).limit(10).skip(currentSkip);
        const totalUser = await AdminUser.countDocuments({});
        const metadata = {
            limit: 10,
            skip: currentSkip,
            count: totalUser,
        };

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: {
                items: listUser,
                metadata,
            },
        });
    } catch {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to get list user',
        });
    }
})

router.post('/add', requireAuth('cms'), async (req, res) => {
    try {
        const { username, password } = req.body;
        const existing = await AdminUser.findOne({ username });

        if (existing) {
            res.status(400).json({
                code: 400,
                success: false,
                message: 'User already exists',
                data: null,
            });
        } else {
            const hashed = await bcrypt.hash(password, 10);
            const admin = await AdminUser.create({ ...req.body, password: hashed });

            res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data: admin,
            });
        }
    } catch {
        res.status(500).json({
            code: 500,
            message: 'Failed to create admin user',
            success: false,
        });
    }
})

router.patch('/:username/edit', requireAuth('cms'), async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const admin = await AdminUser.findOne({ username: req.params.username });

        if (admin !== null) {
            if (password && password.length > 0) {
                admin.password = await bcrypt.hash(password, 10);
            }

            admin.set({
                ...admin,
                ...rest,
            });

            const data = await admin.save();

            res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data,
            });
        } else {
            res.status(404).json({
                code: 404,
                message: 'Not found',
                success: false,
                data: null,
            });
        }
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: 'Failed to edit admin user',
            success: false,
        });
    }
})

router.delete('/:username', requireAuth('cms'), async (req, res) => {
    try {
        const admin = await AdminUser.findOne({ username: req.params.username });

        if (admin !== null) {
            await AdminUser.deleteOne({ _id: admin._id });

            res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data: null,
            });
        } else {
            res.status(404).json({
                code: 404,
                message: 'Not found',
                success: false,
                data: null,
            });
        }
    } catch (e) {
        res.status(500).json({
            code: 500,
            message: 'Failed to delete admin user',
            success: false,
        });
    }
})

module.exports = router;

