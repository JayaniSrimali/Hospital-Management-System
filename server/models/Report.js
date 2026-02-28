const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportName: { type: String, required: true },
    reportType: { type: String, required: true }, // e.g., Blood Test, X-Ray, etc.
    description: { type: String },
    fileUrl: { type: String }, // Path to the uploaded file
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
