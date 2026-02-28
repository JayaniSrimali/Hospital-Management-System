const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const { protect } = require('../middleware/auth');

// @route GET /api/prescriptions
router.get('/', protect, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'patient') {
            query.patient = req.user._id;
        } else if (req.user.role === 'doctor') {
            query.doctor = req.user._id;
        }

        const prescriptions = await Prescription.find(query)
            .populate('patient', 'name')
            .populate('doctor', 'name')
            .populate('appointment', 'date');
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route POST /api/prescriptions
router.post('/', protect, async (req, res) => {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Forbidden' });

    const { appointmentId, patientId, medicines, notes } = req.body;
    try {
        const prescription = new Prescription({
            appointment: appointmentId,
            doctor: req.user._id,
            patient: patientId,
            medicines,
            notes
        });
        const createdPrescription = await prescription.save();
        res.status(201).json(createdPrescription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
