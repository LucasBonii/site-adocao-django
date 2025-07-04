import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/usuario/login';
import Dashboard from './pages/dashboard';
import AnimalList from './pages/animais/animallist';
import AnimalCreate from './pages/animais/animalcreate';
import EditarAnimal from './pages/animais/editaranimal';
import Register from './pages/usuario/register';
import Candidaturas from './pages/ong/candidaturas';
import Visitas from './pages/ong/visitas';
import AnimaisAdotados from './pages/tutor/animaisadotados';
import GerenciarOngs from './pages/ong/gerenciarongs';
import GerenciarUsuarios from './pages/usuario/gerenciarusuarios';
import OngEdit from './pages/ong/ongedit';
import EditarUsuario from './pages/usuario/editusuario';
import EditarTutorAnimal from './pages/tutor/edittutoranimal';
import EditarVisita from './pages/ong/editvisita';
import CadastrarOng from './pages/ong/criarong';
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

        <Route path="/usuarios" element={isAuthenticated() ? <GerenciarUsuarios /> : <Navigate to="/login" />} />

        <Route path="/ongs" element={isAuthenticated() ? <GerenciarOngs /> : <Navigate to="/login" />} />
        <Route path="/ong/nova" element={isAuthenticated() ? <CadastrarOng /> : <Navigate to="/login" />} />
        <Route path="/ong/editar/:id" element={isAuthenticated() ? <OngEdit /> : <Navigate to="/login" />} />

        <Route path="/animais/editar/:id" element={isAuthenticated() ? <EditarAnimal /> : <Navigate to="/login" />} />
        <Route path="/usuario/editar/:id" element={isAuthenticated() ? <EditarUsuario /> : <Navigate to="/login" />} />
        <Route path="/tutor-animal/editar/:id" element={isAuthenticated() ? <EditarTutorAnimal /> : <Navigate to="/login" />} />

        <Route path="/visitas" element={isAuthenticated() ? <Visitas/> : <Navigate to="/login" />}/>
        <Route path="/visitas/editar/:id" element={isAuthenticated() ? <EditarVisita /> : <Navigate to="/login" />} />


        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}