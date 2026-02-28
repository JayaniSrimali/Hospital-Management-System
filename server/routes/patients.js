const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect } = require('../middleware/auth');

// @route GET /api/patients
router.get('/', protect, async (req, res) => {
    try {
        const patients = await Patient.find().populate('user', 'name email phone');
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route POST /api/patients
router.post('/', protect, async (req, res) => {
    const { userId, age, gender, address, bloodGroup, medicalHistory } = req.body;
    try {
        const patient = new Patient({
            user: userId, age, gender, address, bloodGroup, medicalHistory
        });
        const createdPatient = await patient.save();
        res.status(201).json(createdPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route GET /api/patients/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate('user', 'name email phone');
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
