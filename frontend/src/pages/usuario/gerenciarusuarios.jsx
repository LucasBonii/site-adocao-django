import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleEdit = (id) => {
    navigate(`/usuario/editar/${id}`);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    const token = localStorage.getItem('access');
    axios.delete(`http://localhost:8000/api/usuarios/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setUsuarios(usuarios.filter(user => user.id !== id));
      alert('Usuário excluído com sucesso.');
    })
    .catch(err => {
      console.error(err);
      alert('Erro ao excluir usuário.');
    });
  };

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
            <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{user.username}</strong> — {user.email} — Tipo: {user.tipo}
              </div>
              <div>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(user.id)}>
                  Editar
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
