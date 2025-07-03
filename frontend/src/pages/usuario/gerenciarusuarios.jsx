import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GerenciarUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');

    axios.get('http://localhost:8000/api/usuarios/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setUsuarios(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Erro ao carregar usuários:', err);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Gerenciar Usuários</h2>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Voltar à Dashboard
            </button>
      </div>
      {usuarios.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <ul className="list-group">
          {usuarios.map(user => (
            <li key={user.id} className="list-group-item">
              <strong>{user.username}</strong> — {user.email} — Tipo: {user.tipo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
