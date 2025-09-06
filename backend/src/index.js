const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const modalityRoutes = require('./routes/modalityRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const routineRoutes = require('./routes/routineRoutes');
const financeiroRoutes = require('./routes/financeiroRoutes');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `A origem ${origin} não está autorizada.`;
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/api', clientRoutes);
app.use('/api', modalityRoutes);
app.use('/api', trainingRoutes);
app.use('/api', routineRoutes);
app.use('/api', financeiroRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
