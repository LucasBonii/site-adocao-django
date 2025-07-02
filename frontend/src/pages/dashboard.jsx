import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');

    if (token) {
      axios.get('http://localhost:8000/api/me/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Erro ao buscar dados do usuário', err);
      });
    }
  }, []);

  const goToAnimais = () => navigate('/animais');
  const goToCadastrarAnimal = () => navigate('/animais/novo');

  if (!user) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      {user.tipo === 'admin' && (
        <div>
          <p>Você é um administrador.</p>
          <button onClick={goToAnimais}>Ver todos os animais</button>
        </div>
      )}

      {user.tipo === 'ong' && (
        <div>
          <p>Você é uma ONG.</p>
          <button onClick={goToAnimais}>Ver meus animais</button>
          <button onClick={goToCadastrarAnimal}>Cadastrar novo animal</button>
        </div>
      )}

      {user.tipo === 'tutor' && (
        <div>
          <p>Você é um tutor.</p>
          <button onClick={goToAnimais}>Ver animais disponíveis</button>
        </div>
      )}
    </div>
  );
}