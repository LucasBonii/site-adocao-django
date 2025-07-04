import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OngEdit() {
  const { id } = useParams();
  const navigate = useNavigate();


  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [descricao, setDescricao] = useState('');
  const [email, setEmail] = useState('');
  const [ong, setOng] = useState(null);

  useEffect(() => {
    document.title = 'Editar Ong';
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('access');
    axios.get(`http://localhost:8000/api/ongs/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setOng(res.data);
      setNome(res.data.nome || '');        
      setCnpj(res.data.cnpj || '');
      setDescricao(res.data.descricao || '');
      setEmail(res.data.user?.email || '');
    })
    .catch(err => {
      console.error('Erro ao carregar dados da ONG:', err);
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    axios.put(`http://localhost:8000/api/ongs/${id}/`, {
      nome,            
      cnpj,
      descricao,
      user: ong.user
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      alert('ONG atualizada com sucesso!');
      navigate('/dashboard');
    })
    .catch(err => {
      console.error('Erro ao atualizar ONG:', err);
      alert('Erro ao atualizar ONG');
    });
  };

  if (!ong) return <p>Carregando...</p>;

  return (
    <div className="container py-5">
      <h1>Editar ONG</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email do responsável</label>
          <input type="email" className="form-control" value={email} disabled />
        </div>


        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">CNPJ</label>
          <input
            type="text"
            className="form-control"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea
            className="form-control"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows="4"
          />
        </div>

        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/ongs')}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
