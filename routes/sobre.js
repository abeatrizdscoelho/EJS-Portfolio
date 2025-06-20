const express = require('express');
const router = express.Router();
const db = require('../database/db');

//CREATE
router.post('/sobre', (req, res) => {
  const { texto, imagem } = req.body;
  const query = 'INSERT INTO sobre (texto, imagem) VALUES (?, ?)';
  db.query(query, [texto, imagem], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId, texto, imagem });
  });
});

//READ
router.get('/', (req, res) => {
  const query = 'SELECT * FROM sobre';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.render('sobre', { sobre: results[0] });
  });
});

//UPDATE
router.put('/sobre/:id', (req, res) => {
  const { texto, imagem } = req.body;
  const { id } = req.params;
  const query = 'UPDATE sobre SET texto = ?, imagem = ? WHERE id = ?';
  db.query(query, [texto, imagem, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Dados atualizados com sucesso!' });
  });
});

//DELETE
router.delete('/sobre/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM sobre WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Registro excluído com sucesso!' });
  });
});

module.exports = router;