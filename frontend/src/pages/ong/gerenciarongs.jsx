import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GerenciarOngs() {
  const [ongs, setOngs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');

    axios.get('http://localhost:8000/api/ongs/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setOngs(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Erro ao carregar ONGs:', err);
      setLoading(false);
    });
  }, []);

  const editarOng = (id) => {
    navigate(`/ong/editar/${id}`);
  };

  const deletarOng = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta ONG?')) return;

    const token = localStorage.getItem('access');
    axios.delete(`http://localhost:8000/api/ongs/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setOngs(ongs.filter(ong => ong.id !== id));
      alert('ONG excluída com sucesso.');
    })
    .catch(err => {
      console.error(err);
      alert('Erro ao excluir ONG.');
    });
  };


  if (loading) return <p>Carregando ONGs...</p>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gerenciar ONGs</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Voltar à Dashboard
        </button>
      </div>

      {ongs.length === 0 ? (
        <p>Nenhuma ONG encontrada.</p>
      ) : (
        <ul className="list-group">
          {ongs.map(ong => (
            <li key={ong.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{ong.nome}</strong> —  {ong.descricao} - {ong.email}
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => editarOng(ong.id)}>
                  Editar
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deletarOng(ong.id)}>
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
