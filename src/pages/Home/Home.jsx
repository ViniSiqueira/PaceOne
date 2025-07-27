import React from 'react';
import './Home.css'

const Home = () => {
  return (
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
  );
};

export default Home;