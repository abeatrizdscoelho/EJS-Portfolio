const path = require('path');
const mysql = require('mysql2');
const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

// Conexão com MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL!');
});

//CRUD de Projetos

//CREATE
app.post('/projetos', (req, res) => {
  const { titulo, descricao, link, tecnologias } = req.body;
  const novoProjeto = 'INSERT INTO projetos (proj_titulo, proj_descricao, proj_link) VALUES (?, ?, ?)';
  db.query(novoProjeto, [titulo, descricao, link], (err, result) => {
    if (err) return res.status(500).send(err);

    const idProjeto = result.insertId;

    if (!Array.isArray(tecnologias) || tecnologias.length === 0) {
      return res.send({ idProjeto, titulo, descricao, link, tecnologias: [] });
    }

    const dadosRelacionamento = tecnologias.map(idTecnologia => [idProjeto, idTecnologia]);
    const relacionamento = 'INSERT INTO tecnologiasProjeto (idProjeto, idTecnologia) VALUES ?';
    db.query(relacionamento, [dadosRelacionamento], (err3) => {
      if (err3) return res.status(500).send(err3);
      res.send({ idProjeto, titulo, descricao, link, tecnologias });
    });
  });
});

//READ
app.get('/projetos', (req, res) => {
  db.query(`SELECT p.proj_id, p.proj_titulo, p.proj_descricao, p.proj_link, GROUP_CONCAT(t.tec_nome) AS tecnologias FROM projetos p LEFT JOIN tecnologiasProjeto tp ON p.proj_id = tp.idProjeto LEFT JOIN tecnologias t ON tp.idTecnologia = t.tec_id GROUP BY p.proj_id`, (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

//READ por ID
app.get('/projetos/:id', (req, res) => {
  db.query(`SELECT p.proj_id, p.proj_titulo, p.proj_descricao, p.proj_link, GROUP_CONCAT(t.tec_nome) AS tecnologias FROM projetos p LEFT JOIN tecnologiasProjeto tp ON p.proj_id = tp.idProjeto LEFT JOIN tecnologias t ON tp.idTecnologia = t.tec_id WHERE p.proj_id = ? GROUP BY p.proj_id`, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send({ mensagem: 'Projeto não encontrado!' });
    res.send(result[0]);
  });
});

//UPDATE
app.put('/projetos/:id', (req, res) => {
  const { titulo, descricao, link, tecnologias } = req.body;
  const idProjeto = req.params.id;

  const atualizarProjeto = 'UPDATE projetos SET proj_titulo = ?, proj_descricao = ?, proj_link = ? WHERE proj_id = ?';
  db.query(atualizarProjeto, [titulo, descricao, link, idProjeto], (err) => {
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
app.delete('/projetos/:id', (req, res) => {
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


//CRUD de Tecnologias

//CREATE
app.post('/tecnologias', (req, res) => {
  const { nome, categoria } = req.body;
  const novaTecnologia = 'INSERT INTO tecnologias (tec_nome, tec_categoria) VALUES (?, ?)';
  db.query(novaTecnologia, [nome, categoria], (err, result) => {
    if (err) return res.status(500).send(err);

    const idTecnologia = result.insertId;
    res.send({ idTecnologia, nome, categoria })
  });
});


//READ
app.get('/tecnologias', (req, res) => {
  const query = 'SELECT tec_id, tec_nome, tec_categoria FROM tecnologias';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

//READ por Projeto
app.get('/tecnologias/projetos', (req, res) => {
  db.query(`SELECT t.tec_id, t.tec_nome, t.tec_categoria, GROUP_CONCAT(p.proj_titulo SEPARATOR ', ') AS projetos FROM tecnologias t LEFT JOIN tecnologiasProjeto tp ON t.tec_id = tp.idTecnologia LEFT JOIN projetos p ON tp.idProjeto = p.proj_id GROUP BY t.tec_id`, (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

//READ por ID de Projeto
app.get('/projetos/:id/tecnologias', (req, res) => {
  const idProjeto = req.params.id;
  const query = `SELECT t.tec_id, t.tec_nome, t.tec_categoria FROM tecnologias t JOIN tecnologiasProjeto tp ON t.tec_id = tp.idTecnologia WHERE tp.idProjeto = ?`;
  db.query(query, [idProjeto], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) return res.status(404).send({ mensagem: 'Nenhuma tecnologia encontrada para este projeto.' });
    res.send(results);
  });
});

//UPDATE
app.put('/tecnologias/:id', (req, res) => {
  const { nome, categoria } = req.body;
  const idTecnologia = req.params.id;

  const atualizarTecnologia = 'UPDATE tecnologias SET tec_nome = ?, tec_categoria = ? WHERE tec_id = ?';
  db.query(atualizarTecnologia, [nome, categoria, idTecnologia], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Tecnologia atualizada com sucesso!' });
  });
});

//DELETE
app.delete('/tecnologias/:id', (req, res) => {
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


//CRUD de Certificados

//CREATE
app.post('/certificados', (req, res) => {
  const { titulo, descricao } = req.body;
  const novoCertificado = 'INSERT INTO certificados (cert_titulo, cert_descricao) VALUES (?, ?)';
  db.query(novoCertificado, [titulo, descricao], (err, result) => {
    if (err) return res.status(500).send(err);

    const idCertificado = result.insertId;
    res.send({ idCertificado, titulo, descricao })
  });
});

//READ
app.get('/certificados', (req, res) => {
  const query = 'SELECT cert_id, cert_titulo, cert_descricao FROM certificados';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

//READ por ID 
app.get('/certificados/:id', (req, res) => {
  const idCertificado = req.params.id;
  const query = `SELECT cert_id, cert_titulo, cert_descricao FROM certificados WHERE cert_id = ?`;
  db.query(query, [idCertificado], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) return res.status(404).send({ mensagem: 'Nenhum certificado encontrado para esse ID.' });
    res.send(results[0]);
  });
});

//UPDATE
app.put('/certificados/:id', (req, res) => {
  const { titulo, descricao } = req.body;
  const idCertificado = req.params.id;

  const atualizarCertificado = 'UPDATE certificados SET cert_titulo = ?, cert_descricao = ? WHERE cert_id = ?';
  db.query(atualizarCertificado, [titulo, descricao, idCertificado], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Certificado atualizado com sucesso!' });
  });
});

//DELETE
app.delete('/certificados/:id', (req, res) => {
  const idCertificado = req.params.id

  db.query('DELETE FROM certificados WHERE cert_id = ?', [idCertificado], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Certificado excluído com sucesso!' });
  });
});


// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.render('index');
// });

// app.get('/sobre', (req, res) => {
//   res.render('sobre');
// });

// app.get('/habilidades', (req, res) => {
//     const habilidades = [
//         {
//           categoria: "Front-end",
//           itens: [
//             { nome: "HTML", nivel: "Avançado", icone: "https://img.icons8.com/?size=100&id=20909&format=png&color=000000" },
//             { nome: "CSS", nivel: "Avançado", icone: "https://img.icons8.com/?size=100&id=21278&format=png&color=000000" },
//             { nome: "JavaScript", nivel: "Básico", icone: "https://img.icons8.com/?size=100&id=108784&format=png&color=000000" },
//             { nome: "Bootstrap", nivel: "Avançado", icone: "https://img.icons8.com/?size=100&id=EzPCiQUqWWEa&format=png&color=000000" },
//             { nome: "TailwindCSS", nivel: "Avançado", icone: "https://img.icons8.com/?size=100&id=4PiNHtUJVbLs&format=png&color=000000" }
//           ]
//         },
//         {
//           categoria: "Back-end",
//           itens: [
//             { nome: "Git", nivel: "Básico", icone: "https://img.icons8.com/?size=100&id=20906&format=png&color=000000" },
//             { nome: "MySQL", nivel: "Intermediário", icone: "https://img.icons8.com/?size=100&id=rgPSE6nAB766&format=png&color=000000" },
//             { nome: "Python", nivel: "Intermediário", icone: "https://img.icons8.com/?size=100&id=13441&format=png&color=000000" },
//             { nome: "Flask", nivel: "Intermediário", icone: "https://img.icons8.com/?size=100&id=AqYCfGyGXlO7&format=png&color=000000" }
//           ]
//         },
//         {
//           categoria: "Ferramentas",
//           itens: [
//             { nome: "GitHub", nivel: "Avançado", icone: "https://img.icons8.com/?size=100&id=62856&format=png&color=000000" },
//             { nome: "Figma", nivel: "Intermediário", icone: "https://img.icons8.com/?size=100&id=zfHRZ6i1Wg0U&format=png&color=000000" },
//             { nome: "Jira", nivel: "Intermediário", icone: "https://img.icons8.com/?size=100&id=RduYmqw5H7xm&format=png&color=000000" },
//             { nome: "AWS", nivel: "Básico", icone: "https://img.icons8.com/?size=100&id=33039&format=png&color=000000" },
//             { nome: "Docker", nivel: "Básico", icone: "https://img.icons8.com/?size=100&id=22813&format=png&color=000000" }
//           ]
//         }
//       ];
//     res.render('habilidades', { habilidades });
// });

// app.get('/projetos', (req, res) => {
//     const projetos = [
//         {
//           titulo: 'Réplica do Site da Tesla',
//           descricao: 'Foi Realizado uma Réplica do Site da Tesla. <br>Para a realização desse projeto utilizei HTML e CSS para a estruturação e estilização do conteúdo, além de JavaScript para a implementação do formulário de compra.',
//           imagem: '/assets/Projeto Tesla.png',
//           github: 'https://github.com/abeatrizdscoelho/Site-Tesla',
//           demo: 'https://abeatrizdscoelho.github.io/Site-Tesla/'
//         },
//         {
//           titulo: 'Acompanhamento do Desempenho dos Vereadores',
//           descricao: 'Criação de uma plataforma web que disponibiliza informações sobre o desempenho dos vereadores da cidade de São José dos Campos durante o atual mandato. O objetivo é oferecer aos eleitores dados claros e acessíveis que ajudem a tomar decisões informadas nas eleições municipais.',
//           imagem: '/assets/Tela API.png',
//           github: 'https://github.com/Draco-Imperium/API_FATEC1',
//           demo: 'https://github.com/abeatrizdscoelho/Projetos-API'
//         }
//       ];
//     res.render('projetos', { projetos });
// });

// app.get('/certificados', (req, res) => {
//     const certificados = [
//         {
//           titulo: "Masterizando o ChatGPT",
//           imagem: "/assets/Certificado Masterizando ChatGPT.png",
//           descricao: `O curso "Masterizando o Chat GPT", oferecido pela Adapta e ministrado por Max Peters, aborda aspectos essenciais da inteligência artificial generativa, oferecendo insights sobre como integrar essa tecnologia em diferentes contextos, seja para automação de tarefas, criação de conteúdo, atendimento ao cliente, entre outros.`,
//           pdf: "/assets/Certificado Masterizando o ChatGPT.pdf"
//         },
//         {
//           titulo: "Escola de Inovadores",
//           imagem: "/assets/Certificado INOVA.png",
//           descricao: `A Escola de Inovadores é um curso de extensão em empreendedorismo criado pela Inova CPS que visa fornecer ferramental básico de Empreendedorismo e Inovação disponibilizando um ambiente criativo e digital para que os participantes se capacitem e desenvolvam seus modelos de negócios.`,
//           pdf: "/assets/CERTIFICADO_-_2024-2.pdf"
//         }
//       ];
//     res.render('certificados', { certificados });
// });

// app.get('/contato', (req, res) => {
//     res.render('contato')
// });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});