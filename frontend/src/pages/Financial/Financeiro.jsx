import React, { useEffect, useMemo, useState } from 'react';
import './Financeiro.css';
import ModalTitulo from './ModalTitulo';
import toast from 'react-hot-toast';
import { API_BACKEND_URL } from '../../constants/url';

const fmtDate = (v) => {
  if (!v) return '-';
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d) ? '-' : new Intl.DateTimeFormat('pt-BR').format(d);
};
const fmtMoney = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(n || 0));
const efetivo = (t) =>
  Number(t.valor || 0) + Number(t.juros || 0) + Number(t.acrescimo || 0) - Number(t.desconto || 0);

export default function Financeiro() {
  const [aba, setAba] = useState('fluxo'); // fluxo como padrão
  const [mesFiltro, setMesFiltro] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const [titulosPagar, setTitulosPagar] = useState([]);
  const [titulosReceber, setTitulosReceber] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [modoModal, setModoModal] = useState('criar'); // 'criar' | 'editar'
  const [tipoModal, setTipoModal] = useState('pagar');  // 'pagar' | 'receber'
  const [tituloEditando, setTituloEditando] = useState(null);

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      const [pRes, rRes] = await Promise.all([
        fetch(`${API_BACKEND_URL}/api/financeiro/pagar`),
        fetch(`${API_BACKEND_URL}/api/financeiro/receber`),
      ]);
      const pagar = await pRes.json();
      const receber = await rRes.json();
      setTitulosPagar(Array.isArray(pagar) ? pagar : pagar.titulos || []);
      setTitulosReceber(Array.isArray(receber) ? receber : receber.titulos || []);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar títulos');
    }
  }

  // helpers
  const filtraMes = (arr, campo) => arr.filter((t) => t[campo]?.startsWith(mesFiltro));

  // Cards (previsto do mês por vencimento)
  const resumoPrevisto = useMemo(() => {
    const pagar = filtraMes(titulosPagar, 'vencimento').reduce((s, t) => s + efetivo(t), 0);
    const receber = filtraMes(titulosReceber, 'vencimento').reduce((s, t) => s + efetivo(t), 0);
    return { pagar, receber, total: receber - pagar };
  }, [titulosPagar, titulosReceber, mesFiltro]);

  const titulosAtuais =
    aba === 'pagar'
      ? filtraMes(titulosPagar, 'vencimento')
      : aba === 'receber'
      ? filtraMes(titulosReceber, 'vencimento')
      : [];

  // ações
  const abrirModalNovo = () => {
    setModoModal('criar');
    setTipoModal(aba === 'receber' ? 'receber' : 'pagar');
    setTituloEditando(null);
    setModalAberto(true);
  };
  const abrirModalEditar = (t, tipo) => {
    setModoModal('editar');
    setTipoModal(tipo);
    setTituloEditando(t);
    setModalAberto(true);
  };
  const fecharModal = () => setModalAberto(false);

  const criarTitulo = async (payload) => {
    const url = `${API_BACKEND_URL}/api/financeiro/${tipoModal}`;
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Erro ao salvar título');
    const data = await res.json();
    const novo = data.titulo || data;
    if (tipoModal === 'pagar') setTitulosPagar((p) => [...p, novo]);
    else setTitulosReceber((p) => [...p, novo]);
    toast.success('Título salvo!');
  };

  const atualizarTitulo = async (id, campos, tipo) => {
    const url = `${API_BACKEND_URL}/api/financeiro/${tipo}/${id}`;
    const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(campos) });
    if (!res.ok) throw new Error('Erro ao atualizar título');
    const data = await res.json();
    const up = data.titulo || data;
    if (tipo === 'pagar') setTitulosPagar((p) => p.map((t) => (t.id === id ? { ...t, ...up } : t)));
    else setTitulosReceber((p) => p.map((t) => (t.id === id ? { ...t, ...up } : t)));
    toast.success('Título atualizado!');
  };

  const alterarStatus = async (id, novoStatus, tipo) => {
    const payload = { status: novoStatus };
    const now = new Date().toISOString();
    if (tipo === 'pagar') payload.data_pagamento = novoStatus === 'Pago' ? now : null;
    else payload.data_recebimento = novoStatus === 'Recebido' ? now : null;
    try { await atualizarTitulo(id, payload, tipo); } catch (e) { toast.error(e.message); }
  };

  const excluirTitulo = async (id, tipo) => {
    const url = `${API_BACKEND_URL}/api/financeiro/${tipo}/${id}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) return toast.error('Erro ao excluir');
    if (tipo === 'pagar') setTitulosPagar((p) => p.filter((t) => t.id !== id));
    else setTitulosReceber((p) => p.filter((t) => t.id !== id));
    toast.success('Excluído!');
  };

  return (
    <div className="financeiro-container">
      <h2>Financeiro</h2>

      <div className="aba-buttons">
        <button className={aba === 'fluxo' ? 'active' : ''} onClick={() => setAba('fluxo')}>Fluxo de Caixa</button>
        <button className={aba === 'pagar' ? 'active' : ''} onClick={() => setAba('pagar')}>A Pagar</button>
        <button className={aba === 'receber' ? 'active' : ''} onClick={() => setAba('receber')}>A Receber</button>
      </div>

      <div className="linha-filtro">
        <label htmlFor="mes">Mês:</label>
        <input id="mes" type="month" value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)} />
      </div>

      {/* FLUXO — sem botão de criar */}
      {aba === 'fluxo' && (
        <div className="fluxo-caixa">
          <div className="cards-resumo">
            <div className="card-resumo pagar">
              <div className="card-label">A Pagar</div>
              <div className="card-valor">{fmtMoney(resumoPrevisto.pagar)}</div>
            </div>
            <div className="card-resumo receber">
              <div className="card-label">A Receber</div>
              <div className="card-valor">{fmtMoney(resumoPrevisto.receber)}</div>
            </div>
            <div className="card-resumo total">
              <div className="card-label">Total</div>
              <div className="card-valor">{fmtMoney(resumoPrevisto.total)}</div>
            </div>
          </div>
        </div>
      )}

      {(aba === 'pagar' || aba === 'receber') && (
        <>
          <div className="acoes-topo">
            <button type="button" className="btn-primary" onClick={abrirModalNovo}>+ Novo Título</button>
          </div>

          <table className="titulos-table table-clickable">
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
                <th style={{ minWidth: 90 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {titulosAtuais.map((t) => {
                const tipo = aba;
                const dataReal = tipo === 'pagar' ? t.data_pagamento : t.data_recebimento;
                return (
                  <tr
                    key={t.id}
                    onClick={(e) => {
                      if (e.target.closest('select') || e.target.closest('button')) return;
                      abrirModalEditar(t, tipo);
                    }}
                  >
                    <td>{t.descricao}</td>
                    <td>{fmtDate(t.vencimento)}</td>
                    <td>{fmtDate(dataReal)}</td>
                    <td>{fmtMoney(t.valor)}</td>
                    <td>{fmtMoney(t.juros)}</td>
                    <td>{fmtMoney(t.acrescimo)}</td>
                    <td>{fmtMoney(t.desconto)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select value={t.status} onChange={(e) => alterarStatus(t.id, e.target.value, tipo)}>
                        {tipo === 'pagar' ? (
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
                    <td className="acoes-cell" onClick={(e) => e.stopPropagation()}>
                      <button className="btn-small danger" onClick={() => excluirTitulo(t.id, tipo)}>Excluir</button>
                    </td>
                  </tr>
                );
              })}
              {titulosAtuais.length === 0 && (
                <tr><td colSpan="9" style={{ textAlign: 'center' }}>Nenhum título.</td></tr>
              )}
            </tbody>
          </table>

          {modalAberto && (
            <ModalTitulo
              modo={modoModal}
              tipo={tipoModal}
              initial={tituloEditando}
              onClose={fecharModal}
              onSalvar={async (dados) => {
                try {
                  if (modoModal === 'criar') await criarTitulo(dados);
                  else await atualizarTitulo(tituloEditando.id, dados, tipoModal);
                  fecharModal();
                } catch (e) { toast.error(e.message); }
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
