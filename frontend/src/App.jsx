import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddViolation from './pages/AddViolation';
import AddVehicle from './pages/AddVehicle';
import AddOwner from './pages/AddOwner';
import Vehicles from './pages/Vehicles';
import VehicleDetails from './pages/VehicleDetails';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Owners from './pages/Owners';
import Blacklist from './pages/Blacklist';
import PlaceholderPage from './pages/PlaceholderPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route 
              path="owners" 
              element={<ProtectedRoute allowedRoles={['ADMIN', 'OFFICER']}><Owners /></ProtectedRoute>} 
            />
            <Route 
              path="owners/new" 
              element={<ProtectedRoute allowedRoles={['ADMIN', 'OFFICER']}><AddOwner /></ProtectedRoute>} 
            />
            <Route 
              path="vehicles" 
              element={<ProtectedRoute allowedRoles={['ADMIN', 'OFFICER']}><Vehicles /></ProtectedRoute>} 
            />
            <Route 
              path="vehicles/new" 
              element={<ProtectedRoute allowedRoles={['ADMIN', 'OFFICER']}><AddVehicle /></ProtectedRoute>} 
            />
            <Route 
              path="vehicles/:id" 
              element={<ProtectedRoute allowedRoles={['ADMIN', 'OFFICER']}><VehicleDetails /></ProtectedRoute>} 
            />
            <Route 
              path="violations/new" 
              element={<ProtectedRoute allowedRoles={['ADMIN', 'OFFICER']}><AddViolation /></ProtectedRoute>} 
            />
            <Route 
              path="payments" 
              element={<ProtectedRoute allowedRoles={['ADMIN', 'CLERK']}><Payments /></ProtectedRoute>} 
            />
            <Route 
              path="blacklist" 
              element={<ProtectedRoute allowedRoles={['ADMIN', 'OFFICER']}><Blacklist /></ProtectedRoute>} 
            />
            <Route 
              path="reports" 
              element={<ProtectedRoute allowedRoles={['ADMIN']}><Reports /></ProtectedRoute>} 
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
