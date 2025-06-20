const express = require('express');
const router = express.Router();
const db = require('../database/db');

//CREATE
router.post('/contato', (req, res) => {
  const { email, linkedin } = req.body;
  const query = 'INSERT INTO contato (email, linkedin) VALUES (?, ?)';
  db.query(query, [email, linkedin], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId, email, linkedin });
  });
});

//READ
router.get('/', (req, res) => {
  const query = 'SELECT * FROM contato'; // busca o mais recente
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.render('contato', { contato: results[0] });
  });
});

//UPDATE
router.put('/contato/:id', (req, res) => {
  const { email, linkedin } = req.body;
  const { id } = req.params;
  const query = 'UPDATE contato SET email = ?, linkedin = ? WHERE id = ?';
  db.query(query, [email, linkedin, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Contato atualizado com sucesso!' });
  });
});

//DELETE
router.delete('/contato/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM contato WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Registro de contato excluído com sucesso!' });
  });
});

module.exports = router;