const express = require('express');
const router = express.Router();
const db = require('../database/db');

//CREATE
router.post('/habilidades', (req, res) => {
  const { nome, categoria, icone, nivel } = req.body;
  const novaTecnologia = 'INSERT INTO tecnologias (tec_nome, tec_categoria, tec_icone, tec_nivel) VALUES (?, ?, ?, ?)';
  db.query(novaTecnologia, [nome, categoria, icone, nivel], (err, result) => {
    if (err) return res.status(500).send(err);

    const idTecnologia = result.insertId;
    res.send({ idTecnologia, nome, categoria, icone, nivel })
  });
});

//READ
router.get('/', (req, res) => {
  const query = 'SELECT tec_id, tec_nome, tec_categoria, tec_icone, tec_nivel FROM tecnologias';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    const habilidadesAgrupadas = {};
    results.forEach((tec) => {
      if (!habilidadesAgrupadas[tec.tec_categoria]) {
        habilidadesAgrupadas[tec.tec_categoria] = [];
      }
      habilidadesAgrupadas[tec.tec_categoria].push({
        nome: tec.tec_nome,
        icone: tec.tec_icone,
        nivel: tec.tec_nivel
      });
    });

    const habilidades = Object.entries(habilidadesAgrupadas).map(([categoria, itens]) => ({
      categoria,
      itens
    }));

    res.render('habilidades', { habilidades });
  });
});

//READ por Projeto
router.get('/habilidades/projetos', (req, res) => {
  db.query(`SELECT t.tec_id, t.tec_nome, t.tec_categoria, tec_icone, tec_nivel GROUP_CONCAT(p.proj_titulo SEPARATOR ', ') AS projetos FROM tecnologias t LEFT JOIN tecnologiasProjeto tp ON t.tec_id = tp.idTecnologia LEFT JOIN projetos p ON tp.idProjeto = p.proj_id GROUP BY t.tec_id`, (err, results) => {
    if (err) return res.status(500).send(err);
    res.render('habilidades', { habilidades });
  });
});

//READ por ID de Projeto
router.get('/habilidades/:id/tecnologias', (req, res) => {
  const idProjeto = req.params.id;
  const query = `SELECT t.tec_id, t.tec_nome, t.tec_categoria, tec_icone, tec_nivel FROM tecnologias t JOIN tecnologiasProjeto tp ON t.tec_id = tp.idTecnologia WHERE tp.idProjeto = ?`;
  db.query(query, [idProjeto], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) return res.status(404).send({ mensagem: 'Nenhuma tecnologia encontrada para este projeto.' });
    res.render('habilidades', { habilidades });;
  });
});

//UPDATE
router.put('/habilidades/:id', (req, res) => {
  const { nome, categoria, icone, nivel } = req.body;
  const idTecnologia = req.params.id;

  const atualizarTecnologia = 'UPDATE tecnologias SET tec_nome = ?, tec_categoria = ?, tec_icone = ?, tec_nivel = ? WHERE tec_id = ?';
  db.query(atualizarTecnologia, [nome, categoria, icone, nivel, idTecnologia], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Tecnologia atualizada com sucesso!' });
  });
});

//DELETE
router.delete('/habilidades/:id', (req, res) => {
  const idTecnologia = req.params.id

  const removerRelacionamentos = 'DELETE FROM tecnologiasProjeto WHERE idTecnologia = ?';
  db.query(removerRelacionamentos, [idTecnologia], (err) => {
    if (err) return res.status(500).send(err);

    db.query('DELETE FROM tecnologias WHERE tec_id = ?', [idTecnologia], (err) => {
      if (err) return res.status(500).send(err);
      res.send({ mensagem: 'Tecnologia excluída com sucesso!' });
    });
  });
});

module.exports = router;