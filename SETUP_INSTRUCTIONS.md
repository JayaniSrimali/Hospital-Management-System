# Advanced Hospital Management System
## Full-stack Web Application (React + Node.js + MongoDB)

### Overview
This is a production-ready Hospital Management System with role-based authentication built for Admins, Doctors, and Patients. It includes a frontend developed in React.js powered by Tailwind CSS and a Node.js/Express.js backend with MongoDB.

### Features Included
- **Role-based Auth:** Secure JWT login/registration (Admin, Doctor, Patient).
- **Admin Dashboard:** Manage doctors, patients, view charts and income stats.
- **Doctor Dashboard:** Manage appointments, write prescriptions for patients.
- **Patient Dashboard:** Book appointments, check history, and prescriptions.
- **Rest API:** A complete RESTful backend with routing and controllers.
- **Database Architecture:** Built with Mongoose holding schemas for users, doctors, patients, appointments, billing, and prescriptions.

### Pre-requisites
- **Node.js**: v16+
- **MongoDB**: Make sure you have a local instance running on `mongodb://localhost:27017` or change the `MONGODB_URI` in `server/.env`.

### Quick Setup

#### 1. Start the Backend Server
```bash
cd server
npm i        # Install dependencies
npm run start # Normally this is node index.js OR nodemon
```
> **Note**: A seeder script `node seeder.js` has already been run to populate dummy data!

#### 2. Start the Frontend Client
```bash
cd client
npm i        # Ensure all deps are installed
npm run dev  # Starts Vite local server
```

### Dummy Test Credentials
Use the following credentials to test out the different roles in the application.

- **Admin Login:**
  - Email: `admin@test.com`
  - Pass: `123456`

- **Doctor Login:**
  - Email: `doc@test.com`
  - Pass: `123456`

- **Patient Login:**
  - Email: `pat@test.com`
  - Pass: `123456`

### Folder Structure Overview
* `client/` : Contains the React.js + Tailwind UI.
  * `src/components/` : Includes Navbar, Sidebar, etc.
  * `src/pages/` : Includes Dashboard routes for admin, doctor, and patient roles + Login/Register.
* `server/` : Contains Express.js API logic and Database models.
  * `models/` : Mongoose Schemas (User, Doctor, Patient, Appointment, etc.)
  * `routes/` : RESTful API controllers (auth, billing, appointments, etc.)
  * `middleware/` : JWT Auth protection (`protect`, `admin`, `doctor`).
