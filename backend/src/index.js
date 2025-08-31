const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const modalityRoutes = require('./routes/modalityRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const routineRoutes = require('./routes/routineRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/api', clientRoutes);
app.use('/api', modalityRoutes);
app.use('/api', trainingRoutes);
app.use('/api', routineRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
