const express = require('express');
const router = express.Router();
const Field = require('../models/field');
const { requireAuth } = require('../middleware');

router.get('/', requireAuth('cms'), async (req, res) => {
    try {
        const { skip } = req.query
        const currentSkip = skip ? Number(skip) : 0
        const listField = await Field.find({}).limit(10).skip(currentSkip);
        const totalField = await Field.countDocuments({});
        const metadata = {
            limit: 10,
            skip: currentSkip,
            count: totalField,
        };

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: {
                items: listField,
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
        const { name } = req.body;
        const existing = await Field.findOne({ name });

        if (existing) {
            res.status(400).json({
                code: 400,
                success: false,
                message: 'Field name already exists',
                data: null,
            });
        } else {
            const data = await Field.create(req.body);

            res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data,
            });
        }
    } catch {
        res.status(500).json({
            code: 500,
            message: 'Failed to create field',
            success: false,
        });
    }
})

router.patch('/:fieldId/edit', requireAuth('cms'), async (req, res) => {
    try {
        const field = await Field.findById(req.params.fieldId);

        if (field !== null) {
            field.set(req.body);

            const data = await field.save();

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
            message: 'Failed to edit field',
            success: false,
        });
    }
})

router.delete('/:fieldId', requireAuth('cms'), async (req, res) => {
    try {
        const field = await Field.findById(req.params.fieldId);

        if (field !== null) {
            await Field.deleteOne({ _id: field._id });

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
            message: 'Failed to delete field',
            success: false,
        });
    }
})

module.exports = router;
