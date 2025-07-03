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
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(err => console.error('Erro ao buscar dados do usuário', err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };


  const goToAnimais = () => navigate('/animais');
  const goToOngs = () => navigate('/ongs');
  const goToUsuarios = () => navigate('/usuarios');
  const goToVisitas = () => navigate('/visitas');
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
          <>
            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">Gerenciar Animais</h5>
                  <p className="card-text">Veja e edite todos os animais cadastrados.</p>
                  <button className="btn btn-dark mt-auto" onClick={goToAnimais}>
                    Ver animais
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">Gerenciar ONGs</h5>
                  <p className="card-text">Gerencie as ONGs cadastradas.</p>
                  <button className="btn btn-dark mt-auto" onClick={goToOngs}>
                    Ver ONGs
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">Gerenciar Usuários</h5>
                  <p className="card-text">Controle os usuários da plataforma.</p>
                  <button className="btn btn-dark mt-auto" onClick={goToUsuarios}>
                    Ver usuários
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">Gerenciar Visitas</h5>
                  <p className="card-text">Veja e controle as visitas registradas.</p>
                  <button className="btn btn-dark mt-auto" onClick={goToVisitas}>
                    Ver visitas
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">Gerenciar Candidaturas</h5>
                  <p className="card-text">Veja todas as candidaturas em andamento.</p>
                  <button className="btn btn-dark mt-auto" onClick={goToCandidaturas}>
                    Ver candidaturas
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">Animais Adotados</h5>
                  <p className="card-text">Acompanhe os animais já adotados.</p>
                  <button className="btn btn-dark mt-auto" onClick={() => navigate('/meus-animais-adotados')}>
                    Ver adotados
                  </button>
                </div>
              </div>
            </div>
          </>
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
                  <button className="btn btn-success mt-auto" onClick={() => navigate('/animais/novo')}>
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
                  <button className="btn btn-success mt-auto" onClick={() => navigate('/meus-animais-adotados')}>
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
