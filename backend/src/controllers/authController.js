const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'P@C3_1';

const login = async (req, res) => {
  const { user_name, senha } = req.body;

  if (!user_name || !senha) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  try {
    const query = 'SELECT * FROM usuario WHERE user_name = $1';
    const result = await pool.query(query, [user_name]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const usuario = result.rows[0];

    if (usuario.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    
    const token = jwt.sign(
      { id: usuario.id, user_name: usuario.user_name },
      JWT_SECRET,
      { expiresIn: '24h' } 
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        user_name: usuario.user_name,
        email: usuario.email,
        imagem: usuario.imagem,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { login };
