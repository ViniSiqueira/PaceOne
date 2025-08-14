import React, { useEffect, useState } from 'react';
import './Home.css'
import CalendarCard from '../../components/CalendarCard/CalendarCard';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BACKEND_URL } from '../../constants/url';

const COLORS = ['#00C49F', '#FF8042'];

const Home = () => {
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    fetch(`${API_BACKEND_URL}/api/clientes/status-count`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          name: item.status === 'Ativo' ? 'Ativos' : 'Inativos',
          value: Number(item.total)
        }));
        setStatusData(formatted);
      })
      .catch(err => console.error('Erro ao buscar dados:', err));
  }, []);

  return (
    <div className="home-page">
      <div className='container-header-home'>
        <h2 className='text-welcome-home'>Bem-vindo ao sistema!</h2>
        <h2 className="text-impact-phrase-home">
          <div>
            <span className="text-impact-phrase-bold-home">Seu primeiro</span>
          </div>
          <div>
            <span className="text-impact-phrase-bold-home">passo</span> <span className="text-impact-phrase-highlight-home">muda</span>
          </div>
          <div>
            <span className="text-impact-phrase-highlight-home">seu</span> <span className="text-impact-phrase-bold-home">destino!</span>
          </div>
        </h2>
      </div>
      <div className="dashboard-grid-home">
        <div className="card-dashboard-home">
          <h3 style={{ margin: 0, marginBottom: 10 }}>Atletas ativos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="verical" verticalAlign="center" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card-dashboard-home">Preparação de treinos</div>
        <div className="card-dashboard-home card-treinos-home">Treinos da semana</div>
        <div className="card-dashboard-home">Mensalidades</div>
        <div className="card-dashboard-home">
          <h3 style={{ margin: 0 }}>Eventos</h3>
          <CalendarCard />
        </div>
      </div>
    </div>
  );
};

export default Home;