CREATE DATABASE Ace;
USE Ace;

DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS guide;
DROP TABLE IF EXISTS skin;
DROP TABLE IF EXISTS agent_video;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS weapon;
DROP TABLE IF EXISTS weapon_category;
DROP TABLE IF EXISTS map;
DROP TABLE IF EXISTS agent;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS address;

CREATE TABLE address (
  address_id INT NOT NULL AUTO_INCREMENT,
  street VARCHAR(100) NOT NULL,
  district VARCHAR(50) NOT NULL,
  zip_code CHAR(9) NOT NULL,
  house_number VARCHAR(10) NOT NULL,
  complement VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (address_id)
);

CREATE TABLE role (
  role_id INT NOT NULL AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL,
  PRIMARY KEY (role_id)
);

CREATE TABLE agent (
  agent_id INT NOT NULL AUTO_INCREMENT,
  agent_name VARCHAR(50) NOT NULL,
  agent_description TEXT,
  ability_one VARCHAR(50) DEFAULT NULL,
  ability_one_description TEXT,
  ability_two VARCHAR(50) DEFAULT NULL,
  ability_two_description TEXT,
  ability_three VARCHAR(50) DEFAULT NULL,
  ability_three_description TEXT,
  ultimate VARCHAR(50) DEFAULT NULL,
  ultimate_description TEXT,
  agent_image LONGTEXT DEFAULT NULL,
  PRIMARY KEY (agent_id)
);

CREATE TABLE map (
  map_id INT NOT NULL AUTO_INCREMENT,
  map_name VARCHAR(50) NOT NULL,
  map_description TEXT,
  map_image VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (map_id)
);

CREATE TABLE weapon_category (
  category_id INT NOT NULL AUTO_INCREMENT,
  category_name VARCHAR(50) NOT NULL,
  PRIMARY KEY (category_id)
);

CREATE TABLE weapon (
  weapon_id INT NOT NULL AUTO_INCREMENT,
  weapon_name VARCHAR(50) NOT NULL,
  category_id INT NOT NULL,
  credits INT NOT NULL,
  wall_penetration ENUM('Low', 'Medium', 'High') NOT NULL,
  weapon_image LONGTEXT,
  weapon_description TEXT,
  fire_mode VARCHAR(50),
  fire_rate DECIMAL(5,2), -- Rounds / second
  run_speed DECIMAL(5,2), -- Meters / second
  equip_speed DECIMAL(5,2), -- Seconds
  reload_speed DECIMAL(5,2), -- Seconds
  magazine_size INT,
  reserve_ammo INT,
  first_shot_spread DECIMAL(5,2),
  damage_head_close INT, -- 0-30m
  damage_body_close INT, -- 0-30m
  damage_leg_close INT, -- 0-30m
  damage_head_far INT, -- 30-50m
  damage_body_far INT, -- 30-50m
  damage_leg_far INT, -- 30-50m
  PRIMARY KEY (weapon_id),
  FOREIGN KEY (category_id) REFERENCES weapon_category(category_id)
);

CREATE TABLE user (
  user_id INT NOT NULL AUTO_INCREMENT,
  role_id INT DEFAULT NULL,
  is_enabled TINYINT(1) DEFAULT 1,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  cpf CHAR(11) NOT NULL,
  phone_number VARCHAR(20) DEFAULT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  address_id INT DEFAULT NULL,
  favorite_agent INT DEFAULT NULL,
  profile_pic LONGTEXT DEFAULT NULL,
  banner_img LONGTEXT DEFAULT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY email (email),
  KEY role_id (role_id),
  KEY address_id (address_id),
  KEY favorite_agent (favorite_agent),
  CONSTRAINT user_ibfk_1 FOREIGN KEY (role_id) REFERENCES role (role_id),
  CONSTRAINT user_ibfk_2 FOREIGN KEY (address_id) REFERENCES address (address_id),
  CONSTRAINT user_ibfk_3 FOREIGN KEY (favorite_agent) REFERENCES agent (agent_id)
);

CREATE TABLE agent_video (
  video_id INT NOT NULL AUTO_INCREMENT,
  agent_id INT DEFAULT NULL,
  youtube_link VARCHAR(255) NOT NULL,
  PRIMARY KEY (video_id),
  KEY agent_id (agent_id),
  CONSTRAINT agent_video_ibfk_1 FOREIGN KEY (agent_id) REFERENCES agent (agent_id)
);

