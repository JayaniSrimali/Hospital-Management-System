const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema);
