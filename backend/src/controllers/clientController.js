const pool = require('../config/db');

const salvarCliente = async (req, res) => {
    const {
        nome,
        cpf,
        nascimento,
        status,
        email,
        telefone,
        cep,
        logradouro,
        bairro,
        cidade,
        complemento,
        estado,
        emergencia_nome,
        emergencia_telefone,
        limitacao_fisica,
        cirurgia,
        problema_articular,
        pratica_atividade,
        dias_de_treino,
        modalidade,
        plano,
        valor_mensalidade,
        dia_vencimento
    } = req.body;

    try {
        const query = `
      INSERT INTO cliente (
        nome, cpf, nascimento, status, email, telefone,
        cep, logradouro, bairro, cidade, complemento, estado,
        emergencia_nome, emergencia_telefone,
        limitacao_fisica, cirurgia, problema_articular,
        pratica_atividade, dias_de_treino, modalidade, plano, valor_mensalidade, dia_vencimento
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14,
        $15, $16, $17,
        $18, $19, $20, $21, $22, $23
      )
      RETURNING *;
    `;

        const values = [
            nome, cpf, nascimento, status, email, telefone,
            cep, logradouro, bairro, cidade, complemento, estado,
            emergencia_nome, emergencia_telefone,
            limitacao_fisica, cirurgia, problema_articular,
            pratica_atividade, dias_de_treino, modalidade, plano, valor_mensalidade, dia_vencimento
        ];

        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Cliente salvo com sucesso!', cliente: result.rows[0] });
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        res.status(500).json({ error: 'Erro interno ao salvar cliente' });
    }
};

const listClients = async (req, res) => {
    try {
        const query = 'SELECT * FROM cliente ORDER BY id';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

const atualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const campos = req.body;

        const keys = Object.keys(campos);
        const values = Object.values(campos);

        if (keys.length === 0) {
            return res.status(400).json({ error: 'Nenhum dado enviado para atualização' });
        }

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

        const result = await pool.query(
            `UPDATE cliente SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json({ cliente: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
};

const getClientesStatusCount = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT status, COUNT(*) AS total
      FROM cliente
      GROUP BY status
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar status dos clientes:', error);
        res.status(500).json({ error: 'Erro interno' });
    }
};

const deletarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM cliente WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json({ message: 'Cliente excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
};


module.exports = { salvarCliente, listClients, atualizarCliente, getClientesStatusCount, deletarCliente };