CREATE TABLE skin (
  skin_id INT NOT NULL AUTO_INCREMENT,
  skin_name VARCHAR(100) NOT NULL,
  weapon_id INT NOT NULL,
  skin_image LONGTEXT DEFAULT NULL,
  description TEXT,
  PRIMARY KEY (skin_id),
  CONSTRAINT skin_ibfk_1 FOREIGN KEY (weapon_id) REFERENCES weapon (weapon_id)
);

CREATE TABLE guide (
  guide_id INT NOT NULL AUTO_INCREMENT,
  user_id INT DEFAULT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  guide_type ENUM('Agent','Map','Weapon','Other') DEFAULT 'Other',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (guide_id),
  KEY user_id (user_id),
  CONSTRAINT guide_ibfk_1 FOREIGN KEY (user_id) REFERENCES user (user_id)
);

CREATE TABLE comment (
  comment_id INT NOT NULL AUTO_INCREMENT,
  guide_id INT DEFAULT NULL,
  user_id INT DEFAULT NULL,
  comment_text TEXT NOT NULL,
  comment_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comment_id),
  KEY guide_id (guide_id),
  KEY user_id (user_id),
  CONSTRAINT comment_ibfk_1 FOREIGN KEY (guide_id) REFERENCES guide (guide_id),
  CONSTRAINT comment_ibfk_2 FOREIGN KEY (user_id) REFERENCES user (user_id)
);

-- Inserções de dados
INSERT INTO role (role_name) VALUES ('Admin'), ('Moderator'), ('User');

INSERT INTO address (street, district, zip_code, house_number, complement) VALUES 
('TiraDentes', 'Boqueirao', '12345678', '101', 'Apt 1'),
('SirThomas', 'Agua verde', '87654321', '202', NULL),
('Brigadeiro Frango', 'Batel', '11223344', '303', 'Casa verde');

INSERT INTO user (role_id, is_enabled, first_name, last_name, nickname, cpf, phone_number, email, password, address_id) VALUES
(1, 1, 'Bruno', 'Mazetto', 'brunomztt', '12345678901', '11999990000', 'bruno@gmail.com', '$2a$12$aMYXEqoIFtYXkIVEEPO6sO3fJ0J8J2DIY/68JyhgPQC/UCH7baPZW', 1),
(2, 1, 'Rafael', '', 'rafasx', '98765432100', '11988887777', 'rafa@gmail.com', '$2a$12$h.nFcDDyRBJEv74Jw5.QXunXhcMZGPe.BoZ3zHd/m7/.cW8ClXOJC', 2),
(3, 1, 'Marco', 'Capote', 'marcocapote', '19283746500', '11977776666', 'marco@gmail.com', '$2a$12$O3Z0VW4i5n3S1KfOv8QUdeVGzeVgXvWu/0eVLsrLo4qVm5VcTXvbe', 3);

INSERT INTO weapon_category (category_name) VALUES
('Pistola'),
('Submetralhadora'),
('Escopeta'),
('Rifle'),
('Sniper'),
('Metralhadora'),
('Faca');

