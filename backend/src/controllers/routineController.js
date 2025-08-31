const pool = require('../config/db');

// Salvar evento da rotina
const salvarRotina = async (req, res) => {
    const { titulo, descricao, inicio, fim } = req.body;

    try {
        const query = `
            INSERT INTO rotina (
                titulo, descricao, inicio, fim
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const values = [titulo, descricao, inicio, fim];
        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Evento salvo com sucesso!', rotina: result.rows[0] });
    } catch (error) {
        console.error('Erro ao salvar rotina:', error);
        res.status(500).json({ error: 'Erro interno ao salvar evento' });
    }
};

// Listar todos os eventos
const listRotinas = async (req, res) => {
    try {
        const query = `
            SELECT 
                id,
                titulo,
                descricao,
                inicio,
                fim,
                criado_em,
                atualizado_em
            FROM rotina
            ORDER BY inicio ASC;
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar rotinas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Atualizar evento
const atualizarRotina = async (req, res) => {
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
            `UPDATE rotina SET ${setClause}, atualizado_em = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }

        res.json({ message: 'Evento atualizado com sucesso!', rotina: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar rotina:', error);
        res.status(500).json({ error: 'Erro ao atualizar evento' });
    }
};

const deletarRotina = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM rotina WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }

        res.json({ message: 'Evento excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir evento:', error);
        res.status(500).json({ error: 'Erro interno ao excluir evento' });
    }
};


module.exports = { salvarRotina, listRotinas, atualizarRotina, deletarRotina };
