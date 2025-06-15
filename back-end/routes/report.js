require('dotenv').config();
const express = require('express');
const router = express.Router();
const Report = require('../models/report');
const { requireAuth} = require('../middleware');

router.get('/', requireAuth('cms'), async (req, res) => {
    try {
        const { skip } = req.query
        const currentSkip = skip ? Number(skip) : 0
        const listReport = await Report.find({}).limit(10).skip(currentSkip);
        const totalReport = await Report.countDocuments({});

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: {
                items: listReport,
                metadata: {
                    limit: 10,
                    skip: currentSkip,
                    count: totalReport,
                },
            },
        });
    } catch {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to get list report',
            data: null,
        });
    }
})

router.post('/add', requireAuth('cms'), async (req, res) => {
    try {
        const data = await Report.create(req.body);

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
            message: 'Failed to create Report',
            data: null,
        });
    }
})

router.patch('/:reportId/edit', requireAuth('cms'), async (req, res) => {
    try {
        const editedReport = await Report.findById(req.params.reportId);

        if (editedReport !== null) {
            editedReport.set({
                ...editedReport,
                ...req.body,
            });

            const data = await editedReport.save();

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
            message: 'Failed to edit Report',
            data: null,
        });
    }
})

router.delete('/:reportId', requireAuth('cms'), async (req, res) => {
    try {
        const report = await Report.findById(req.params.reportId);

        if (report !== null) {
            await Report.deleteOne({ _id: report._id });

            return res.status(200).json({
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
            message: 'Failed to delete report',
            data: null,
        });
    }
})

module.exports = router;
