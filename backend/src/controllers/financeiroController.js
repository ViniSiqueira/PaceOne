const pool = require('../config/db');

// ====================== Títulos a Pagar ======================
const salvarTituloPagar = async (req, res) => {
    const { descricao, valor, vencimento, data_pagamento, juros, acrescimo, desconto, status } = req.body;
    try {
        const query = `
            INSERT INTO titulo_a_pagar 
            (descricao, valor, vencimento, data_pagamento, juros, acrescimo, desconto, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;
        `;
        const values = [descricao, valor, vencimento, data_pagamento || null, juros || 0, acrescimo || 0, desconto || 0, status || 'Aberto'];
        const result = await pool.query(query, values);
        res.status(201).json({ titulo: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao salvar título a pagar' });
    }
};

const listarTituloPagar = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM titulo_a_pagar ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar títulos a pagar' });
    }
};

const atualizarTituloPagar = async (req, res) => {
    try {
        const { id } = req.params;
        const campos = req.body;
        const keys = Object.keys(campos);
        const values = Object.values(campos);

        if (!keys.length) return res.status(400).json({ error: 'Nenhum campo enviado' });

        const setClause = keys.map((key, idx) => `${key} = $${idx+1}`).join(', ');
        const result = await pool.query(`UPDATE titulo_a_pagar SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`, [...values, id]);
        if (!result.rows.length) return res.status(404).json({ error: 'Título não encontrado' });

        res.json({ titulo: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar título a pagar' });
    }
};

// ====================== Títulos a Receber ======================
const salvarTituloReceber = async (req, res) => {
    const { descricao, valor, vencimento, data_recebimento, juros, acrescimo, desconto, status } = req.body;
    try {
        const query = `
            INSERT INTO titulo_a_receber 
            (descricao, valor, vencimento, data_recebimento, juros, acrescimo, desconto, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;
        `;
        const values = [descricao, valor, vencimento, data_recebimento || null, juros || 0, acrescimo || 0, desconto || 0, status || 'Aberto'];
        const result = await pool.query(query, values);
        res.status(201).json({ titulo: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao salvar título a receber' });
    }
};

const listarTituloReceber = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM titulo_a_receber ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar títulos a receber' });
    }
};

const atualizarTituloReceber = async (req, res) => {
    try {
        const { id } = req.params;
        const campos = req.body;
        const keys = Object.keys(campos);
        const values = Object.values(campos);

        if (!keys.length) return res.status(400).json({ error: 'Nenhum campo enviado' });

        const setClause = keys.map((key, idx) => `${key} = $${idx+1}`).join(', ');
        const result = await pool.query(`UPDATE titulo_a_receber SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`, [...values, id]);
        if (!result.rows.length) return res.status(404).json({ error: 'Título não encontrado' });

        res.json({ titulo: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar título a receber' });
    }
};

module.exports = {
    salvarTituloPagar,
    listarTituloPagar,
    atualizarTituloPagar,
    salvarTituloReceber,
    listarTituloReceber,
    atualizarTituloReceber,
};
