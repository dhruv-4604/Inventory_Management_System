import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './fonts.css';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import Main from './Main';
import Dashboard from './Dashboard';
import Item from './Item';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected routes */}
        <Route path="/" element={<Main />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Item />} />
          {/* Add more routes here as needed */}
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;