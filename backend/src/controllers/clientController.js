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
  } = req.body;

  try {
    const query = `
      INSERT INTO cliente (
        nome, cpf, nascimento, status, email, telefone,
        cep, logradouro, bairro, cidade, complemento, estado,
        emergencia_nome, emergencia_telefone,
        limitacao_fisica, cirurgia, problema_articular,
        pratica_atividade, dias_de_treino, modalidade, plano
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14,
        $15, $16, $17,
        $18, $19, $20, $21
      )
      RETURNING *;
    `;

    const values = [
      nome, cpf, nascimento, status, email, telefone,
      cep, logradouro, bairro, cidade, complemento, estado,
      emergencia_nome, emergencia_telefone,
      limitacao_fisica, cirurgia, problema_articular,
      pratica_atividade, dias_de_treino, modalidade, plano,
    ];

    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Cliente salvo com sucesso!', cliente: result.rows[0] });
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    res.status(500).json({ error: 'Erro interno ao salvar cliente' });
  }
};

module.exports = { salvarCliente };
