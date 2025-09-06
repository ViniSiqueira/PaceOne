import React, { useEffect, useState } from 'react';
import './Home.css';
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
          value: Number(item.total),
        }));
        setStatusData(formatted);
      })
      .catch(err => console.error('Erro ao buscar dados:', err));
  }, []);

  return (
    <div className="home-page">
      <div className="container-header-home">
        <h2 className="text-welcome-home">Bem-vindo ao sistema!</h2>
        <h2 className="text-impact-phrase-home">
          <div><span className="text-impact-phrase-bold-home">Seu primeiro</span></div>
          <div><span className="text-impact-phrase-bold-home">passo</span> <span className="text-impact-phrase-highlight-home">muda</span></div>
          <div><span className="text-impact-phrase-highlight-home">seu</span> <span className="text-impact-phrase-bold-home">destino!</span></div>
        </h2>
      </div>

      <div className="dashboard-grid-home">
        {/* Atletas ativos */}
        <div className="card-dashboard-home card-ativos">
          <h3 className="card-title">Atletas ativos</h3>
          <div className="card-body chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" height={24} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Preparação de treinos */}
        <div className="card-dashboard-home card-prep">
          <h3 className="card-title">Preparação de treinos</h3>
          <div className="card-body chart">
            {/* outro gráfico aqui */}
          </div>
        </div>

        {/* Treinos da semana */}
        <div className="card-dashboard-home card-treinos">
          <h3 className="card-title">Treinos da semana</h3>
          <div className="card-body">
            {/* lista de treinos */}
          </div>
        </div>

        {/* Mensalidades */}
        <div className="card-dashboard-home card-mensal">
          <h3 className="card-title">Mensalidades</h3>
          <div className="card-body chart">
            {/* gráfico de mensalidades */}
          </div>
        </div>

        {/* Eventos */}
        <div className="card-dashboard-home card-eventos">
          <h3 className="card-title">Eventos</h3>
          <div className="card-body">
            <CalendarCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
