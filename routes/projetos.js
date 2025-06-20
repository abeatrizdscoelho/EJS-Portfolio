const express = require('express');
const router = express.Router();
const db = require('../database/db');

//CREATE
router.post('/projetos', (req, res) => {
  const { titulo, descricao, github, demo, imagem, tecnologias } = req.body;
  const novoProjeto = 'INSERT INTO projetos (proj_titulo, proj_descricao, proj_github, proj_demo, proj_imagem) VALUES (?, ?, ?, ?, ?)';
  db.query(novoProjeto, [titulo, descricao, github, demo, imagem], (err, result) => {
    if (err) return res.status(500).send(err);

    const idProjeto = result.insertId;

    if (!Array.isArray(tecnologias) || tecnologias.length === 0) {
      return res.send({ idProjeto, titulo, descricao, github, demo, imagem, tecnologias: [] });
    }

    const dadosRelacionamento = tecnologias.map(idTecnologia => [idProjeto, idTecnologia]);
    const relacionamento = 'INSERT INTO tecnologiasProjeto (idProjeto, idTecnologia) VALUES ?';
    db.query(relacionamento, [dadosRelacionamento], (err3) => {
      if (err3) return res.status(500).send(err3);
      res.send({ idProjeto, titulo, descricao, github, demo, imagem, tecnologias });
    });
  });
});

//READ
router.get('/', (req, res) => {
  db.query(`SELECT p.proj_id, p.proj_titulo, p.proj_descricao, p.proj_github, p.proj_demo, p.proj_imagem, GROUP_CONCAT(t.tec_nome) AS tecnologias FROM projetos p LEFT JOIN tecnologiasProjeto tp ON p.proj_id = tp.idProjeto LEFT JOIN tecnologias t ON tp.idTecnologia = t.tec_id GROUP BY p.proj_id`, (err, results) => {
    if (err) return res.status(500).send(err);
    res.render('projetos', { projetos: results });
  });
});

//READ por ID
router.get('/:id', (req, res) => {
  db.query(`SELECT p.proj_id, p.proj_titulo, p.proj_descricao, p.proj_github, p.proj_demo, p.proj_imagem, GROUP_CONCAT(t.tec_nome) AS tecnologias FROM projetos p LEFT JOIN tecnologiasProjeto tp ON p.proj_id = tp.idProjeto LEFT JOIN tecnologias t ON tp.idTecnologia = t.tec_id WHERE p.proj_id = ? GROUP BY p.proj_id`, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send({ mensagem: 'Projeto não encontrado!' });
    res.render('projetos', { projetos: result[0] });
  });
});

//UPDATE
router.put('/projetos/:id', (req, res) => {
  const { titulo, descricao, github, demo, imagem, tecnologias } = req.body;
  const idProjeto = req.params.id;

  const atualizarProjeto = 'UPDATE projetos SET proj_titulo = ?, proj_descricao = ?, proj_github = ?, proj_demo = ?, proj_imagem = ? WHERE proj_id = ?';
  db.query(atualizarProjeto, [titulo, descricao, github, demo, imagem, idProjeto], (err) => {
    if (err) return res.status(500).send(err);
    if (!tecnologias || tecnologias.length === 0) {
      return res.send({ mensagem: 'Projeto atualizado sem tecnologias.' });
    }

    const deletarRelacionamentos = 'DELETE FROM tecnologiasProjeto WHERE idProjeto = ?';
    db.query(deletarRelacionamentos, [idProjeto], (err2) => {
      if (err2) return res.status(500).send(err2);

      const novosRelacionamentos = tecnologias.map(idTecnologia => [idProjeto, idTecnologia]);
      const inserirRelacionamentos = 'INSERT INTO tecnologiasProjeto (idProjeto, idTecnologia) VALUES ?';

      db.query(inserirRelacionamentos, [novosRelacionamentos], (err3) => {
        if (err3) return res.status(500).send(err3);
        res.send({ mensagem: 'Projeto e tecnologias atualizados com sucesso!' });
      });
    });
  });
});

//DELETE
router.delete('/projetos/:id', (req, res) => {
  const idProjeto = req.params.id

  const removerRelacionamentos = 'DELETE FROM tecnologiasProjeto WHERE idProjeto = ?';
  db.query(removerRelacionamentos, [idProjeto], (err) => {
    if (err) return res.status(500).send(err);

    db.query('DELETE FROM projetos WHERE proj_id = ?', [idProjeto], (err) => {
      if (err) return res.status(500).send(err);
      res.send({ mensagem: 'Projeto excluído com sucesso!' });
    });
  });
});

module.exports = router;