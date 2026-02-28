import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/admin/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
import PatientDashboard from './pages/patient/Dashboard';
const ProtectedRoute = ({ user, children, role }) => {
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    } catch (err) {
      console.error("Failed to parse userInfo", err);
      localStorage.removeItem('userInfo');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 font-sans relative">
        {user && (
          <Sidebar
            user={user}
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {user && <Navbar user={user} onLogout={handleLogout} toggleSidebar={toggleSidebar} />}
          <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 ${user ? 'p-4 md:p-6 pb-20 md:pb-6' : ''}`}>
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
              <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />

              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute user={user} role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/*"
                element={
                  <ProtectedRoute user={user} role="doctor">
                    <DoctorDashboard user={user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/*"
                element={
                  <ProtectedRoute user={user} role="patient">
                    <PatientDashboard user={user} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/"
                element={
                  user ? (
                    <Navigate to={`/${user.role}`} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