INSERT INTO weapon 
(weapon_name, category_id, credits, wall_penetration, weapon_image, weapon_description, fire_mode, fire_rate, run_speed, equip_speed, reload_speed, magazine_size, reserve_ammo, first_shot_spread, damage_head_close, damage_body_close, damage_leg_close, damage_head_far, damage_body_far, damage_leg_far)
VALUES
('Classic', 1, 0, 'Low', NULL, 'Leve e versátil, a arma padrão para todos é um clássico instantâneo.', 'Semi', 6.75, 5.73, 0.75, 1.75, 12, 36, 0.4, 78, 26, 22, 66, 22, 18),
('Shorty', 1, 300, 'Low', NULL, 'Surpreenda seu inimigo de perto para máxima eficácia.', 'Semi', 3.33, 5.4, 0.75, 1.75, 2, 6, 4.0, 22, 11, 9, 6, 3, 2),
('Frenzy', 1, 450, 'Low', NULL, 'De perto, mantenha o gatilho pressionado. De longe... tente outra coisa.', 'Auto', 10, 5.73, 1, 1.5, 15, 45, 0.65, 78, 26, 22, 63, 21, 17),
('Ghost', 1, 500, 'Medium', NULL, 'Elegante, silenciosa e proficiente em qualquer distância.', 'Semi', 6.75, 5.73, 0.75, 1.5, 13, 39, 0.3, 105, 30, 25, 87, 25, 21),
('Sheriff', 1, 800, 'High', NULL, 'Um revólver moderno de seis tiros para quem busca headshots.', 'Semi', 4, 5.4, 1, 2.25, 6, 24, 0.25, 159, 55, 46, 145, 50, 42),
('Stinger', 2, 1100, 'Low', NULL, 'Eles saberão que acabou quando o Stinger disparar.', 'Auto', 16, 5.73, 0.75, 2.25, 20, 60, 0.65, 67, 27, 22, 57, 23, 19),
('Spectre', 2, 1600, 'Low', NULL, 'Na dúvida, a Spectre é a sua número um.', 'Auto', 13.33, 5.73, 0.75, 2.25, 30, 90, 0.4, 78, 26, 22, 60, 20, 17),
('Bucky', 3, 850, 'Low', NULL, 'Atacante. Defensor. Você é aquele com a espingarda de ação por bombeamento.', 'Semi', 1.1, 5.06, 1, 2.5, 5, 10, 2.6, 40, 20, 17, 18, 9, 7),
('Judge', 3, 1850, 'Low', NULL, 'Espingarda automática de tiro rápido que fornece dano elevado sustentado.', 'Auto', 3.5, 5.06, 1, 2.2, 5, 15, 2.25, 34, 17, 14, 14, 7, 5),
('Bulldog', 4, 2050, 'Medium', NULL, 'Algum tipo de felicidade é medida ao derrubar inimigos com o Bulldog.', 'Auto', 10, 5.4, 1, 2.5, 24, 72, 0.3, 115, 35, 29, 115, 35, 29),
('Guardian', 4, 2250, 'High', NULL, 'Brilha nas mãos de um atirador paciente.', 'Semi', 5.25, 5.4, 1, 2.5, 12, 36, 0.1, 195, 65, 49, 195, 65, 49),
('Phantom', 4, 2900, 'Medium', NULL, 'Uma arma balanceada construída para tiros estáveis e prolongados.', 'Auto', 11, 5.4, 1, 2.5, 30, 60, 0.2, 156, 39, 33, 140, 35, 29),
('Vandal', 4, 2900, 'Medium', NULL, 'Esta poderosa arma de precisão é feroz em pequenas rajadas.', 'Auto', 9.75, 5.4, 1, 2.5, 25, 50, 0.25, 160, 40, 34, 160, 40, 34),
('Marshal', 5, 950, 'Medium', NULL, 'Segure um ângulo, respire, e eles vão se arrepender de virar aquela esquina.', 'Semi', 1.5, 5.4, 1.25, 2.5, 5, 15, 1.0, 202, 101, 85, 202, 101, 85),
('Outlaw', 5, 2400, 'High', NULL, 'Canos gêmeos, impacto singular. A escolha perfeita para aquelas jogadas de tudo ou nada.', 'Semi', 2.75, 5.4, 1.25, 3.8, 2, 10, 3.5, 238, 140, 119, 238, 140, 119),
('Operator', 5, 4700, 'High', NULL, 'Fique confortável e você poderá controlar território importante.', 'Semi', 0.6, 5.13, 1.5, 3.7, 5, 10, 5.0, 255, 150, 120, 255, 150, 120),
('Ares', 6, 1600, 'High', NULL, 'Não confunda seu tamanho com desajeitamento.', 'Auto', 13, 5.13, 1.25, 3.25, 50, 100, 1.0, 75, 30, 25, 70, 28, 23),
('Odin', 6, 3200, 'High', NULL, 'Empunhar este martelo de uma máquina promete glória para o portador e ruína para o inimigo.', 'Auto', 15.6, 5.13, 1.25, 5, 100, 200, 0.8, 95, 38, 32, 77, 31, 26),
('Melee', 7, 0, 'Low', NULL, 'Uma solução íntima.', 'Semi', NULL, 6.75, 0, 0, NULL, NULL, 0, 75, 50, 50, 0, 0, 0);

-

