CREATE TABLE projetos (
    proj_id INT PRIMARY KEY auto_increment,
    proj_titulo VARCHAR(100),
    proj_descricao TEXT,
    proj_link VARCHAR(100)
);

CREATE TABLE tecnologias (
    tec_id INT PRIMARY KEY auto_increment,
    tec_nome VARCHAR(100)
);

CREATE TABLE tecnologiasProjeto (
    idProjeto INT,
    idTecnologia INT,
    PRIMARY KEY (idProjeto, idTecnologia),
    FOREIGN KEY (idProjeto) REFERENCES projetos(proj_id) ON DELETE CASCADE,
    FOREIGN KEY (idTecnologia) REFERENCES tecnologias(tec_id) ON DELETE CASCADE
);

/* Inserindo Projetos */
INSERT INTO projetos (proj_titulo, proj_descricao, proj_link) VALUES 
('Réplica do Site da Tesla', 'Foi Realizado uma Réplica do Site da Tesla. Para a realização desse projeto utilizei HTML e CSS para a estruturação e estilização do conteúdo, além de JavaScript para a implementação do formulário de compra.', 'https://github.com/abeatrizdscoelho/Site-Tesla');
INSERT INTO projetos (proj_titulo, proj_descricao, proj_link) VALUES 
('Acompanhamento do Desempenho dos Vereadores', 'Criação de uma plataforma web que disponibiliza informações sobre o desempenho dos vereadores da cidade de São José dos Campos durante o atual mandato. O objetivo é oferecer aos eleitores dados claros e acessíveis que ajudem a tomar decisões informadas nas eleições municipais.', 'https://github.com/Draco-Imperium/API_FATEC1');

/* Inserindo Tecnologias */
INSERT INTO tecnologias (tec_nome) VALUES ('HTML'), ('CSS'), ('JavaScript'), ('Python (Flask)'), ('MySQL');
INSERT INTO tecnologias (tec_nome) VALUES ('React'), ('Typescript'), ('Node.js');

/* Relacionando as Tecnologias com os Projetos */
INSERT INTO tecnologiasProjeto (idProjeto, idTecnologia) VALUES (1, 1), (1, 2), (1, 3);
INSERT INTO tecnologiasProjeto (idProjeto, idTecnologia) VALUES (2, 1), (2, 2), (2, 3), (2, 4), (2, 5);

SELECT * FROM projetos;
SELECT * FROM tecnologias;
SELECT * FROM tecnologiasProjeto;

SELECT p.proj_titulo, t.tec_nome
FROM projetos p
JOIN tecnologiasProjeto tp ON p.proj_id = tp.projeto_id
JOIN tecnologias t ON tp.tecnologia_id = t.tec_id
ORDER BY p.proj_id;