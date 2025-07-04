import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = 'Dashboard';
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('access');

    if (token) {
      axios.get('http://localhost:8000/api/me/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        console.log("Resposta do /api/me/:", res.data);
        setUser(res.data);
      })
      .catch(err => console.error('Erro ao buscar dados do usuário', err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };


  const deletarOng = async (ongId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta ONG?')) return;

    const token = localStorage.getItem('access');
    try {
      await axios.delete(`http://localhost:8000/api/ongs/${ongId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('ONG excluída com sucesso.');
      setUser(prev => ({ ...prev, ong: null }));
    } catch (error) {
      console.error('Erro ao excluir ONG:', error);
      alert('Erro ao excluir ONG.');
    }
  };

  const goToAnimais = () => navigate('/animais');
  const goToOngs = () => navigate('/ongs');
  const goToUsuarios = () => navigate('/usuarios');
  const goToVisitas = () => navigate('/visitas');
  const goToCandidaturas = () => navigate('/candidaturas');

  if (!user) return navigate('/login');;

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
            {user.ong ? (
              <>
                <div className="col-md-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title">Meus Animais</h5>
                      <p className="card-text">Visualize os animais cadastrados pela sua ONG.</p>
                      <button className="btn btn-dark mt-auto" onClick={goToAnimais}>
                        Ver meus animais
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title">Gerenciar Visitas</h5>
                      <p className="card-text">Veja e controle as visitas registradas.</p>
                      <button className="btn btn-dark mt-auto" onClick={() => navigate('/visitas')}>
                        Ver visitas
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title">Gerenciar Candidaturas</h5>
                      <p className="card-text">Veja as candidaturas relacionadas aos seus animais.</p>
                      <button className="btn btn-dark mt-auto" onClick={() => navigate('/candidaturas')}>
                        Ver candidaturas
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
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

                <div className="col-md-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title">Editar ONG</h5>
                      <p className="card-text">Atualize os dados da sua ONG.</p>
                      <button className="btn btn-outline-primary mt-auto" onClick={() => navigate(`/ong/editar/${user.ong.id}`)}>
                        Editar ONG
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title">Excluir ONG</h5>
                      <p className="card-text">Remova sua ONG do sistema.</p>
                      <button
                        className="btn btn-outline-danger mt-auto"
                        onClick={() => deletarOng(user.ong.id)}
                      >
                        Excluir ONG
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="col-md-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title">Criar ONG</h5>
                    <p className="card-text">Cadastre sua ONG para começar a divulgar animais.</p>
                    <button className="btn btn-primary mt-auto" onClick={() => navigate('/ong/nova')}>
                      Criar ONG
                    </button>
                  </div>
                </div>
              </div>
            )}
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
