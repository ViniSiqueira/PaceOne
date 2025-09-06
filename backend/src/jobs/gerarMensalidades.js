const pool = require("../config/db");

function ultimoDiaMes(ano, mes) {
  return new Date(ano, mes + 1, 0).getDate(); // 0 = último do mês anterior
}

function vencimentoDoMes(baseDate, diaVencimento) {
  const ano = baseDate.getFullYear();
  const mes = baseDate.getMonth(); // 0=jan
  const ultimo = ultimoDiaMes(ano, mes);
  const dia = Math.min(diaVencimento, ultimo);
  return new Date(ano, mes, dia);
}

async function gerarMensalidades({ dataBase = new Date() } = {}) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // pega clientes ativos com valor e vencimento definidos
    const { rows: clientes } = await client.query(`
      SELECT id, nome, valor_mensalidade, dia_vencimento
      FROM cliente
      WHERE status = 'Ativo'
        AND valor_mensalidade IS NOT NULL
        AND dia_vencimento IS NOT NULL
    `);

    const promessas = clientes.map(async (c) => {
      const venc = vencimentoDoMes(dataBase, Number(c.dia_vencimento));
      const mesIni = new Date(venc.getFullYear(), venc.getMonth(), 1);
      const mesFim = new Date(venc.getFullYear(), venc.getMonth() + 1, 1);

      // evita duplicar: tenta inserir se não existir um no mesmo mês
      const { rows: existentes } = await client.query(
        `
        SELECT id FROM titulo_a_receber
        WHERE cliente_id = $1
          AND vencimento >= $2
          AND vencimento <  $3
        `,
        [c.id, mesIni.toISOString().slice(0,10), mesFim.toISOString().slice(0,10)]
      );

      if (existentes.length > 0) return null;

      const descricao = `Mensalidade ${c.nome} - ${String(venc.getMonth()+1).padStart(2,'0')}/${venc.getFullYear()}`;

      return client.query(
        `
        INSERT INTO titulo_a_receber
          (cliente_id, descricao, valor, vencimento, status)
        VALUES ($1, $2, $3, $4, 'Aberto')
        RETURNING id
        `,
        [c.id, descricao, c.valor_mensalidade, venc.toISOString().slice(0,10)]
      );
    });

    await Promise.all(promessas);
    await client.query('COMMIT');
    return { ok: true, gerados: promessas.length };
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Erro gerarMensalidades:', e);
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { gerarMensalidades };