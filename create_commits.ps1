git init
git remote add origin https://github.com/JayaniSrimali/Hospital-Management-System.git

git add SETUP_INSTRUCTIONS.md
git commit -m "Initialize project and add setup instructions"

git add server/package.json server/package-lock.json server/.env
git commit -m "Initialize backend with Node.js and Express"

git add server/models/
git commit -m "Create MongoDB schemas for User, Doctor, Patient, Appointment, Prescription, Billing"

git add server/index.js server/seeder.js
git commit -m "Setup main server file and database seeder"

git add server/middleware/ server/routes/auth.js
git commit -m "Implement authentication system with JWT"

git add server/routes/
git commit -m "Add RESTful API routes for application entities"

git add client/package.json client/package-lock.json client/index.html client/vite.config.js client/src/main.jsx client/README.md .gitignore client/.gitignore
git commit -m "Initialize frontend React application"

git add client/src/index.css
git commit -m "Setup Tailwind CSS with glassmorphism styles"

git add client/src/components/
git commit -m "Build reusable UI components (Navbar, Sidebar)"

git add client/src/pages/Login.jsx client/src/pages/Register.jsx
git commit -m "Create Authentication UI (Login and Register pages)"

git add client/src/App.jsx
git commit -m "Implement React Router for frontend navigation"

git add client/src/pages/admin/
git commit -m "Build Admin Dashboard with statistics and charts"

git add client/src/pages/doctor/
git commit -m "Develop Doctor Dashboard for appointment management"

git add client/src/pages/patient/
git commit -m "Create Patient Dashboard and booking system"

git add .
git commit -m "Final improvements and bug fixes"

echo "All commits created successfully!"
