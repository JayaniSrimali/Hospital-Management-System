const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const importData = async () => {
    try {
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

        await Doctor.create({
            user: docUser._id,
            specialization: 'Cardiologist',
            experience: 10,
            education: 'MD, MBBS',
            fees: 150
        });

        await Patient.create({
            user: patUser._id,
            age: 30,
            gender: 'female',
            address: '123 Main St, City',
            bloodGroup: 'O+'
        });

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

importData();
