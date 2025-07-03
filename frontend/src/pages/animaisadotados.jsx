import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AnimaisAdotados() {
  const [animais, setAnimais] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');

    axios.get('http://localhost:8000/api/meus-animais-adotados/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      setAnimais(res.data);
    }).catch(err => {
      console.error(err);
      alert('Erro ao carregar seus animais adotados');
    });
  }, []);

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
          <div className="col-md-4" key={animal.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{animal.nome}</h5>
                <p className="card-text">
                  <strong>Espécie:</strong> {animal.especie}<br />
                  <strong>Porte:</strong> {animal.porte}<br />
                  <strong>Idade:</strong> {animal.idade} anos<br />
                  <strong>Desde:</strong>{' '}
                  {new Date(animal.data_inicio_responsabilidade).toLocaleDateString('pt-BR')}<br />
                  <strong>Observações:</strong> {animal.observacoes || 'Nenhuma'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
