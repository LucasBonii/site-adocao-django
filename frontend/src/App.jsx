import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/dashboard';
import AnimalList from './pages/animallist';
import AnimalCreate from './pages/animalcreate';
import Register from './pages/register';
import Candidaturas from './pages/candidaturas';
import Visitas from './pages/visitas';
import AnimaisAdotados from './pages/animaisadotados';
const isAuthenticated = () => !!localStorage.getItem('access');

export default function App() {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:8000/api/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserType(data.tipo);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <div>

      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard userType={userType} /> : <Navigate to="/login" />}
        />
        <Route
          path="/animais"
          element={isAuthenticated() ? <AnimalList /> : <Navigate to="/login" />}
        />
        <Route
          path="/candidaturas"
          element={isAuthenticated() ? <Candidaturas /> : <Navigate to="/login" />}
        />

        <Route
          path="/animais/novo"
          element={isAuthenticated() ? <AnimalCreate /> : <Navigate to="/login" />}
        />

        <Route path="/meus-animais-adotados" element={isAuthenticated() ? <AnimaisAdotados /> : <Navigate to="/login" />} />

        <Route
          path="/visitas"
          element={isAuthenticated() ? <Visitas/> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}