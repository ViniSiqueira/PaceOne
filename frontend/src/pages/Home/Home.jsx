import React, { useEffect, useMemo, useState } from 'react';
import './Home.css';
import CalendarCard from '../../components/CalendarCard/CalendarCard';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { API_BACKEND_URL } from '../../constants/url';

const COLORS = ['#00C49F', '#FF8042'];
const BAR_COLORS = { entradas: '#2e7d32', saidas: '#c62828' };

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function yyyymm(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function lastNMonthsLabels(n = 6) {
  const base = new Date();
  base.setDate(1);
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
    out.push({
      key: yyyymm(d),
      label: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }), // ex: set/25
    });
  }
  return out;
}

function calcValorEfetivo({ valor = 0, juros = 0, acrescimo = 0, desconto = 0 }) {
  const n = Number(valor) + Number(juros || 0) + Number(acrescimo || 0) - Number(desconto || 0);
  return isNaN(n) ? 0 : n;
}

const Home = () => {
  const [statusData, setStatusData] = useState([]);
  const [titulosPagar, setTitulosPagar] = useState([]);
  const [titulosReceber, setTitulosReceber] = useState([]);

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

  useEffect(() => {
    const load = async () => {
      try {
        const [pagarRes, receberRes] = await Promise.all([
          fetch(`${API_BACKEND_URL}/api/financeiro/pagar`),
          fetch(`${API_BACKEND_URL}/api/financeiro/receber`),
        ]);
        const pagar = await pagarRes.json();
        const receber = await receberRes.json();
        setTitulosPagar(Array.isArray(pagar) ? pagar : []);
        setTitulosReceber(Array.isArray(receber) ? receber : []);
      } catch (e) {
        console.error('Erro ao buscar títulos:', e);
      }
    };
    load();
  }, []);

  const cashflowData = useMemo(() => {
    const months = lastNMonthsLabels(3); // ajuste se quiser mais/menos meses
    const map = new Map(months.map(m => [m.key, { month: m.label, entradas: 0, saidas: 0 }]));

    // Entradas realizadas (a receber com data_recebimento)
    for (const t of titulosReceber) {
      if (t.data_recebimento) {
        const key = yyyymm(t.data_recebimento);
        if (map.has(key)) {
          const atual = map.get(key);
          atual.entradas += calcValorEfetivo(t);
        }
      }
    }

    // Saídas realizadas (a pagar com data_pagamento)
    for (const t of titulosPagar) {
      if (t.data_pagamento) {
        const key = yyyymm(t.data_pagamento);
        if (map.has(key)) {
          const atual = map.get(key);
          atual.saidas += calcValorEfetivo(t);
        }
      }
    }

    return Array.from(map.values());
  }, [titulosPagar, titulosReceber]);

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

        <div className="card-dashboard-home card-mensal">
          <h3 className="card-title">Fluxo de Caixa (Entradas x Saídas)</h3>
          <div className="card-body chart chart-overflow"> {/* classe nova */}
            <ResponsiveContainer width="100%" height="100%" minHeight={260}>
              <BarChart
                data={cashflowData}
                margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
                barCategoryGap={12}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickMargin={8}
                  interval={0}                 // mostra todos os meses
                />
                <YAxis
                  width={82}                   // espaço para “R$ 9.999,99”
                  tickFormatter={(v) => BRL.format(v)}
                  tickMargin={8}
                  domain={[0, 'auto']}
                  allowDecimals={false}
                />
                <Tooltip formatter={(v) => BRL.format(v)} />
                <Legend />
                <Bar dataKey="entradas" name="Entradas" fill="#2e7d32" />
                <Bar dataKey="saidas" name="Saídas" fill="#c62828" />
              </BarChart>
            </ResponsiveContainer>
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
