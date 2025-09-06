import React, { useState, useEffect } from 'react';
import './Financeiro.css';
import ModalTitulo from './ModalTitulo';
import toast from 'react-hot-toast';
import { API_BACKEND_URL } from '../../constants/url';

const formatDate = (value) => {
  if (!value) return '-';
  // aceita Date, ISO string ou 'YYYY-MM-DD'
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR').format(d);
};

const formatMoney = (value) => {
  const n = Number(value || 0);
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
};

const Financeiro = () => {
  const [aba, setAba] = useState('pagar');
  const [modalAberto, setModalAberto] = useState(false);
  const [titulosPagar, setTitulosPagar] = useState([]);
  const [titulosReceber, setTitulosReceber] = useState([]);
  const [mesFiltro, setMesFiltro] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const [fluxoCaixa, setFluxoCaixa] = useState({
    totalEntrada: 0,
    totalSaida: 0,
    saldo: 0,
  });

  useEffect(() => {
    fetchTitulos();
  }, []);

  useEffect(() => {
    calcularFluxo();
  }, [titulosPagar, titulosReceber, mesFiltro]);

  const fetchTitulos = async () => {
    try {
      const [pagarRes, receberRes] = await Promise.all([
        fetch(`${API_BACKEND_URL}/api/financeiro/pagar`),
        fetch(`${API_BACKEND_URL}/api/financeiro/receber`),
      ]);
      const [pagarData, receberData] = await Promise.all([pagarRes.json(), receberRes.json()]);
      setTitulosPagar(pagarData);
      setTitulosReceber(receberData);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar títulos');
    }
  };

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const adicionarTitulo = async (titulo) => {
    try {
      const url = `${API_BACKEND_URL}/api/financeiro/${aba}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(titulo),
      });
      if (!res.ok) throw new Error('Erro ao salvar título');
      const novoTitulo = await res.json();
      aba === 'pagar'
        ? setTitulosPagar((prev) => [...prev, novoTitulo])
        : setTitulosReceber((prev) => [...prev, novoTitulo]);
      toast.success('Título salvo com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const alterarStatus = async (id, status, tipo) => {
    try {
      const url = `${API_BACKEND_URL}/api/financeiro/${tipo}/${id}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Erro ao atualizar status');
      if (tipo === 'pagar') {
        setTitulosPagar((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
      } else {
        setTitulosReceber((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
      }
      toast.success('Status atualizado!');
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const excluirTitulo = async (id, tipo) => {
    try {
      const url = `${API_BACKEND_URL}/api/financeiro/${tipo}/${id}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir título');
      if (tipo === 'pagar') {
        setTitulosPagar((prev) => prev.filter((t) => t.id !== id));
      } else {
        setTitulosReceber((prev) => prev.filter((t) => t.id !== id));
      }
      toast.success('Título excluído!');
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  // mantém o filtro por mês usando padrão YYYY-MM da API/DB
  const titulosFiltradosPorMes = (titulos, tipoData) => {
    return titulos.filter((t) => t[tipoData]?.startsWith(mesFiltro));
  };

  const calcularFluxo = () => {
    const entradas = titulosFiltradosPorMes(titulosReceber, 'data_recebimento').reduce(
      (sum, t) => sum + Number(t.valor || 0),
      0
    );
    const saidas = titulosFiltradosPorMes(titulosPagar, 'data_pagamento').reduce(
      (sum, t) => sum + Number(t.valor || 0),
      0
    );
    setFluxoCaixa({
      totalEntrada: entradas,
      totalSaida: saidas,
      saldo: entradas - saidas,
    });
  };

  const titulosAtuais =
    aba === 'pagar'
      ? titulosFiltradosPorMes(titulosPagar, 'vencimento')
      : aba === 'receber'
      ? titulosFiltradosPorMes(titulosReceber, 'vencimento')
      : [];

  return (
    <div className="financeiro-container">
      <h2>Financeiro</h2>

      <div className="aba-buttons">
        <button className={aba === 'pagar' ? 'active' : ''} onClick={() => setAba('pagar')}>
          A Pagar
        </button>
        <button className={aba === 'receber' ? 'active' : ''} onClick={() => setAba('receber')}>
          A Receber
        </button>
        <button className={aba === 'fluxo' ? 'active' : ''} onClick={() => setAba('fluxo')}>
          Fluxo de Caixa
        </button>
      </div>

      <div
        style={{
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        {(aba === 'pagar' || aba === 'receber' || aba === 'fluxo') && (
          <>
            <label>Mês: </label>
            <input type="month" value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)} />
          </>
        )}
      </div>

      {(aba === 'pagar' || aba === 'receber') && (
        <>
          <div className="form-titulo">
            <button type="button" onClick={abrirModal}>
              + Novo Título
            </button>
          </div>

          <table className="titulos-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Vencimento</th>
                <th>Data Pag/Rec</th>
                <th>Valor</th>
                <th>Juros</th>
                <th>Acrescimo</th>
                <th>Desconto</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {titulosAtuais.map((titulo) => (
                <tr key={titulo.id}>
                  <td>{titulo.descricao}</td>
                  <td>{formatDate(titulo.vencimento)}</td>
                  <td>
                    {aba === 'pagar'
                      ? formatDate(titulo.data_pagamento)
                      : formatDate(titulo.data_recebimento)}
                  </td>
                  <td>{formatMoney(titulo.valor)}</td>
                  <td>{formatMoney(titulo.juros)}</td>
                  <td>{formatMoney(titulo.acrescimo)}</td>
                  <td>{formatMoney(titulo.desconto)}</td>
                  <td>
                    <select
                      value={titulo.status}
                      onChange={(e) => alterarStatus(titulo.id, e.target.value, aba)}
                    >
                      {aba === 'pagar' ? (
                        <>
                          <option value="Aberto">Aberto</option>
                          <option value="Pago">Pago</option>
                        </>
                      ) : (
                        <>
                          <option value="Aberto">Aberto</option>
                          <option value="Recebido">Recebido</option>
                        </>
                      )}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => excluirTitulo(titulo.id, aba)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {titulosAtuais.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>
                    Nenhum título.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {modalAberto && (
            <ModalTitulo onClose={fecharModal} onSalvar={adicionarTitulo} tipo={aba} />
          )}
        </>
      )}

      {aba === 'fluxo' && (
        <div className="fluxo-caixa">
          <h3>Fluxo de Caixa</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
            <div>Total a Receber: {formatMoney(fluxoCaixa.totalEntrada)}</div>
            <div>Total a Pagar: {formatMoney(fluxoCaixa.totalSaida)}</div>
            <div>Saldo: {formatMoney(fluxoCaixa.saldo)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financeiro;
