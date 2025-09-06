const pool = require('../config/db');

const salvarTreino = async (req, res) => {
    const {
        cliente_id,
        intensidade,
        tempo_treino,
        tipo_treino,
        descricao
    } = req.body;

    try {
        const query = `
            INSERT INTO treino (
                cliente_id, intensidade, tempo_treino, tipo_treino, descricao
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const values = [cliente_id, intensidade, tempo_treino, tipo_treino, descricao];

        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Treino salvo com sucesso!', treino: result.rows[0] });
    } catch (error) {
        console.error('Erro ao salvar treino:', error);
        res.status(500).json({ error: 'Erro interno ao salvar treino' });
    }
};

const listTreinos = async (req, res) => {
    try {
        const query = `
            SELECT 
                t.id,
                t.intensidade,
                t.tempo_treino,
                t.tipo_treino,
                t.descricao,
                t.cliente_id,
                c.nome AS cliente_nome
            FROM treino t
            LEFT JOIN cliente c ON t.cliente_id = c.id
            ORDER BY t.id DESC
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar treinos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

const atualizarTreino = async (req, res) => {
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
            `UPDATE treino SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Treino não encontrado' });
        }

        res.json({ treino: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar treino:', error);
        res.status(500).json({ error: 'Erro ao atualizar treino' });
    }
};

const deletarTreino = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM treino WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Treino não encontrado' });
        }

        res.json({ message: 'Treino excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar treino:', error);
        res.status(500).json({ error: 'Erro ao deletar treino' });
    }
};

module.exports = { salvarTreino, listTreinos, atualizarTreino, deletarTreino};
