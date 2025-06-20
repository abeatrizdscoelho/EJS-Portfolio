const express = require('express');
const router = express.Router();
const db = require('../database/db');

//CREATE
router.post('/', (req, res) => {
  const { nome, titulo, imagem, linkedin, github } = req.body;
  const query = 'INSERT INTO perfil (perfil_nome, perfil_titulo, perfil_imagem, perfil_linkedin, perfil_github) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [nome, titulo, imagem, linkedin, github], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId, nome, titulo, imagem, linkedin, github });
  });
});

//READ
router.get('/', (req, res) => {
  const query = 'SELECT * FROM perfil';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.render('index', { perfil: results[0] });
  });
});

//UPDATE
router.put('/:id', (req, res) => {
  const { nome, titulo, imagem, linkedin, github } = req.body;
  const { id } = req.params;
  const query = 'UPDATE perfil SET perfil_nome = ?, perfil_titulo = ?, perfil_imagem = ?, perfil_linkedin = ?, perfil_github = ? WHERE id = ?';
  db.query(query, [nome, titulo, imagem, linkedin, github, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Perfil atualizado com sucesso!' });
  });
});

//DELETE
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM perfil WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Perfil excluído com sucesso!' });
  });
});

module.exports = router;