const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/sobre', (req, res) => {
  res.render('sobre');
});

app.get('/habilidades', (req, res) => {
    const habilidades = [
        {
          categoria: "Front-end",
          itens: [
            { nome: "HTML", nivel: "Avançado", icone: "https://img.icons8.com/?size=100&id=20909&format=png&color=000000" },
            { nome: "CSS", nivel: "Avançado", icone: "https://img.icons8.com/?size=100&id=21278&format=png&color=000000" },
            { nome: "JavaScript", nivel: "Básico", icone: "https://img.icons8.com/?size=100&id=108784&format=png&color=000000" },
            { nome: "Bootstrap", nivel: "Avançado", icone: "https://img.icons8.com/?size=100&id=EzPCiQUqWWEa&format=png&color=000000" },
            { nome: "TailwindCSS", nivel: "Avançado", icone: "https://img.icons8.com/?size=100&id=4PiNHtUJVbLs&format=png&color=000000" }
          ]
        },
        {
          categoria: "Back-end",
          itens: [
            { nome: "Git", nivel: "Básico", icone: "https://img.icons8.com/?size=100&id=20906&format=png&color=000000" },
            { nome: "MySQL", nivel: "Intermediário", icone: "https://img.icons8.com/?size=100&id=rgPSE6nAB766&format=png&color=000000" },
            { nome: "Python", nivel: "Intermediário", icone: "https://img.icons8.com/?size=100&id=13441&format=png&color=000000" },
            { nome: "Flask", nivel: "Intermediário", icone: "https://img.icons8.com/?size=100&id=AqYCfGyGXlO7&format=png&color=000000" }
          ]
        },
        {
          categoria: "Ferramentas",
          itens: [
            { nome: "GitHub", nivel: "Avançado", icone: "https://img.icons8.com/?size=100&id=62856&format=png&color=000000" },
            { nome: "Figma", nivel: "Intermediário", icone: "https://img.icons8.com/?size=100&id=zfHRZ6i1Wg0U&format=png&color=000000" },
            { nome: "Jira", nivel: "Intermediário", icone: "https://img.icons8.com/?size=100&id=RduYmqw5H7xm&format=png&color=000000" },
            { nome: "AWS", nivel: "Básico", icone: "https://img.icons8.com/?size=100&id=33039&format=png&color=000000" },
            { nome: "Docker", nivel: "Básico", icone: "https://img.icons8.com/?size=100&id=22813&format=png&color=000000" }
          ]
        }
      ];
    res.render('habilidades', { habilidades });
});

app.get('/projetos', (req, res) => {
    const projetos = [
        {
          titulo: 'Réplica do Site da Tesla',
          descricao: 'Foi Realizado uma Réplica do Site da Tesla. <br>Para a realização desse projeto utilizei HTML e CSS para a estruturação e estilização do conteúdo, além de JavaScript para a implementação do formulário de compra.',
          imagem: '/assets/Projeto Tesla.png',
          github: 'https://github.com/abeatrizdscoelho/Site-Tesla',
          demo: 'https://abeatrizdscoelho.github.io/Site-Tesla/'
        },
        {
          titulo: 'Acompanhamento do Desempenho dos Vereadores',
          descricao: 'Criação de uma plataforma web que disponibiliza informações sobre o desempenho dos vereadores da cidade de São José dos Campos durante o atual mandato. O objetivo é oferecer aos eleitores dados claros e acessíveis que ajudem a tomar decisões informadas nas eleições municipais.',
          imagem: '/assets/Tela API.png',
          github: 'https://github.com/Draco-Imperium/API_FATEC1',
          demo: 'https://github.com/abeatrizdscoelho/Projetos-API'
        }
      ];
    res.render('projetos', { projetos });
});

app.get('/certificados', (req, res) => {
    const certificados = [
        {
          titulo: "Masterizando o ChatGPT",
          imagem: "/assets/Certificado Masterizando ChatGPT.png",
          descricao: `O curso "Masterizando o Chat GPT", oferecido pela Adapta e ministrado por Max Peters, aborda aspectos essenciais da inteligência artificial generativa, oferecendo insights sobre como integrar essa tecnologia em diferentes contextos, seja para automação de tarefas, criação de conteúdo, atendimento ao cliente, entre outros.`,
          pdf: "/assets/Certificado Masterizando o ChatGPT.pdf"
        },
        {
          titulo: "Escola de Inovadores",
          imagem: "/assets/Certificado INOVA.png",
          descricao: `A Escola de Inovadores é um curso de extensão em empreendedorismo criado pela Inova CPS que visa fornecer ferramental básico de Empreendedorismo e Inovação disponibilizando um ambiente criativo e digital para que os participantes se capacitem e desenvolvam seus modelos de negócios.`,
          pdf: "/assets/CERTIFICADO_-_2024-2.pdf"
        }
      ];
    res.render('certificados', { certificados });
});

app.get('/contato', (req, res) => {
    res.render('contato')
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
