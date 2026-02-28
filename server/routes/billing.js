const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');
const { protect, admin } = require('../middleware/auth');

// @route GET /api/billing
router.get('/', protect, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'patient') {
            query.patient = req.user._id;
        }

        const bills = await Billing.find(query)
            .populate('patient', 'name')
            .populate('appointment', 'date');
        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route POST /api/billing
router.post('/', protect, admin, async (req, res) => {
    const { patientId, appointmentId, amount, description } = req.body;
    try {
        const bill = new Billing({
            patient: patientId, appointment: appointmentId, amount, description
        });
        const createdBill = await bill.save();
        res.status(201).json(createdBill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route PUT /api/billing/:id/pay
router.put('/:id/pay', protect, async (req, res) => {
    try {
        const bill = await Billing.findById(req.params.id);
        if (!bill) return res.status(404).json({ message: 'Not found' });

        bill.status = 'Paid';
        const updated = await bill.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
