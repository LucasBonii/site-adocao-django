import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');

    if (token) {
      axios.get('http://localhost:8000/api/me/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Erro ao buscar dados do usuário', err);
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  const goToAnimais = () => navigate('/animais');
  const goToCadastrarAnimal = () => navigate('/animais/novo');
  const goToAdotados = () => navigate('/meus-animais-adotados');
  const goToCandidaturas = () => navigate('/candidaturas');

  if (!user) return <p className="text-center mt-5">Carregando...</p>;

  return (
  <div className="container py-5 position-relative">
    <div className="position-absolute top-0 end-0 m-3">
      <button className="btn btn-danger" onClick={handleLogout}>
        Sair
      </button>
    </div>

    <h1 className="text-center mb-4">Dashboard</h1>
    <p className="text-center text-muted">Olá, {user.username}</p>

    <div className="row g-4 mt-4 justify-content-center">
      {user.tipo === 'admin' && (
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <h5 className="card-title">Administrador</h5>
              <p className="card-text">Gerencie todos os animais da plataforma.</p>
              <button className="btn btn-dark mt-auto" onClick={goToAnimais}>
                Ver todos os animais
              </button>
            </div>
          </div>
        </div>
      )}

      {user.tipo === 'ong' && (
        <>
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">Meus Animais</h5>
                <p className="card-text">Visualize os animais cadastrados pela sua ONG.</p>
                <button className="btn btn-primary mt-auto" onClick={goToAnimais}>
                  Ver meus animais
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">Cadastrar Animal</h5>
                <p className="card-text">Adicione um novo animal para adoção.</p>
                <button className="btn btn-success mt-auto" onClick={goToCadastrarAnimal}>
                  Cadastrar animal
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {user.tipo === 'tutor' && (
        <>
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">Animais Disponíveis</h5>
                <p className="card-text">Veja os animais disponíveis para adoção.</p>
                <button className="btn btn-primary mt-auto" onClick={goToAnimais}>
                  Ver animais
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">Meus Animais Adotados</h5>
                <p className="card-text">Acompanhe os animais que você adotou.</p>
                <button className="btn btn-success mt-auto" onClick={goToAdotados}>
                  Ver adotados
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">Minhas Candidaturas</h5>
                <p className="card-text">Acompanhe suas candidaturas em andamento.</p>
                <button className="btn btn-warning mt-auto" onClick={goToCandidaturas}>
                  Ver candidaturas
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);

}
