require('dotenv').config();
const express = require('express');
const router = express.Router();
const Report = require('../models/report');
const { requireAuth} = require('../middleware');

router.get('/', requireAuth('cms'), async (req, res) => {
    try {
        const {
            skip = 0,
            search = '',
            sortBy = 'desc',
            startDate,
            endDate,
        } = req.query;

        const currentSkip = Number(skip);
        const sortOptions = {
            createdAt: sortBy === 'asc' ? 1 : -1
        };

        const filters = {};

        // Search by name (case-insensitive)
        if (search) {
            filters.name = { $regex: search, $options: 'i' };
        }

        // Filter by date range
        if (startDate || endDate) {
            filters.createdAt = {};
            if (startDate) filters.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const nextDay = new Date(endDate);
                nextDay.setDate(nextDay.getDate() + 1);
                filters.createdAt.$lt = nextDay; // equivalent to "less than end of day"
            }
        }

        const [listReport, totalReport] = await Promise.all([
            Report.find(filters)
                .populate('createdBy')
                .sort(sortOptions)
                .limit(10)
                .skip(currentSkip),
            Report.countDocuments(filters)
        ]);

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

router.get('/:reportId', requireAuth('cms'), async (req, res) => {
    try {
        const report = await Report.findById(req.params.reportId);

        if (report !== null) {
            return res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data: report,
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
            message: 'Failed to get detail report',
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
