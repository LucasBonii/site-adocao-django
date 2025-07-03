import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');

    axios.get(`http://localhost:8000/api/usuarios/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setUsuario(res.data);
      setLoading(false);
    })
    .catch(err => {
      setErro('Erro ao carregar usuário');
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSalvar = () => {
    const token = localStorage.getItem('access');
    setSalvando(true);
    axios.put(`http://localhost:8000/api/usuarios/${id}/`, usuario, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => navigate('/gerenciar-usuarios'))
    .catch(err => {
      console.error(err);
      setErro('Erro ao salvar alterações');
      setSalvando(false);
    });
  };

  if (loading) return <p>Carregando usuário...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className="container py-5">
      <h2>Editar Usuário</h2>

      <div className="mb-3">
        <label className="form-label">Nome de usuário</label>
        <input className="form-control" name="username" value={usuario.username} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input className="form-control" name="email" value={usuario.email} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Tipo</label>
        <select className="form-control" name="tipo" value={usuario.tipo} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="ong">ONG</option>
          <option value="tutor">Tutor</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Telefone</label>
        <input className="form-control" name="telefone" value={usuario.telefone} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Cidade</label>
        <input className="form-control" name="cidade" value={usuario.cidade} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Estado</label>
        <input className="form-control" name="estado" value={usuario.estado} onChange={handleChange} />
      </div>

      <button className="btn btn-primary me-2" onClick={handleSalvar} disabled={salvando}>
        {salvando ? 'Salvando...' : 'Salvar Alterações'}
      </button>
      <button className="btn btn-secondary" onClick={() => navigate('/gerenciar-usuarios')}>
        Cancelar
      </button>
    </div>
  );
}
