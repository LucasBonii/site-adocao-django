import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Visitas() {
  const [visitas, setVisitas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');

    axios.get('http://localhost:8000/api/visitas/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      setVisitas(res.data);
    })
    .catch(err => {
      console.error(err);
      navigate('/dashboard');
    });
  }, []);

  return (
    <div>
      <h1>Minhas Visitas</h1>
      <ul>
        {visitas.map((v, index) => (
          <li key={index}>
            {v.tutor_nome} visitou {v.animal_nome} em {v.data}
            <br />
            {v.observacoes && `Obs: ${v.observacoes}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
