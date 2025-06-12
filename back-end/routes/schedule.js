require('dotenv').config();
const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const { requireAuth} = require('../middleware');

router.get('/', async (req, res) => {
    try {
        const { skip } = req.body
        const currentSkip = skip ? Number(skip) : 0
        const listSchedule = await Schedule.find({}).limit(10).skip(currentSkip);
        const totalSchedule = await Schedule.countDocuments({});

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: {
                items: listSchedule,
                metadata: {
                    limit: 10,
                    skip: currentSkip,
                    count: totalSchedule,
                },
            },
        });
    } catch {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to get list schedule',
            data: null,
        });
    }
})

router.post('/add', async (req, res) => {
    try {
        const data = await Schedule.create(req.body);

        return res.status(200).json({
            code: 200,
            message: 'OK',
            success: true,
            data,
        });
    } catch {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to create schedule',
            data: null,
        });
    }
})

router.patch('/:scheduleId/edit', requireAuth('cms'), async (req, res) => {
    try {
        const editedSchedule = await Schedule.findById(req.params.scheduleId);

        if (editedSchedule !== null) {
            editedSchedule.set({
                ...editedSchedule,
                ...req.body,
            });

            const data = await editedSchedule.save();

            return res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data,
            });
        } else {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Not found',
                data: null,
            });
        }
    } catch {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to edit schedule',
            data: null,
        });
    }
})

router.delete('/:scheduleId', requireAuth('cms'), async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.scheduleId);

        if (schedule !== null) {
            await Schedule.deleteOne({ _id: schedule._id });

            res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data: null,
            });
        } else {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Not found',
                data: null,
            });
        }
    } catch (e) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to delete schedule',
            data: null,
        });
    }
})

module.exports = router;
