import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AnimalList from './pages/AnimalList';
import AnimalCreate from './pages/AnimalCreate';

const isAuthenticated = () => !!localStorage.getItem('access');

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/animais"
        element={isAuthenticated() ? <AnimalList /> : <Navigate to="/login" />}
      />
      <Route
        path="/animais/novo"
        element={isAuthenticated() ? <AnimalCreate /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}