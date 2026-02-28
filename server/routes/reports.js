const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');

// @route GET /api/reports
// @desc Get all reports for logged in patient or all if admin
router.get('/', protect, async (req, res) => {
    try {
        console.log('Fetching reports for user:', req.user._id, 'Role:', req.user.role);
        let query = {};
        if (req.user.role === 'patient') {
            query.patient = req.user._id;
        }
        console.log('Query:', query);

        const reports = await Report.find(query)
            .populate('patient', 'name email')
            .populate('doctor', 'name specialization')
            .sort({ date: -1 });

        console.log('Found reports:', reports.length);
        res.json(reports);
    } catch (err) {
        console.error('Reports fetch error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
