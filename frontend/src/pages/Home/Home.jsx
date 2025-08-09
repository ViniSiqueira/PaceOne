import React from 'react';
import './Home.css'
import CalendarCard from '../../components/CalendarCard/CalendarCard';

const Home = () => {
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
        <div className="card-dashboard-home">Atletas ativos</div>
        <div className="card-dashboard-home">Preparação de treinos</div>
        <div className="card-dashboard-home card-treinos-home">Treinos da semana</div>
        <div className="card-dashboard-home">Mensalidades</div>
        <div className="card-dashboard-home">
          <h3>Eventos</h3>
          <CalendarCard />
        </div>
      </div>
    </div>
  );
};

export default Home;