INSERT INTO agent (agent_name, agent_description, ability_one, ability_one_description, ability_two, ability_two_description, ability_three, ability_three_description, ultimate, ultimate_description)
VALUES 
('Brimstone', 'Vindo dos EUA, o arsenal orbital de Brimstone garante que seu esquadrão esteja sempre em vantagem. Sua capacidade de oferecer utilidades com precisão e segurança faz dele um comandante inigualável na linha de frente.', 
'Incendiário', 'Lança uma granada incendiária que implanta uma área de efeito de fogo que causa dano aos inimigos.',
'Sinalizador Estimulante', 'Cria uma área que concede a você e seus aliados um bônus de velocidade de disparo, recarga e recuperação de recuo.',
'Fumaça Celeste', 'Implanta nuvens de fumaça de longa duração pelo mapa usando o mapa tático para posicioná-las com precisão.',
'Ataque Orbital', 'Dispara um poderoso feixe de energia orbital que causa alto dano na área alvo por vários segundos.'),
('Phoenix', 'Originário do Reino Unido, Phoenix ilumina o campo de batalha com seu estilo de luta, incendiando o campo de batalha com suas habilidades de flash e fogo. Com seu poder de se regenerar, ele está sempre pronto para outra luta.', 
'Bola Curva', 'Lança um orbe curvo que explode após um breve período, cegando qualquer jogador que olhar para ele.',
'Mãos Quentes', 'Lança uma bola de fogo que explode após um tempo ou ao atingir o chão, criando uma zona de fogo que danifica inimigos e cura Phoenix.',
'Muralha de Fogo', 'Cria uma parede de fogo que bloqueia a visão e danifica qualquer um que passar por ela, curando Phoenix quando ele a atravessa.',
'Renascimento', 'Marca a localização atual de Phoenix. Quando a habilidade termina ou Phoenix é morto, ele volta para essa posição com vida completa.'),
('Sage', 'O bastião da China, Sage proporciona segurança para si mesma e para sua equipe em qualquer lugar. Capaz de reviver aliados caídos e repelir investidas agressivas, ela oferece um centro de calmaria em meio ao caos da batalha.', 
'Orbe de Lentidão', 'Lança um orbe que explode ao pousar, criando um campo que desacelera os jogadores dentro dele.',
'Orbe Curativo', 'Cura um aliado ferido ou a si mesma ao longo do tempo.',
'Barreira de Orbe', 'Cria uma parede sólida que bloqueia a passagem, podendo ser rotacionada antes de ser colocada.',
'Ressurreição', 'Revive um aliado morto com vida completa.'),
('Sova', 'Nascido na tundra russa, Sova rastreia, encontra e elimina inimigos com impiedosa eficiência e precisão. Seu arco personalizado e suas habilidades de reconhecimento tornam impossível escapar de sua mira.', 
'Flecha de Choque', 'Dispara uma flecha que explode causando dano aos inimigos próximos ao ponto de impacto.',
'Flecha Rastreadora', 'Dispara uma flecha que revela a posição dos inimigos atingidos ou próximos ao local de impacto.',
'Drone Coruja', 'Implanta e controla um drone que pode marcar inimigos com um dardo rastreador revelando sua posição.',
'Fúria do Caçador', 'Dispara três poderosos raios de energia que penetram paredes e causam alto dano aos inimigos atingidos, também os revelando.'),
('Jett', 'Representando a Coreia do Sul, a agilidade e esquiva de Jett permitem que ela assuma riscos que outros não podem. Ela contorna todos os confrontos em seu caminho, cortando os inimigos antes que eles saibam o que os atingiu.', 
'Corrente Ascendente', 'Propulsiona Jett rapidamente para cima após um breve carregamento.',
'Brisa de Impulso', 'Impulsiona imediatamente Jett na direção do movimento atual.',
'Erupção Nebulosa', 'Lança um projétil que se expande numa breve nuvem que obscurece a visão ao impacto.',
'Tormenta de Aço', 'Equipa-se com várias facas de arremesso de alta precisão que se recarregam ao matar um inimigo. Pressione o modo alternativo para arremessar todas as facas restantes.'),
('Cypher', 'O especialista em informações de Marrocos, Cypher é uma rede de vigilância de um homem que monitora cada movimento do inimigo. Nenhum segredo está a salvo. Nenhuma manobra passa despercebida. Cypher está sempre vigiando.', 
'Gaiola Cibernética', 'Lança instantaneamente uma gaiola que cria uma zona que bloqueia a visão e reduz a velocidade dos inimigos que a atravessam.',
'Câmera de Vigilância', 'Implanta uma câmera que pode ser controlada para observar o ambiente. Pode disparar um dardo marcador que revela a posição do inimigo atingido.',
'Armadilha Cibernética', 'Coloca um fio armadilha invisível que, quando acionado por inimigos, os prende, revela e atordoa após um breve período.',
'Roubo Neural', 'Usa instantaneamente em um inimigo morto para revelar a localização de todos os inimigos vivos.'),
('Reyna', 'Forjada no coração do México, Reyna domina o combate individual, destacando-se a cada abate. Sua capacidade só é limitada por sua habilidade, tornando-a extremamente dependente de desempenho.', 
'Devorar', 'Os inimigos mortos por Reyna deixam Orbes de Alma que podem ser consumidos para recuperar saúde rapidamente.',
'Dispensar', 'Consome instantaneamente um Orbe de Alma próximo, tornando Reyna intangível por um curto período.',
'Olhar Voraz', 'Lança um olho destrutível que deixa todos os inimigos que o virem com visão reduzida.',
'Imperatriz', 'Entra em frenesi, aumentando drasticamente a velocidade de disparo, recarga e troca de armas. Abates renovam a duração do frenesi.'),
('Killjoy', 'A gênia da Alemanha, Killjoy, protege os campos de batalha facilmente usando seu arsenal de invenções. Se o dano causado por seu equipamento não detiver os inimigos, a debilitação de seus robôs certamente o fará.', 
'Robô de Alarme', 'Implanta um robô que caça inimigos em um cone e explode, causando vulnerabilidade aos atingidos.',
'Torreta', 'Implanta uma torreta que atira em inimigos em um cone de 180 graus. Pode ser recolhida para ser reimplantada.',
'Nanoenxame', 'Lança granadas de nanoenxame que podem ser ativadas para causar dano em uma área.',
'Confinamento', 'Implanta um dispositivo que, após carregar, detém todos os inimigos na área de efeito, desativando suas armas.'),
('Omen', 'Um fantasma de memórias passadas, Omen caça nas sombras. Cega os inimigos, teleporta-se pelo campo e deixa a paranoia assumir o controle enquanto o adversário tenta descobrir de onde virá seu próximo ataque.', 
'Paranoia', 'Dispara um projétil sombrio que reduz brevemente o alcance de visão dos jogadores atingidos.',
'Manto Sombrio', 'Equipa e lança uma orbe sombria que cria uma esfera de escuridão duradoura que bloqueia a visão.',
'Passos Tenebrosos', 'Marca uma localização e depois teleporta-se para ela após um breve período.',
'Salto das Sombras', 'Seleciona um local no mapa para teleportar-se, ficando vulnerável durante o processo mas podendo cancelar a ação.'),
('Breach', 'O sueco Breach dispara poderosos jatos cinéticos para abrir caminho pelo território inimigo. O dano e a interrupção que ele causa garantem que nenhuma luta seja justa.', 
'Estopim', 'Equipa uma carga cegante que atravessa paredes e explode após um curto retardo, cegando todos que estiverem olhando para ela.',
'Falha Tectônica', 'Equipa uma carga sísmica que atravessa uma larga área pelo chão, atordoando todos que estiverem na zona de efeito.',
'Pós-choque', 'Equipa uma carga de fusão que atravessa paredes e explode causando dano aos inimigos no local.',
'Onda Trovejante', 'Equipa uma carga sísmica que emite um terremoto em cone, atordoando e lançando para o alto todos os jogadores na área.'),
('Raze', 'Raze explode para fora do Brasil com seu estilo irreverente e armas devastadoras. Com seu gameplay de dano explosivo, ela é excelente para desalojar inimigos entrincheirados e limpar espaços apertados.', 
'Carga de Explosivos', 'Lança uma carga explosiva que gruda em superfícies. Reative para detonar, danificando e movendo tudo que for atingido.',
'Cartuchos de Tinta', 'Lança um cartucho que implanta bombas que causam dano em área após um curto período.',
'Bumba', 'Implanta um robô que avança em linha reta, quicando nas paredes até encontrar um inimigo próximo, então travando o alvo e explodindo.',
'Estraga-Prazeres', 'Equipa um lança-foguetes que causa dano massivo em área ao disparar.'),
('Viper', 'Química americana, Viper implanta uma série de dispositivos químicos venenosos para controlar o campo de batalha e prejudicar a visão do inimigo. Se as toxinas não matarem a presa, seus jogos mentais certamente o farão.', 
'Nuvem Venenosa', 'Lança um emissor de gás que pode ser reativado para criar uma nuvem de gás tóxico que consome combustível.',
'Cortina Tóxica', 'Equipa um lançador de uma longa linha de gás que consome combustível e pode ser reativada.',
'Veneno de Cobra', 'Equipa um lançador químico que quebra ao impacto, criando uma zona química persistente que danifica e reduz a velocidade dos inimigos.',
'Poço Peçonhento', 'Emite uma grande nuvem tóxica que reduz o alcance de visão e a vida máxima dos jogadores dentro dela, além de revelar inimigos que a atravessam.'),
('Skye', 'Vinda da Austrália, Skye e sua equipe de feras desbravam territórios hostis. Com seus poderes de cura e suas criações que atacam e exploram, qualquer equipe ficará mais forte e mais segura tendo Skye como aliada.', 
'Predador', 'Equipa um amuleto de tigre da Tasmânia que pode ser controlado para rastrear inimigos. Ao encontrá-los, ataca causando atordoamento.',
'Luz Guia', 'Equipa um amuleto que se transforma em um falcão, podendo ser direcionado e que cega os inimigos que olharem para ele quando ativado.',
'Renovação', 'Equipa um amuleto que cura aliados dentro do alcance e linha de visão, restaurando saúde ao longo do tempo até que a reserva de cura se esgote.',
'Rastreadores', 'Equipa um amuleto de rastreadores que revelam a localização do inimigo mais próximo. Rastreadores perseguem seu alvo e ao alcançá-los causam visão reduzida.'),
('Yoru', 'Nativo do Japão, Yoru abre fendas na realidade para se infiltrar nas linhas inimigas sem ser visto. Usando tanto o engano quanto a agressividade, ele abate os adversários antes mesmo que percebam de onde veio o ataque.', 
'Ponto Cego', 'Lança um fragmento dimensional que se fixa em uma superfície e pode ser ativado para cegar inimigos que olharem para ele.',
'Passagem Dimensional', 'Equipa um fragmento dimensional que pode ser colocado no mapa e ativado posteriormente para teleportar-se até ele.',
'Falcatrua', 'Equipa um eco dimensional que imita os passos de Yoru quando ativado e pode ser enviado adiante ou colocado em um local.',
'Espionagem Dimensional', 'Coloca Yoru em outra dimensão onde inimigos não podem vê-lo ou afetá-lo. Ganhe velocidade de movimento aumentada e a capacidade de preparar habilidades para uso ao sair.'),
('Astra', 'A agente ganesa Astra controla as energias cósmicas para remodelar os campos de batalha a seu bel-prazer. Com controle total de sua forma astral e um talento para previsões estratégicas, ela está sempre anos-luz à frente do inimigo.', 
'Pulso Nova', 'Posiciona Estrelas que podem ser ativadas como Pulso Nova, que detona após um breve momento, concussando todos os jogadores na área.',
'Nebulosa', 'Posiciona Estrelas que podem ser ativadas como Nebulosa, que dissipa em uma nuvem de fumaça duradoura que bloqueia a visão.',
'Poço Gravitacional', 'Posiciona Estrelas que podem ser ativadas como Poço Gravitacional, que puxa os jogadores próximos para o centro antes de explodir, deixando-os vulneráveis.',
'Divisa Cósmica', 'Posiciona uma divisa cósmica que bloqueia balas e abafa consideravelmente o áudio de um lado para o outro.'),
('KAY/O', 'KAY/O é uma máquina de guerra construída com um único propósito: neutralizar radiantes. Sua capacidade de suprimir habilidades inimigas neutraliza a capacidade de seus oponentes de contra-atacar, tornando-o um ativo poderoso para desabilitar defesas inimigas.', 
'FRAG/mento', 'Equipa um fragmento explosivo que gruda no chão e explode várias vezes, causando dano aos inimigos na área.',
'PONTO/zero', 'Equipa uma lâmina de supressão que é arremessada e se fixa na primeira superfície que atinge, suprimindo qualquer pessoa na área de efeito.',
'CLARÃO/cegante', 'Equipa um fragmento cegante que explode após um breve período, cegando todos na linha de visão.',
'ANULAR/cmd', 'Imediatamente sobrecarrega com energia de Radianita polarizada que fortalece KAY/O e emite pulsos de energia a partir de sua localização. Inimigos atingidos pelos pulsos são suprimidos. Se KAY/O for abatido durante o uso, ele entra em estado inoperante e pode ser revivido por um aliado.'),
('Chamber', 'Bem-vestido e bem-armado, o designer de armas francês Chamber coloca sua precisão letal à prova com armas personalizadas para defender territórios e eliminar inimigos com precisão cirúrgica.', 
'Caçador de Cabeças', 'Equipa uma pistola pesada que tem um modo de tiro alternativo para mirar com precisão.',
'Rendezvous', 'Coloca duas âncoras de teleporte que podem ser usadas para teleportar-se entre elas enquanto estiver no alcance.',
'Marca Registrada', 'Coloca uma armadilha que rastreia inimigos, criando um campo duradouro que desacelera os jogadores dentro dele quando é acionada.',
'Tour de Force', 'Invoca um poderoso rifle de precisão personalizado que mata inimigos com qualquer acerto direto. Abater um inimigo cria um campo duradouro que desacelera os jogadores dentro dele.'),
('Neon', 'Originária das Filipinas, Neon avança em velocidades impressionantes, descarregando surtos de radiância bioelétrica tão rapidamente quanto seu corpo os gera. Ela corre à frente para pegar os inimigos de surpresa e abatê-los mais rápido do que um raio.', 
'Ricochete Elétrico', 'Lança um raio de energia que ricocheta uma vez, gerando um ponto de concussão que atordoa quem for atingido.',
'Equipamento Veloz', 'Canaliza instantaneamente o poder de Neon para aumentar sua velocidade. Quando carregada, use o disparo alternativo para ativar um deslize elétrico.',
'Via Expressa', 'Dispara dois raios de energia que se estendem por uma curta distância à frente, criando dois muros de eletricidade estática que bloqueiam a visão e danificam inimigos.',
'Sobrecarga', 'Liberta todo o poder e a velocidade de Neon por um curto período. Dispara para canalizar sua energia em um raio elétrico mortal com alta precisão de movimento.'),
('Fade', 'A caçadora turca Fade desencadeia o poder dos pesadelos para capturar os segredos dos inimigos. Sintonizada com o terror, ela persegue os alvos e revela seus medos mais profundos antes de esmagá-los na escuridão.', 
'Assombrar', 'Equipa uma entidade de pesadelo que pode ser jogada como um orbe. Ao atingir o solo, a entidade revela inimigos em sua linha de visão e cria um rastro ligado a eles.',
'Apreender', 'Equipa um orbe fantasmagórico que pode ser jogado. O orbe cai após um tempo e segura inimigos em seu alcance, restringindo seus movimentos.',
'Esfolar', 'Equipa um fragmento de tormento que pode ser arremessado. O fragmento cai após um tempo e decai quem estiver em seu alcance, tornando-os surdos e marcados para inimigos.',
'Premonição', 'Canaliza para desencadear uma onda de energia de pesadelo que pode atravessar paredes. A energia cria rastros até os inimigos, deixando-os surdos, decaídos e revelados.'),
('Harbor', 'Vindo do litoral indiano, Harbor usa tecnologia ancestral para controlar as águas. Ele desencadeia corredeiras espumantes e ondas esmagadoras para proteger seus aliados e atacar suas defesas inimigas.', 
'Cúpula Aquosa', 'Equipa uma esfera de água protetora que pode ser disparada. Use disparo alternativo para lançar a esfera. Ao impacto, gera um escudo de água que bloqueia balas.',
'Enseada', 'Equipa um muro de água que pode ser disparado. Use disparo alternativo para enviá-lo adiante. Pressione para guiar o muro na direção do retículo.',
'Cascata', 'Equipa um anel de água que pode ser disparado. Ao impacto no solo, cria uma área que reduz a velocidade dos jogadores que a atravessam.',
'Ressaca', 'Equipa o poder total de seu artefato. Dispare para invocar um gêiser de água que atravessa paredes. O gêiser cria áreas no solo que atordoam inimigos.'),
('Gekko', 'Gekko, de Los Angeles, lidera um grupo muito unido de criaturas caóticas. Suas travessuras espalham desordem entre os inimigos, enquanto ele e sua gangue dominam o campo de batalha com trabalho em equipe feroz.', 
'Wingman', 'Equipa Wingman, uma criatura que ao ser disparada busca inimigos e os atordoa com uma explosão concussiva. Use disparo alternativo para plantar a Spike ou desarmar.',
'Dizzy', 'Equipa Dizzy, uma criatura que ao ser lançada avança, disparando explosões de energia que cegam inimigos.',
'Mosh Pit', 'Equipa Mosh, uma criatura que ao ser lançada rola para frente em linha reta, explodindo e criando uma área esférica que detém inimigos.',
'Thrash', 'Equipa Thrash, uma criatura que pode atacar e devorar inimigos, causando vulnerabilidade temporária. É possível recuperá-la depois de abatida.'),
('Deadlock', 'A agente norueguesa Deadlock implanta uma variedade de nanofios de ponta para defender o campo de batalha de ataques inimigos. Ninguém escapa de sua vigilância implacável, nem de suas armadilhas mortais.', 
'GravNet', 'Equipa uma granada GravNet que ao ser ativada detona, forçando inimigos atingidos a agachar e desacelerar.',
'Sensores Sônicos', 'Equipa um sensor sônico que monitora uma área em busca de inimigos. Quando um inimigo é detectado, o sensor desestabiliza o terreno, causando vulnerabilidade.',
'Malha de Barreira', 'Equipa um disco que implanta uma barreira em X que bloqueia a passagem de inimigos apenas (não projéteis).',
'Aniquilação', 'Equipa um acelerador de nanofios que, ao disparado, entrelaça-se com a primeira superfície atingida. Um inimigo que toque nos fios é aprisionado, desarmado e puxado ao longo dos fios.'),
('Clove', 'O agente escocês Clove desafia a morte com sua capacidade única de ressurreição própria. Com habilidades de fumaça e cura, Clove é uma presença destemida e resiliente que pode virar a maré da batalha.', 
'Ardil', 'Escolha duas localizações para lançar nuvens de fumaça que bloqueiam a visão. Pode ser usado após a morte na área próxima.',
'Travesso', 'Dispara um fragmento de essência de imortalidade que explode após um pequeno atraso, decaindo temporariamente os inimigos na área de efeito.',
'Levante', 'Absorve a força vital de um inimigo morto, ganhando aumento de velocidade e saúde temporária.',
'Não Morreu Ainda', 'Após a morte, permite ressuscitar-se, ganhando uma breve fase de intangibilidade enquanto determina onde renascer.'),
('Iso', 'O agente chinês Iso é um "fixer" para contratação, que utiliza sua habilidade única de criar escudos à prova de balas. Seu estilo de combate combina proteção e contra-ataque eficiente.', 
'Contra-Golpe', 'Dispara um projétil que aplica o estado Frágil aos inimigos atingidos, aumentando o dano recebido.',
'Contingência', 'Libera uma parede à prova de balas que avança automaticamente, proporcionando cobertura.',
'Duplo Tiro', 'Concede a Iso um escudo que pode absorver um único tiro de qualquer arma antes de quebrar. Reinicia após dois abates.',
'Kill Contract', 'Marca um inimigo para contrato. A localização do alvo é revelada para Iso, que recebe um escudo quando enfrenta o alvo designado.'),
('Vyse', 'De origem misteriosa, Vyse foi mantida em cativeiro na ilha remota de Jan Mayen. Com suas habilidades de manipulação de metal líquido, ela pode criar armadilhas mortais e negar o uso de armas primárias dos inimigos.', 
'Assimilação', 'Absorve uma arma aliada caída ou desarmar uma arma inimiga caída, convertendo-a em uma carga defensiva que pode ser reimplantada para proteger uma área.',
'Reforço', 'Fortalece uma superfície penetrável, tornando-a impenetrável por um período e fortalecendo estruturas destrutíveis.',
'Vinha de Navalha', 'Implanta um ninho de metal líquido invisível que, quando acionado, expande-se em espinhos que retardam e danificam inimigos.',
'Jardim de Aço', 'Libera um emaranhado de espinhos de metal líquido em uma ampla área. Inimigos na área de efeito não podem usar suas armas primárias por oito segundos.'),
('Tejo', 'O agente colombiano Tejo é um consultor de inteligência com habilidades únicas para recolher informações e neutralizar inimigos. Seu arsenal inclui mísseis guiados, granadas aderentes e um drone de infiltração.', 
'Granadas Aderentes', 'Equipa granadas que aderem a superfícies e inimigos, explodindo após um breve período ou quando ativadas remotamente.',
'Drone de Infiltração', 'Implanta um drone que pode ser controlado para reconhecimento, marcando inimigos que cruzarem seu caminho.',
'Míssil Guiado', 'Lança um míssil teleguiado que segue inimigos marcados, causando dano explosivo ao impacto.',
'Sobrecarga de Sistema', 'Canaliza energia para criar uma onda EMP que desativa temporariamente todas as habilidades e equipamentos inimigos na área afetada.'),
('Waylay', 'Um agente altamente adaptável com habilidade de coletar e utilizar tecnologia inimiga. Waylay pode hackear dispositivos inimigos, criar zonas de anti-tecnologia e reciclar equipamentos para seu próprio uso.', 
'Interferência', 'Implanta um dispositivo que cria uma zona onde habilidades inimigas são desativadas temporariamente.',
'Reaproveitamento', 'Coleta itens de campo de batalha para criar novas ferramentas ou melhorar habilidades existentes.',
'Intrusão', 'Hackeia dispositivos inimigos, convertendo-os em aliados ou causando mal funcionamento.',
'Assimilação Tecnológica', 'Absorve e replica uma habilidade inimiga por um breve período, permitindo seu uso.');