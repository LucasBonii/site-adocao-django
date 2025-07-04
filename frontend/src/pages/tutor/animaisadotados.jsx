import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AnimaisAdotados() {
  const [animais, setAnimais] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Animais adotados';
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('access');

    axios.get('http://localhost:8000/api/meus-animais-adotados/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAnimais(res.data))
    .catch(err => {
      console.error(err);
      alert('Erro ao carregar seus animais adotados');
    });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este animal?')) return;

    const token = localStorage.getItem('access');
    axios.delete(`http://localhost:8000/api/animais/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setAnimais(animais.filter(animal => animal.id !== id));
      alert('Animal excluído com sucesso.');
    })
    .catch(err => {
      console.error(err);
      alert('Erro ao excluir animal.');
    });
  };

  const handleEdit = (tutorAnimalId) => {
    navigate(`/tutor-animal/editar/${tutorAnimalId}`);
  };

  if (animais.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="mb-3">Meus Animais Adotados</h2>
        <p className="text-muted">Você ainda não adotou nenhum animal.</p>
        <button className="btn btn-secondary mt-3" onClick={() => navigate('/dashboard')}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Meus Animais Adotados</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Voltar
        </button>
      </div>

      <div className="row g-4">
        {animais.map(animal => (
          <div className="col-md-4" key={animal.tutor_animal_id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">{animal.nome}</h5>
                  <p className="card-text">
                    <strong>Espécie:</strong> {animal.especie}<br />
                    <strong>Porte:</strong> {animal.porte}<br />
                    <strong>Idade:</strong> {animal.idade} anos<br />
                    <strong>Desde:</strong>{' '}
                    {new Date(animal.data_inicio_responsabilidade).toLocaleDateString('pt-BR')}<br />
                  </p>
                </div>

                <div className="mt-3 d-flex justify-content-between">
                  <button  className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(animal.tutor_animal_id)}>
                    Editar
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(animal.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
