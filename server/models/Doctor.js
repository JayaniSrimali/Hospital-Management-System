const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    education: { type: String },
    fees: { type: Number, required: true },
    workingHours: { type: String, default: '09:00 - 17:00' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
