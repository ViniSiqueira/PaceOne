const pool = require('../config/db');

const salvarModality = async (req, res) => {
    const { descricao, icone, cor_icon } = req.body;

    try {
        const query = `
            INSERT INTO modalidade (descricao, icone, cor_icon)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [descricao, icone, cor_icon];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Modalidade salva com sucesso!', modality: result.rows[0] });
    } catch (error) {
        console.error('Erro ao salvar modalidade:', error);
        res.status(500).json({ error: 'Erro interno ao salvar modalidade' });
    }
};

const listModalitys = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM modalidade ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar modalidades:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

const atualizarModality = async (req, res) => {
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
            `UPDATE modalidade SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Modalidade não encontrada' });
        }

        res.json({ modality: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar modalidade:', error);
        res.status(500).json({ error: 'Erro ao atualizar modalidade' });
    }
};

module.exports = { salvarModality, listModalitys, atualizarModality };
