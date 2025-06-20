const path = require('path');
const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const perfilRoutes = require('./routes/index');
const sobreRoutes = require('./routes/sobre');
const projetosRoutes = require('./routes/projetos');
const habilidadesRoutes = require('./routes/habilidades');
const certificadosRoutes = require('./routes/certificados');
const contatoRoutes = require('./routes/contato');

app.use('/', perfilRoutes);
app.use('/sobre', sobreRoutes);
app.use('/projetos', projetosRoutes);
app.use('/habilidades', habilidadesRoutes);
app.use('/certificados', certificadosRoutes);
app.use('/contato', contatoRoutes);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});