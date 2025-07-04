import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    especie: '',
    porte: '',
    sexo: '',
    idade: '',
    descricao: '',
    status: 'disponivel', 
  });

  useEffect(() => {
    document.title = 'Editar animal';
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('access');
    axios.get(`http://localhost:8000/api/animais/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setForm(res.data))
    .catch(err => {
      console.error('Erro ao buscar animal:', err);
      alert('Erro ao carregar dados do animal.');
    });
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    axios.put(`http://localhost:8000/api/animais/${id}/`, form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('Animal atualizado com sucesso!');
      navigate(-1); 
    })
    .catch(err => {
      console.error('Erro ao atualizar:', err);
      alert('Erro ao salvar alterações.');
    });
  };

  return (
    <div className="container py-5">
      <h2>Editar Animal</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nome</label>
          <input name="nome" className="form-control" value={form.nome} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Espécie</label>
          <input name="especie" className="form-control" value={form.especie} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Porte</label>
          <input name="porte" className="form-control" value={form.porte} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Sexo</label>
          <select name="sexo" className="form-control" value={form.sexo} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Idade</label>
          <input type="number" name="idade" className="form-control" value={form.idade} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Descrição</label>
          <textarea name="descricao" className="form-control" value={form.descricao} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Status</label>
          <select name="status" className="form-control" value={form.status} onChange={handleChange} required>
            <option value="disponivel">Disponível</option>
            <option value="indisponivel">Indisponível</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Salvar</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/animais')}>Cancelar</button>
      </form>
    </div>
  );
}
