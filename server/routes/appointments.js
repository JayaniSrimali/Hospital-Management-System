const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');

// @route GET /api/appointments
router.get('/', protect, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'patient') {
            query.patient = req.user._id;
        } else if (req.user.role === 'doctor') {
            query.doctor = req.user._id;
        }

        const appointments = await Appointment.find(query)
            .populate('patient', 'name email phone')
            .populate('doctor', 'name email phone');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route POST /api/appointments
router.post('/', protect, async (req, res) => {
    const { doctorId, date, time, reason } = req.body;
    try {
        const appointment = new Appointment({
            patient: req.user._id,
            doctor: doctorId,
            date,
            time,
            reason
        });
        const createdAppointment = await appointment.save();
        res.status(201).json(createdAppointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route PUT /api/appointments/:id/status
router.put('/:id/status', protect, async (req, res) => {
    const { status } = req.body;
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Not found' });

        appointment.status = status;
        const updated = await appointment.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
