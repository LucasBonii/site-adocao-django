import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarVisita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visita, setVisita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    document.title = 'Editar visita';
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('access');

    axios.get(`http://localhost:8000/api/visitas/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setVisita(res.data);
        setLoading(false);
      })
      .catch(() => {
        setErro('Erro ao carregar visita');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setVisita({ ...visita, [e.target.name]: e.target.value });
  };

  const handleSalvar = () => {
    const token = localStorage.getItem('access');
    setSalvando(true);

    axios.put(`http://localhost:8000/api/visitas/${id}/`, visita, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => navigate('/gerenciar-visitas'))
      .catch(() => {
        setErro('Erro ao salvar alterações');
        setSalvando(false);
      });
  };

  if (loading) return <p>Carregando visita...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className="container py-5">
      <h2>Editar Visita</h2>

      <div className="mb-3">
        <label className="form-label">Nome do Tutor</label>
        <input
          type="text"
          className="form-control"
          name="tutor_nome"
          value={visita.tutor_nome}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Nome do Animal</label>
        <input
          type="text"
          className="form-control"
          name="animal_nome"
          value={visita.animal_nome}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Observações</label>
        <textarea
          className="form-control"
          name="observacoes"
          value={visita.observacoes}
          onChange={handleChange}
        />
      </div>

      <button className="btn btn-primary me-2" onClick={handleSalvar} disabled={salvando}>
        {salvando ? 'Salvando...' : 'Salvar Alterações'}
      </button>
      <button className="btn btn-secondary" onClick={() => navigate('/visitas')}>
        Cancelar
      </button>
    </div>
  );
}
