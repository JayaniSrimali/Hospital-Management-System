const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// @route GET /api/doctors
router.get('/', protect, async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('user', 'name email phone');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route POST /api/doctors
router.post('/', protect, admin, async (req, res) => {
    const { userId, specialization, experience, education, fees, workingHours } = req.body;
    try {
        const doctor = new Doctor({
            user: userId, specialization, experience, education, fees, workingHours
        });
        const createdDoctor = await doctor.save();
        res.status(201).json(createdDoctor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route DELETE /api/doctors/:id
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        await doctor.deleteOne();
        res.json({ message: 'Doctor removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
