import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarTutorAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registro, setRegistro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    document.title = 'Editar Tutor-Animal';
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('access');

    axios.get(`http://localhost:8000/api/tutores-animais/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setRegistro(res.data);
      setLoading(false);
    })
    .catch(() => {
      setErro('Erro ao carregar registro');
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    setRegistro({ ...registro, [e.target.name]: e.target.value });
  };

  const handleSalvar = () => {
    const token = localStorage.getItem('access');
    setSalvando(true);

    axios.put(`http://localhost:8000/api/tutores-animais/${id}/`, registro, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => navigate('/meus-animais-adotados'))
    .catch(() => {
      setErro('Erro ao salvar alterações');
      setSalvando(false);
    });
  };

  if (loading) return <p>Carregando registro...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className="container py-5">
      <h2>Editar Responsabilidade</h2>

      <div className="mb-3">
        <label className="form-label">Data de Início da Responsabilidade</label>
        <input
          type="date"
          className="form-control"
          name="data_inicio_responsabilidade"
          value={registro.data_inicio_responsabilidade}
          onChange={handleChange}
        />
      </div>

      <button className="btn btn-primary me-2" onClick={handleSalvar} disabled={salvando}>
        {salvando ? 'Salvando...' : 'Salvar Alterações'}
      </button>
      <button className="btn btn-secondary" onClick={() => navigate('/meus-animais-adotados')}>
        Cancelar
      </button>
    </div>
  );
}
