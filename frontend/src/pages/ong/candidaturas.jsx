import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Candidaturas() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [userTipo, setUserTipo] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('access');

    axios.get('http://localhost:8000/api/me/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setUserTipo(res.data.tipo);
    });

    axios.get('http://localhost:8000/api/candidaturas/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setCandidaturas(res.data);
    }).catch(err => console.error(err));
  }, []);

  const aprovarCandidatura = (id) => {
    const token = localStorage.getItem('access');
    axios.patch(`http://localhost:8000/api/candidaturas/${id}/aprovar/`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setCandidaturas(prev =>
        prev.map(c => c.id === id ? { ...c, status: 'aprovada' } : c)
      );
    }).catch(() => alert('Erro ao aprovar.'));
  };

  const rejeitarCandidatura = (id) => {
    const token = localStorage.getItem('access');
    axios.patch(`http://localhost:8000/api/candidaturas/${id}/rejeitar/`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setCandidaturas(prev =>
        prev.map(c => c.id === id ? { ...c, status: 'rejeitada' } : c)
      );
    }).catch(() => alert('Erro ao rejeitar.'));
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Minhas Candidaturas</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Voltar
        </button>
      </div>

      {candidaturas.length === 0 ? (
        <p className="text-center text-muted">Nenhuma candidatura encontrada.</p>
      ) : (
        <div className="row g-3">
          {candidaturas.map((c) => (
            <div className="col-md-6" key={c.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  {userTipo === 'tutor' && (
                    <>
                      <h5 className="card-title">{c.animal.nome}</h5>
                      <p className="card-text">
                        <strong>Data:</strong> {new Date(c.data_candidatura).toLocaleDateString()}<br />
                        <strong>Status:</strong> {c.status}
                      </p>
                    </>
                  )}

                  {userTipo === 'ong' && (
                    <>
                      <h5 className="card-title">{c.animal.nome}</h5>
                      <p className="card-text">
                        <strong>Adotante:</strong> {c.adotante.username}<br />
                        <strong>Data:</strong> {new Date(c.data_candidatura).toLocaleDateString()}<br />
                        <strong>Status:</strong> {c.status}
                      </p>

                      {c.status === 'pendente' && (
                        <div className="d-flex gap-2">
                          <button className="btn btn-success btn-sm" onClick={() => aprovarCandidatura(c.id)}>
                            Aprovar
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => rejeitarCandidatura(c.id)}>
                            Rejeitar
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
