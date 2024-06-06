import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ExpensesPage from './pages/ExpensesPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import AuthContext, { AuthProvider } from './authContext';
import './App.css';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return null; 
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/expenses" element={<PrivateRoute element={ExpensesPage} />} />
            <Route path="/" element={<PrivateRoute element={ExpensesPage} />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
