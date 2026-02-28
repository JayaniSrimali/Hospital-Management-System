const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const Prescription = require('./models/Prescription');
const Billing = require('./models/Billing');
const Report = require('./models/Report');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const importData = async () => {
    try {
        await Prescription.deleteMany();
        await Billing.deleteMany();
        await Report.deleteMany();
        await Appointment.deleteMany();
        await User.deleteMany();
        await Doctor.deleteMany();
        await Patient.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('123456', salt);

        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@test.com',
            password,
            role: 'admin',
            phone: '1234567890'
        });

        const docUser = await User.create({
            name: 'John Doe',
            email: 'doc@test.com',
            password,
            role: 'doctor',
            phone: '0987654321'
        });

        const patUser = await User.create({
            name: 'Jane Smith',
            email: 'pat@test.com',
            password,
            role: 'patient',
            phone: '1122334455'
        });

        const docUser2 = await User.create({ name: 'Sarah Connor', email: 'sarah@test.com', password, role: 'doctor', phone: '0987654322' });
        const docUser3 = await User.create({ name: 'Emily Chen', email: 'emily@test.com', password, role: 'doctor', phone: '0987654323' });
        const docUser4 = await User.create({ name: 'Michael Brown', email: 'michael@test.com', password, role: 'doctor', phone: '0987654324' });

        await Doctor.insertMany([
            { user: docUser._id, specialization: 'Cardiologist', experience: 10, education: 'MD, MBBS', fees: 150 },
            { user: docUser2._id, specialization: 'Dermatologist', experience: 8, education: 'MD, FAAD', fees: 120 },
            { user: docUser3._id, specialization: 'Pediatrician', experience: 15, education: 'MD, DNB (Pediatrics)', fees: 100 },
            { user: docUser4._id, specialization: 'Neurologist', experience: 12, education: 'MD, DM (Neurology)', fees: 200 }
        ]);

        await Patient.create({
            user: patUser._id,
            age: 30,
            gender: 'female',
            address: '123 Main St, City',
            bloodGroup: 'O+'
        });

        // Add appointments
        const appt1 = await Appointment.create({
            patient: patUser._id,
            doctor: docUser._id,
            date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
            time: '10:00 AM',
            status: 'Approved',
            reason: 'General Checkup'
        });

        const appt2 = await Appointment.create({
            patient: patUser._id,
            doctor: docUser._id,
            date: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 days ago
            time: '02:30 PM',
            status: 'Completed',
            reason: 'Follow-up on blood pressure'
        });

        const appt3 = await Appointment.create({
            patient: patUser._id,
            doctor: docUser._id,
            date: new Date(new Date().setDate(new Date().getDate() + 7)), // Next week
            time: '09:15 AM',
            status: 'Pending',
            reason: 'Annual Physical'
        });

        // Add Prescriptions
        await Prescription.create({
            appointment: appt2._id,
            doctor: docUser._id,
            patient: patUser._id,
            medicines: [
                { name: 'Amoxicillin', dosage: '500mg', duration: '7 days', instructions: 'Take twice a day after meals' },
                { name: 'Paracetamol', dosage: '500mg', duration: '3 days', instructions: 'Take when having fever' }
            ],
            notes: 'Patient should rest and drink plenty of fluids.',
            date: new Date(new Date().setDate(new Date().getDate() - 5))
        });

        // Add Billing
        await Billing.insertMany([
            {
                patient: patUser._id,
                appointment: appt2._id,
                amount: 150.00,
                description: 'Consultation Fee - General Checkup with Medication Prescription',
                status: 'Unpaid',
                date: new Date(new Date().setDate(new Date().getDate() - 5))
            },
            {
                patient: patUser._id,
                amount: 85.00,
                description: 'Laboratory Services - Complete Blood Count (CBC)',
                status: 'Paid',
                date: new Date(new Date().setDate(new Date().getDate() - 10))
            },
            {
                patient: patUser._id,
                amount: 300.00,
                description: 'MRI Scan - Head and Neck',
                status: 'Unpaid',
                date: new Date(new Date().setDate(new Date().getDate() - 2))
            },
            {
                patient: patUser._id,
                amount: 45.00,
                description: 'Pharmacy Check',
                status: 'Paid',
                date: new Date(new Date().setDate(new Date().getDate() - 20))
            }
        ]);

        await Billing.create({
            patient: patUser._id,
            amount: 85.00,
            description: 'Laboratory Services - Complete Blood Count (CBC)',
            status: 'Paid',
            date: new Date(new Date().setDate(new Date().getDate() - 10))
        });

        // Add Medical Reports
        await Report.create({
            patient: patUser._id,
            doctor: docUser._id,
            reportName: 'Full Blood Count (FBC)',
            reportType: 'Laboratory Test',
            description: 'Patient shows normal hemoglobin levels. Minor iron deficiency noted.',
            fileUrl: 'sample_report_1.pdf',
            date: new Date(new Date().setDate(new Date().getDate() - 10))
        });

        await Report.create({
            patient: patUser._id,
            doctor: docUser._id,
            reportName: 'Chest X-Ray',
            reportType: 'Radiology',
            description: 'Lungs are clear. No abnormalities detected in the thoracic cavity.',
            fileUrl: 'sample_report_2.pdf',
            date: new Date(new Date().setDate(new Date().getDate() - 15))
        });

        await Report.create({
            patient: patUser._id,
            doctor: docUser3._id, // Emily Chen (Pediatrician)
            reportName: 'Lipid Profile',
            reportType: 'Laboratory Test',
            description: 'Cholesterol levels are slightly elevated. Dietary changes recommended.',
            fileUrl: 'sample_report_3.pdf',
            date: new Date(new Date().setDate(new Date().getDate() - 3))
        });

        console.log('Detailed Data & Reports Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

importData();
