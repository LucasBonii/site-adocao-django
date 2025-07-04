import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NovaOng() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    cnpj: '',
  });

  useEffect(() => {
    document.title = 'Criar Ong';
  }, []);


  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const token = localStorage.getItem('access');
    setSalvando(true);

    axios.post('http://localhost:8000/api/ongs/', form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('ONG criada com sucesso!');
      navigate('/dashboard');
    })
    .catch(err => {
      console.error(err);
      setErro('Erro ao criar ONG');
      setSalvando(false);
    });
  };

  return (
    <div className="container py-5">
      <h2>Cadastrar Nova ONG</h2>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="mb-3">
        <label className="form-label">Nome da ONG</label>
        <input
          type="text"
          className="form-control"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descrição</label>
        <textarea
          className="form-control"
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">CNPJ</label>
        <input
          type="text"
          className="form-control"
          name="cnpj"
          value={form.cnpj}
          onChange={handleChange}
          required
        />
      </div>

      <button className="btn btn-success me-2" onClick={handleSubmit} disabled={salvando}>
        {salvando ? 'Salvando...' : 'Cadastrar'}
      </button>
      <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
        Cancelar
      </button>
    </div>
  );
}
