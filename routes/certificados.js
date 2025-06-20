const express = require('express');
const router = express.Router();
const db = require('../database/db');

//CREATE
router.post('/certificados', (req, res) => {
  const { titulo, descricao, imagem } = req.body;
  const novoCertificado = 'INSERT INTO certificados (cert_titulo, cert_descricao, cert_imagem) VALUES (?, ?, ?)';
  db.query(novoCertificado, [titulo, descricao, imagem], (err, result) => {
    if (err) return res.status(500).send(err);

    const idCertificado = result.insertId;
    res.send({ idCertificado, titulo, descricao, imagem })
  });
});

//READ
router.get('/', (req, res) => {
  const query = 'SELECT cert_id, cert_titulo, cert_descricao, cert_imagem FROM certificados';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.render('certificados', { certificados: results });
  });
});

//READ por ID 
router.get('/certificados/:id', (req, res) => {
  const idCertificado = req.params.id;
  const query = `SELECT cert_id, cert_titulo, cert_descricao, cert_imagem FROM certificados WHERE cert_id = ?`;
  db.query(query, [idCertificado], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) return res.status(404).send({ mensagem: 'Nenhum certificado encontrado para esse ID.' });
    res.render('certificados', { certificados: results[0] });
  });
});

//UPDATE
router.put('/certificados/:id', (req, res) => {
  const { titulo, descricao, imagem } = req.body;
  const idCertificado = req.params.id;

  const atualizarCertificado = 'UPDATE certificados SET cert_titulo = ?, cert_descricao = ?, cert_imagem = ? WHERE cert_id = ?';
  db.query(atualizarCertificado, [titulo, descricao, imagem, idCertificado], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Certificado atualizado com sucesso!' });
  });
});

//DELETE
router.delete('/certificados/:id', (req, res) => {
  const idCertificado = req.params.id
  db.query('DELETE FROM certificados WHERE cert_id = ?', [idCertificado], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Certificado excluído com sucesso!' });
  });
});

module.exports = router;