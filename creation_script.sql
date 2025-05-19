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
  map_image LONGTEXT DEFAULT NULL,
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

INSERT INTO map (map_name, map_description, map_image) 
VALUES ('Haven', 'Uma misteriosa estrutura que abriga um conduíte astral que irradia com poder ancestral. Grandes portas de pedra proporcionam diversas oportunidades de movimento e desbloqueiam caminhos para três locais misteriosos. Um templo localizado em Thimphu, Butão.', NULL),
('Bind', 'Situado em Rabat, Marrocos, este mapa apresenta teletransportadores de sentido único que permitem rotações rápidas entre os locais A e B. Sem área média para facilitar a travessia, os jogadores devem dominar os teletransportadores ou arriscar longas rotações.', NULL),
('Split', 'Uma instalação de pesquisa ultrassecreta dividida por um experimento com radianita que falhou. Com opções defensivas tão divididas quanto o mapa, a escolha é sua: enfrentar os atacantes em seu próprio território ou fortificar-se para resistir ao ataque. Baseado em Tóquio, Japão.', NULL),
('Ascent', 'Um playground aberto para pequenas guerras de posição e desgaste divide dois locais em Ascent. Cada local pode ser fortificado por portas de bomba irreversíveis; uma vez fechadas, você terá que destruí-las ou encontrar outro caminho. Situado em Veneza, Itália.', NULL),
('Icebox', 'Um ambiente gelado localizado próximo à ilha Bennett, na Rússia. Apresenta tirolesas horizontais, contêineres de envio e múltiplos níveis de altura, criando um labirinto de ângulos táticos. Os locais de planta têm dois níveis, oferecendo opções estratégicas para plantar o spike.', NULL),
('Breeze', 'Aprecie as vistas de ruínas históricas ou cavernas à beira-mar neste paraíso tropical. Este mapa com locais amplos favorece combates de longa distância e está localizado no Triângulo das Bermudas. Apresenta um duto de ventilação conectando o site A e Mid.', NULL),
('Fracture', 'Um local de uma instalação de radianita onde um experimento deu terrivelmente errado, dividindo a área ao meio. Localizado nos cânions próximos a Santa Fé, Novo México. Os atacantes começam em lados opostos do mapa, conectados por uma tirolesa subterrânea.', NULL),
('Pearl', 'Os atacantes avançam em direção aos defensores neste mapa de dois locais em uma vibrante cidade subaquática. Pearl é um mapa geo-orientado sem mecânicas. Leve a luta através de um meio compacto ou das alas de longo alcance em nosso primeiro mapa ambientado na Terra Ômega. Localizado em Lisboa, Portugal.', NULL),
('Lotus', 'Um templo antigo localizado nas Ghats Ocidentais da Índia com três locais de spike. Apresenta portas giratórias entre locais, uma parede destrutível entre A Main e A Link, e quedas silenciosas. O terceiro orbe ultimate está localizado no meio.', NULL),
('Sunset', 'Um mapa tradicional com dois locais e três corredores, inspirado em Los Angeles, Califórnia. Apresenta uma porta mecânica entre B Market e Mid Courtyard que pode ser controlada por um interruptor, bloqueando o acesso ao site quando fechada.', NULL),
('Abyss', 'Localizado nas profundezas da ilha de Sør-Jan, na Noruega, este é o primeiro mapa sem limites externos em muitas áreas, permitindo que jogadores caiam para a morte. Apresenta atalhos de salto, design multinível e ascensores. O mapa tem uma configuração de três corredores com dois locais de spike.', NULL),
('Range', 'Um campo de treinamento localizado em Veneza, Itália, projetado para que os agentes pratiquem suas habilidades de pontaria e utilizem suas habilidades. Oferece bots para treino, alvos de longa distância e cenários simulados para aprimorar sua jogabilidade.', NULL);

INSERT INTO guide (user_id, title, content, guide_type) VALUES
(1, 'VALORANT: Guia Completo para Iniciantes', '# VALORANT: Guia Completo para Iniciantes

Bem-vindo ao mundo de alto risco de VALORANT, um jogo de tiro tático baseado em personagens que combina mecânicas precisas de tiro com habilidades únicas de agentes. Seja você completamente novo em jogos de tiro táticos ou migrando de outro jogo, este guia abrangente vai equipá-lo com o conhecimento fundamental e as estratégias necessárias para iniciar sua jornada rumo à maestria.

## Entendendo os Fundamentos

VALORANT é, em sua essência, um jogo de tiro tático onde duas equipes de cinco jogadores competem em um formato melhor de 25 rodadas. O objetivo da equipe atacante é plantar um dispositivo chamado "Spike" em locais designados, enquanto a equipe defensora deve impedir o plantio ou desarmar o Spike caso seja plantado. Cada jogador seleciona um agente único com habilidades especiais que podem mudar o rumo da batalha quando usadas estrategicamente.

O que diferencia VALORANT de muitos outros jogos de tiro é sua ênfase em:
- Mecânica de tiro precisa com padrões de recuo punitivos
- Gerenciamento econômico entre rodadas
- Uso estratégico de utilidades através das habilidades dos agentes
- Coordenação e comunicação em equipe
- Controle de mapa e consciência posicional

### Seus Primeiros Passos

Antes de mergulhar nas partidas, reserve um tempo para se familiarizar com as mecânicas do jogo no Campo de Treinamento:

1. **Ajuste suas configurações**: Encontrar a sensibilidade certa, mira e configurações de vídeo é crucial para um desempenho consistente. A maioria dos profissionais usa sensibilidades mais baixas (eDPI entre 200-400) para uma mira precisa e configurações gráficas mais baixas para maximizar os quadros por segundo.

2. **Pratique mecânicas de tiro**: As mecânicas de tiro de VALORANT recompensam precisão e punem movimento durante o disparo. Aprenda a:
   - Ficar parado ao atirar para maximizar a precisão
   - Utilizar disparos em rajada a médias e longas distâncias em vez de sprays
   - Manter a mira constantemente na altura da cabeça
   - Contra-strafar (pressionar a tecla de movimento oposta antes de atirar) para rapidamente se tornar preciso

3. **Explore os agentes**: Dedique tempo para entender as habilidades de cada agente no campo de treinamento antes de usá-los em partidas reais.

## Dominando a Economia

O sistema econômico de VALORANT é uma camada estratégica que impacta significativamente a jogabilidade. Jogadores ganham créditos baseados em seu desempenho na rodada:

- 3.000 créditos por vencer uma rodada
- 1.900 créditos por perder uma rodada
- 200 créditos por eliminação
- 300 créditos por plantar o Spike (apenas para quem planta)
- Bônus por derrotas consecutivas

Estes créditos podem ser gastos em armas, escudos e habilidades no início de cada rodada. Aprender a gerenciar sua economia é vital:

- **Compra Completa**: Quando sua equipe tem créditos suficientes para que todos comprem armas adequadas (Vandal/Phantom), escudos pesados e habilidades necessárias.
- **Meia Compra/Compra Forçada**: Quando sua equipe compra armas mais baratas (Spectre/Bulldog/Guardian) com escudos leves para ter alguma chance apesar dos créditos limitados.
- **Econômica**: Quando sua equipe economiza créditos comprando equipamento mínimo ou nenhum, aceitando uma desvantagem para garantir uma compra completa na rodada seguinte.

Coordene suas compras com sua equipe para maximizar a eficácia geral. Às vezes é melhor que todos economizem juntos do que alguns jogadores terem boas armas enquanto outros têm apenas pistolas.

## Entendendo as Funções dos Agentes

VALORANT divide seus agentes em quatro funções distintas, cada uma servindo um propósito específico dentro de uma composição de equipe:

### Duelistas

Duelistas são os agressivos da linha de frente projetados para criar espaço e garantir abates. Eles geralmente têm habilidades que facilitam jogadas agressivas, autossuficiência e entrada disruptiva.

**Responsabilidades principais:**
- Fazer a primeira entrada e criar abertura nas defesas inimigas
- Criar espaço para os companheiros de equipe seguirem
- Fazer duelos agressivos para criar vantagens
- Criar distrações para os companheiros de equipe

**Exemplos incluem:** Jett, Reyna, Phoenix, Raze, Neon e Yoru.

**Escolha esta função se:** Você tem fortes habilidades mecânicas, reflexos rápidos e prefere um estilo de jogo agressivo com cenários de alto risco e alta recompensa.

### Iniciadores

Iniciadores coletam informações críticas e preparam os companheiros para o sucesso, limpando ângulos e perturbando posições inimigas. Eles fazem a ponte entre controladores e duelistas, frequentemente fornecendo utilidades que permitem execuções de site mais seguras.

**Responsabilidades principais:**
- Coletar informações sobre posições inimigas
- Limpar ângulos e espaços apertados com utilidades
- Apoiar duelistas durante a entrada no site
- Perturbar configurações defensivas

**Exemplos incluem:** Sova, Breach, Skye, KAY/O, Fade e Gekko.

**Escolha esta função se:** Você gosta de apoiar sua equipe enquanto ainda tem impacto significativo, tem bom senso de jogo e prefere uma abordagem equilibrada entre agressão e uso de utilidades.

### Controladores

Controladores se especializam em manipular o campo de batalha, bloqueando visão e controlando áreas do mapa. Suas fumaças e habilidades de negação de área são cruciais para executar estratégias e limitar opções defensivas.

**Responsabilidades principais:**
- Cortar linhas de visão inimigas com fumaças
- Criar caminhos seguros para movimentação da equipe
- Controlar áreas-chave do mapa
- Apoiar execuções e defesas de sites

**Exemplos incluem:** Brimstone, Omen, Astra, Viper e Harbor.

**Escolha esta função se:** Você gosta de jogabilidade estratégica, tem boa consciência de mapa e prefere uma função de suporte que impacta significativamente o sucesso da equipe sem necessariamente liderar o placar de abates.

### Sentinelas

Sentinelas se destacam em fechar áreas e vigiar flancos. Eles proporcionam estabilidade à equipe com utilidades defensivas e habilidades de coleta de informações que garantem o território uma vez conquistado.

**Responsabilidades principais:**
- Segurar sites contra investidas inimigas
- Vigiar flancos e garantir território
- Configurar utilidades defensivas
- Retardar avanços inimigos

**Exemplos incluem:** Cypher, Killjoy, Sage, Chamber e Deadlock.

**Escolha esta função se:** Você tem um estilo de jogo paciente, boa antecipação de movimentos inimigos e prefere uma abordagem mais defensiva com jogadas ocasionais de alto impacto.

## Entendendo os Modos de Jogo

VALORANT oferece vários modos de jogo para atender a diferentes estilos de jogo e restrições de tempo:

### Não-Competitivo

O modo de jogo padrão que segue as mesmas regras das partidas competitivas, mas sem afetar seu ranking. É perfeito para aprender os fundamentos do jogo, praticar com novos agentes ou simplesmente jogar sem o estresse do modo competitivo. As partidas são melhor de 25 rodadas (primeiro a ganhar 13 vence), com trocas de lados após 12 rodadas.

### Competitivo

O modo ranqueado onde seu desempenho afeta seu rank visível e classificação oculta (MMR). Você deve vencer 10 partidas não-competitivas antes de desbloquear o modo competitivo. Os ranks variam de Ferro a Radiante, com cada nível, exceto Radiante, tendo três sub-ranks.

### Jogo Rápido

Uma versão condensada do formato padrão, jogando melhor de 9 rodadas (primeiro a chegar a 5 vence). Este modo é ideal para jogadores com tempo limitado que ainda desejam a experiência central de VALORANT. As rodadas são mais curtas e a economia é ajustada para acomodar o ritmo mais rápido.

### Spike Rush

Um modo rápido e casual onde as rodadas são mais rápidas, todos os atacantes têm o Spike e todos recebem a mesma arma aleatória a cada rodada. Orbes especiais espalhados pelo mapa fornecem bônus ou efeitos únicos. As partidas são melhor de 7 rodadas (primeiro a chegar a 4 vence).

### Mata-Mata

Um modo todos contra todos com 12 jogadores competindo para alcançar 40 eliminações primeiro ou ter mais eliminações quando o tempo acabar. Não há habilidades neste modo, tornando-o ideal para aquecer sua mira ou praticar os fundamentos de tiro.

### Replicação

Um modo onde todos os jogadores de cada equipe jogam como o mesmo agente, votado no início da partida. Isso cria cenários caóticos e divertidos onde habilidades são usadas em combinações únicas impossíveis no jogo padrão.

### Escalação

Um modo baseado em equipe onde os jogadores progridem através de uma série de armas após atingir limiares de eliminação. As equipes começam com armas poderosas e gradualmente passam para opções menos poderosas, com a primeira equipe a completar todos os níveis vencendo.

## Estratégia e Táticas Básicas

### Fundamentos de Ataque

1. **Configuração Padrão**: Espalhar-se para maximizar o controle de mapa e coleta de informações no início das rodadas.

2. **Execução de Site**: Coordenar o uso de utilidades ao investir em um site:
   - Controladores bloqueiam ângulos importantes
   - Iniciadores coletam informações e limpam ângulos
   - Duelistas criam espaço e fazem os primeiros engajamentos
   - Sentinelas vigiam flancos e se preparam para garantir o pós-planta

3. **Jogo Pós-Planta**: Após plantar o Spike:
   - Estabelecer fogos cruzados cobrindo principais pontos de entrada
   - Usar utilidades restantes para atrasar desarmes
   - Jogar pelo tempo em vez de caçar eliminações
   - Considerar jogar de posições inesperadas

### Fundamentos de Defesa

1. **Configuração de Site**: Posicionar jogadores estrategicamente em cada site:
   - Fogos cruzados que cobrem múltiplos ângulos
   - Colocação de utilidades que atrasam investidas
   - Configurações que permitem recuos seguros

2. **Rotações**: Estar ciente de quando e como rotacionar:
   - Comunicar informações claramente antes de rotacionar
   - Deixar um jogador para atrasar quando possível
   - Usar caminhos de rotação eficientes
   - Considerar rotações falsas para confundir atacantes

3. **Retomada de Sites**: Ao retomar um site após o plantio do Spike:
   - Coordenar uso de utilidades para limpar pontos comuns
   - Entrar de múltiplos ângulos simultaneamente
   - Priorizar o desarme quando possível sobre caçar eliminações

## Fundamentos de Comunicação

Comunicação efetiva é a espinha dorsal do sucesso em VALORANT. Desenvolva estes hábitos de comunicação:

1. **Callouts Claros**: Aprenda os callouts do mapa e use-os consistentemente.

2. **Planejamento Econômico**: Discuta economia da equipe e estratégias de compra no início de cada rodada.

3. **Informação sobre Inimigos**: Informe posições inimigas, habilidades usadas e dano causado.

4. **Comunicação de Estratégia**: Planeje execuções, rotações e configurações defensivas com os companheiros.

5. **Reforço Positivo**: Mantenha o moral da equipe permanecendo positivo e construtivo.

## Dicas Avançadas para Melhorar

1. **Revisão de VOD**: Grave e revise sua jogabilidade para identificar erros e áreas para melhoria.

2. **Posicionamento de Mira**: Sempre mantenha sua mira na altura da cabeça onde os inimigos provavelmente aparecerão.

3. **Pré-apontando Ângulos Comuns**: Aprenda posições comuns onde inimigos jogam e pré-aponte estes locais.

4. **Domínio de Utilidades**: Aprenda lineups e uso avançado de utilidades para seus agentes preferidos.

5. **Consciência de Mapa**: Desenvolva um mapa mental das posições inimigas baseado nas informações coletadas.

6. **Eficiência de Movimento**: Aprenda técnicas eficientes de movimento como contra-strafing e shoulder peek.

7. **Rotina de Aquecimento**: Desenvolva uma rotina de aquecimento consistente para preparar suas mecânicas antes de jogar.

## O Caminho para a Melhoria

VALORANT é um jogo de melhoria incremental. Concentre-se nestas áreas à medida que progride:

1. **Habilidades Mecânicas**: Mira, movimento e uso de habilidades
2. **Senso de Jogo**: Consciência posicional, timing e tomada de decisões
3. **Jogo em Equipe**: Comunicação, coordenação e cumprimento de função
4. **Jogo Mental**: Foco, adaptabilidade e controle emocional

Lembre-se que a melhoria vem com prática deliberada, não apenas tempo de jogo. Defina objetivos específicos para cada sessão e reflita sobre seu progresso regularmente.

## Conclusão

VALORANT recompensa pensamento estratégico, habilidade mecânica e trabalho em equipe em igual medida. Ao iniciar sua jornada, concentre-se em dominar os fundamentos antes de se preocupar com técnicas avançadas ou subir na escada competitiva. Encontre agentes e estilos de jogo que se adequem às suas preferências e lembre-se que contribuir para o sucesso da equipe frequentemente significa mais do que feitos individuais.

Boa sorte no campo de batalha, Agente. O Protocolo VALORANT aguarda seus talentos.', 'Other');

-- Guia para modos de jogo
INSERT INTO guide (user_id, title, content, guide_type) VALUES
(1, 'VALORANT: Guia Mestre de Modos de Jogo', '# VALORANT: Guia Mestre de Modos de Jogo

VALORANT oferece uma variedade de modos de jogo para atender a diferentes preferências de jogadores, restrições de tempo e desejos competitivos. Seja você procurando competição intensa, diversão casual ou partidas rápidas para se encaixar em uma agenda ocupada, existe um modo projetado para você. Este guia abrangente explora todos os modos de jogo disponíveis, fornecendo estratégias e dicas para ajudá-lo a se destacar em cada formato.

## Modos Padrão (Sempre Disponíveis)

### Não-Competitivo

**Visão Geral:** Não-Competitivo serve como a base da jogabilidade de VALORANT, seguindo o mesmo formato das partidas competitivas, mas sem afetar seu rank.

**Estrutura da Partida:**
- Jogabilidade baseada em equipes 5v5
- Primeira equipe a vencer 13 rodadas vence a partida
- As equipes trocam de lado após 12 rodadas (Ataque ↔ Defesa)
- Sistema econômico padrão com opções de compra completa
- Tempo médio de partida: 30-40 minutos

**Características Principais:**
- Acesso completo a todos os agentes e suas habilidades
- Sistema completo de compra de armas
- Sem impacto no rank, mas ainda usa MMR oculto para matchmaking
- Mesma profundidade estratégica do jogo competitivo

**Quando Jogar:**
- Quando estiver aprendendo novos agentes ou estratégias
- Quando quiser a experiência completa de VALORANT sem pressão competitiva
- Para aquecer antes de partidas ranqueadas
- Quando jogar com amigos de diferentes níveis de habilidade

**Dicas Estratégicas:**
- Use o Não-Competitivo para praticar execuções de site e configurações defensivas
- Experimente diferentes armas e estratégias econômicas
- Pratique comunicação e coordenação de equipe
- Teste novos agentes e habilidades em um ambiente de partida adequado

**Visão Profissional:** Muitos jogadores profissionais usam o Não-Competitivo como campo de testes para novas estratégias antes de implementá-las em torneios. É um espaço valioso para refinar sua jogabilidade sem a pressão de mudanças de rank.

### Competitivo

**Visão Geral:** O modo Competitivo é a escada ranqueada de VALORANT, onde seu desempenho afeta seu rank visível e determina sua posição na hierarquia de habilidade do jogo.

**Estrutura da Partida:**
- Idêntico ao Não-Competitivo: 5v5, primeiro a 13 rodadas vence
- As equipes trocam de lado após 12 rodadas
- Prorrogação se empatar em 12-12 (vencer por 2 rodadas ou votar por empate)
- Tempo médio de partida: 30-45 minutos (mais tempo com prorrogação)

**Sistema de Classificação:**
1. **Ferro** (1-3)
2. **Bronze** (1-3)
3. **Prata** (1-3)
4. **Ouro** (1-3)
5. **Platina** (1-3)
6. **Diamante** (1-3)
7. **Ascendente** (1-3)
8. **Imortal** (1-3)
9. **Radiante** (único nível, apenas melhores jogadores)

**Características Principais:**
- Requer completar 10 partidas não-competitivas para desbloquear
- Partidas de colocação determinam rank inicial
- Sistema RR (Rank Rating) determina a progressão
- Vitória/derrota é o fator primário, mas desempenho individual importa
- Matchmaking mais equilibrado baseado em nível de habilidade

**Quando Jogar:**
- Quando quiser medir e melhorar suas habilidades competitivas
- Quando tiver uma compreensão sólida dos fundamentos do jogo
- Quando puder se comprometer com 30-45 minutos sem interrupção
- Com uma equipe pré-montada para melhor coordenação

**Dicas Estratégicas:**
- Foque em desempenho consistente em vez de jogadas de destaque
- Comunique-se efetivamente e mantenha-se positivo
- Aprenda composições meta para cada mapa
- Desenvolva fundamentos fortes em mira, posicionamento e uso de utilidades
- Analise derrotas para identificar áreas de melhoria

**Visão Profissional:** Mesmo nos níveis mais altos, subir de rank requer consistência acima de tudo. Concentre-se em manter um percentual de vitórias positivo ao longo do tempo em vez de se estressar com partidas individuais.

### Jogo Rápido

**Visão Geral:** Jogo Rápido é uma versão condensada do formato padrão de VALORANT, projetado para jogadores com tempo limitado que ainda querem a experiência tática central.

**Estrutura da Partida:**
- Jogabilidade baseada em equipes 5v5
- Primeira equipe a vencer 5 rodadas vence a partida
- As equipes trocam de lado após 4 rodadas
- Sistema econômico modificado com créditos definidos por rodada
- Tempo médio de partida: 15-20 minutos

**Características Principais:**
- Jogadores começam cada metade com dois pontos de ultimate (Breach, Killjoy e Viper recebem três)
- Economia modificada com créditos predeterminados a cada rodada
- Sem bônus por sequência de derrotas
- Habilidades de agentes completas e mecânicas de jogabilidade

**Quando Jogar:**
- Quando tiver tempo limitado, mas quiser uma experiência tática
- Para aquecer antes de sessões mais longas
- Quando introduzir novos jogadores à jogabilidade central de VALORANT
- Para praticar cenários específicos sem se comprometer com uma partida completa

**Dicas Estratégicas:**
- Concentre-se em maximizar o valor de menos rodadas
- Priorize o uso de ultimate, já que as partidas são mais curtas
- Desenvolva estratégias eficientes e executáveis que não exijam configurações complexas
- Seja mais decisivo com decisões econômicas

**Visão Profissional:** Jogo Rápido é excelente para praticar execuções específicas de site ou configurações defensivas repetidamente em um ambiente competitivo. Use-o para refinar aspectos particulares da sua jogabilidade quando não tiver tempo para partidas completas.

### Mata-Mata

**Visão Geral:** Um modo todos contra todos focado puramente na mecânica de tiro, onde 12 jogadores competem para alcançar o alvo de eliminações primeiro ou ter mais eliminações quando o tempo acabar.

**Estrutura da Partida:**
- Todos contra todos com 12 jogadores
- Primeiro a alcançar 40 eliminações ou maior pontuação após 9 minutos
- Reaparecimento instantâneo após morte
- Tempo médio de partida: 7-9 minutos

**Características Principais:**
- Sem habilidades (foco puro na mecânica de tiro)
- Créditos ilimitados para compra de armas
- Regeneração instantânea de vida após eliminações
- Spawns aleatórios pelo mapa
- Sem sistema econômico

**Quando Jogar:**
- Para aquecer a mira antes de partidas competitivas
- Para praticar mecânicas de tiro puras
- Quando tiver tempo limitado
- Para focar em posicionamento de mira e posicionamento

**Dicas Estratégicas:**
- Concentre-se em manter a mira na altura da cabeça
- Pratique diferentes armas com as quais você tem dificuldade
- Preste atenção a dicas sonoras para inimigos próximos
- Desenvolva pre-firing em posições comuns
- Trabalhe no movimento enquanto atira

**Visão Profissional:** Quase todos os jogadores profissionais usam o Mata-Mata como sua principal ferramenta de aquecimento antes de prática ou competição. Muitos jogam múltiplos Mata-Mata antes de tocar no modo Competitivo para garantir que suas mecânicas estejam afiadas.

### Spike Rush

**Visão Geral:** Uma alternativa mais rápida e casual às partidas padrão, com armas aleatórias e orbes de poder para uma jogabilidade caótica e com uso intenso de habilidades.

**Estrutura da Partida:**
- Jogabilidade baseada em equipes 5v5
- Primeira equipe a vencer 4 rodadas vence a partida
- As equipes trocam de lado após 3 rodadas
- Todos os atacantes carregam um spike
- Tempo médio de partida: 8-12 minutos

**Características Principais:**
- Armas aleatórias a cada rodada (todos recebem a mesma arma)
- Todas as habilidades totalmente carregadas no início da rodada
- Orbes especiais espalhados pelo mapa (Ultimate, Melhoria de Arma, Vida, etc.)
- Sem sistema econômico

**Quando Jogar:**
- Para sessões rápidas e casuais
- Quando aprender layouts básicos de mapas
- Para diversão com amigos de diferentes níveis de habilidade
- Para praticar com armas aleatórias

**Orbes Especiais:**
1. **Orbe Ultimate:** Carrega completamente sua habilidade ultimate
2. **Orbe de Melhoria de Arma:** Aprimora sua arma atual
3. **Orbe da Arma Dourada:** Concede uma pistola de eliminação com um único tiro
4. **Orbe de Vida:** Fornece cura para sua equipe
5. **Orbe de Ilusão:** Cria passos falsos
6. **Orbe de Aceleração:** Aumenta a velocidade de movimento

**Dicas Estratégicas:**
- Priorize o controle de orbes com base nos pontos fortes do seu agente
- Adapte-se rapidamente às armas aleatórias a cada rodada
- Use a recarga acelerada de habilidades para praticar utilidades
- Concentre-se em coordenar investidas, já que todos na ofensiva têm um spike

**Visão Profissional:** Spike Rush pode ajudar a desenvolver adaptabilidade forçando você a usar armas que normalmente não escolheria. Esta flexibilidade pode se traduzir em melhor tomada de decisão econômica em partidas padrão.

### Jogo Personalizado

**Visão Geral:** Jogos personalizados permitem que jogadores criem partidas privadas com configurações totalmente personalizáveis para prática, torneios ou jogo casual com amigos.

**Opções de Personalização:**
- Seleção de mapa
- Tamanho e composição da equipe
- Trapaças (habilidades infinitas, créditos infinitos, etc.)
- Tempo e número de rodadas
- Limites de pontuação
- Modo torneio (idêntico às configurações competitivas)

**Características Principais:**
- Controle completo sobre parâmetros da partida
- Capacidade de praticar sem matchmaking público
- Opções para slots de observador para coaching ou transmissão
- Sem ganhos de progressão ou XP

**Quando Usar:**
- Para sessões de prática em equipe
- Para aprender lineups e configurações
- Para torneios privados
- Para explorar mapas sem pressão
- Para sessões de coaching

**Dicas Estratégicas:**
- Use o modo Trapaças para praticar lineups de utilidades eficientemente
- Configure cenários específicos para trabalhar (retakes, execuções, etc.)
- Pratique com sua equipe regular no modo torneio
- Use slots de observador para coaching e feedback

**Visão Profissional:** Equipes profissionais passam a maior parte do seu tempo de prática em jogos personalizados, aperfeiçoando estratégias e realizando "scrims" (partidas de prática) contra outras equipes no modo torneio.

## Modos de Jogo Rotativos

VALORANT apresenta regularmente modos de jogo especiais que entram e saem de disponibilidade, oferecendo experiências únicas além dos formatos padrão.

### Escalação

**Visão Geral:** Um modo de gun game baseado em equipe onde os jogadores progridem através de uma sequência de armas conforme sua equipe assegura eliminações, começando com opções poderosas e terminando com básicas.

**Estrutura da Partida:**
- Jogabilidade baseada em equipes 5v5
- Progresso através de 12 níveis de armas com eliminações da equipe
- Primeira equipe a completar todos os níveis ou liderar quando o tempo expirar vence
- Reaparecimento instantâneo após morte
- Tempo médio de partida: 8-12 minutos

**Características Principais:**
- Progressão de armas de poderosas para básicas
- Sem habilidades de agentes (exceto quando na rotação de armas)
- Progressão baseada em equipe em vez de individual
- Cura automática após eliminações

**Quando Jogar:**
- Para diversão casual com amigos
- Para praticar com uma variedade de armas
- Quando quiser uma pausa da jogabilidade tática
- Para sessões de jogo mais curtas

**Dicas Estratégicas:**
- Concentre-se em garantir eliminações rapidamente nos níveis iniciais de armas
- Trabalhe como equipe em vez de ir para jogadas solo
- Adapte seu estilo de jogo aos pontos fortes de cada arma
- Use reaparecimentos estrategicamente para aplicar pressão constante

**Visão Profissional:** Escalação força adaptabilidade com diferentes armas, o que pode melhorar sua versatilidade em modos padrão quando enfrentar restrições econômicas.

### Replicação

**Visão Geral:** Um modo onde todos os jogadores de uma equipe jogam como o mesmo agente, selecionado através de votação, criando cenários caóticos com uso sincronizado de habilidades.

**Estrutura da Partida:**
- Jogabilidade baseada em equipes 5v5
- Primeira equipe a vencer 5 rodadas vence
- As equipes votam em qual agente todos jogarão
- Sistema econômico modificado
- Tempo médio de partida: 15-20 minutos

**Características Principais:**
- Todos os jogadores em cada equipe usam o mesmo agente
- Cooldowns de habilidades são mais longos para evitar utilidades esmagadoras
- Economia "Todos por Um" (créditos compartilhados)
- Requisitos aumentados de pontos de ultimate

**Quando Jogar:**
- Para jogabilidade casual, muitas vezes hilária
- Para experimentar o caos de habilidades de agentes empilhadas
- Quando aprender os limites de agentes específicos
- Para uma pausa refrescante das táticas padrão

**Dicas Estratégicas:**
- Coordene o uso de habilidades para máximo impacto (cinco dardos Sova, cinco flashes Breach, etc.)
- Aprenda janelas de timing quando certas habilidades empilhadas são mais eficazes
- Experimente agentes que você normalmente não joga
- Desenvolva estratégias criativas que aproveitem múltiplas utilidades do mesmo tipo

**Visão Profissional:** Replicação pode fornecer insights sobre interações e timings de habilidades que podem não ser óbvios no jogo padrão, potencialmente inspirando novas abordagens táticas.

### Guerra de Bolas de Neve (Sazonal)

**Visão Geral:** Um modo de mata-mata em equipe temático de inverno onde jogadores usam lançadores de bolas de neve com vários power-ups em combate rápido.

**Estrutura da Partida:**
- Jogabilidade baseada em equipes 5v5
- Primeira equipe a alcançar 50 eliminações ou maior pontuação após o tempo expirar vence
- Reaparecimento instantâneo após morte
- Tempo médio de partida: 8-10 minutos

**Características Principais:**
- Todos usam lançadores de bolas de neve como arma primária
- Presentes de power-up espalhados pelo mapa
- Sem habilidades de agentes
- Variantes de mapa temáticas de inverno

**Power-ups:**
1. **Tiro Rápido:** Aumento na taxa de disparo
2. **Bola Crescente:** Bolas de neve aumentadas com hitboxes maiores
3. **Ricochete:** Bolas de neve que quicam em superfícies
4. **Patins:** Aumento na velocidade de movimento

**Quando Jogar:**
- Durante eventos de inverno
- Para diversão festiva e casual
- Quando fazer uma pausa do jogo competitivo
- Com amigos de diferentes níveis de habilidade

**Dicas Estratégicas:**
- Priorize coleta de power-up
- Use movimento e posicionamento em vez de mira pura
- Coordene-se com companheiros de equipe para controlar áreas de alto tráfego
- Domine o arco e tempo de viagem das bolas de neve

**Visão Profissional:** Mesmo modos casuais como Guerra de Bolas de Neve podem melhorar seu movimento e habilidades de previsão de projéteis, o que se traduz em melhor uso de utilidades no jogo padrão.

## O Campo de Treinamento

Embora não seja tecnicamente um modo de jogo, o Campo de Treinamento é uma ferramenta essencial para melhorar suas habilidades em VALORANT.

**Áreas Principais:**

### Área de Teste de Tiro
- Bots estacionários e em movimento para prática de mira
- Marcadores de distância para teste de queda de dano
- Opções para dificuldade e comportamento dos bots

### Prática de Plantar/Desarmar Spike
- Simula cenários de plantio e desarme com bots inimigos
- Níveis de dificuldade personalizáveis
- Desafios de timer para pressão realista

### Área Aberta
- Espaço para praticar habilidades de agentes
- Teste de lineups e interações de utilidades
- Explore mecânicas de movimento

**Dicas Estratégicas:**
- Comece cada sessão com 5-10 minutos de prática de mira
- Use o teste de tiro para aquecer antes das partidas
- Pratique lineups específicas para seus agentes principais
- Teste alcances de dano para armas não familiares
- Desenvolva memória muscular para cenários comuns de mira

**Visão Profissional:** Muitos jogadores profissionais começam sua prática diária com rotinas estruturadas no campo, focando em posicionamento de mira, flicking e tracking antes de passar para prática mais complexa.

## Modo Premier

**Visão Geral:** Premier é o sistema competitivo baseado em equipe de VALORANT, projetado para criar uma experiência de caminho para o profissionalismo para equipes organizadas.

**Estrutura:**
- Forme uma equipe de 5-7 jogadores
- Compita em partidas agendadas durante janelas específicas
- Progrida através de divisões baseado em desempenho
- Qualifique-se para torneios com prêmios reais

**Características Principais:**
- Baseado em equipe em vez de progressão individual
- Temporadas estruturadas com caminhos de qualificação
- Fase de escolha/banimento de mapa como o jogo profissional
- Progressão de chave no estilo torneio

**Quando Jogar:**
- Quando tiver uma equipe dedicada de 5+ jogadores
- Se estiver sério sobre VALORANT competitivo
- Para experimentar o mais próximo do jogo profissional
- Para competição estruturada de alto nível

**Dicas Estratégicas:**
- Desenvolva funções especializadas dentro da sua equipe
- Crie um pool de mapas com pontos fortes e banimentos
- Pratique estratégias e execuções estabelecidas
- Revise VODs de suas partidas para melhorar
- Estabeleça cronogramas de prática consistentes

**Visão Profissional:** O modo Premier é a experiência mais próxima do jogo profissional disponível para a maioria dos jogadores, com muitos profissionais atuais tendo sido descobertos através de seu desempenho em sistemas similares.

## Escolhendo o Modo Certo para Seus Objetivos

### Para Melhoria
1. **Pipeline Mata-Mata → Não-Competitivo → Competitivo**
   - Comece com mecânicas, construa para estratégia, teste no ranqueado

2. **Jogos Personalizados** para prática direcionada
   - Lineups, execuções, retakes e jogo situacional

3. **Jogo Rápido** para prática eficiente quando o tempo é limitado

### Para Jogo Casual
1. **Spike Rush** e modos rotativos para variedade
2. **Não-Competitivo** para a experiência completa sem pressão
3. **Jogos Personalizados** com amigos para diversão personalizada

### Para Crescimento Competitivo
1. **Competitivo** para desenvolvimento de habilidade individual
2. **Premier** para competição baseada em equipe
3. **Jogos Personalizados** (scrims) contra outras equipes

## Conclusão

Os diversos modos de jogo de VALORANT oferecem algo para cada tipo de jogador, do casualmente curioso ao competitivamente motivado. Cada modo proporciona oportunidades únicas para desenvolver diferentes aspectos da sua jogabilidade, seja você focando em mecânicas puras no Mata-Mata, coordenação de equipe no Não-Competitivo, ou mentalidade competitiva no Ranqueado.

Use este guia para escolher o modo mais apropriado para seus objetivos atuais e tempo disponível. Lembre-se que a melhoria vem da prática direcionada, não apenas acumulando tempo de jogo. Os melhores jogadores entendem quando usar cada modo como uma ferramenta em seu processo de desenvolvimento.

Seja você aspirando ao rank Radiante, procurando ingressar na cena profissional, ou simplesmente aproveitando a jogabilidade tática com amigos, os modos de jogo de VALORANT fornecem a estrutura perfeita para sua jornada pessoal. Boa sorte, e que seus tiros atinjam o alvo.', 'Other');

-- Guia para armas
INSERT INTO guide (user_id, title, content, guide_type) VALUES
(1, 'VALORANT: Guia Completo de Armas', '# VALORANT: Guia Completo de Armas

Dominar o sistema de tiro é a base do sucesso em VALORANT. Embora as habilidades dos agentes adicionem profundidade e opções táticas, vencer duelos e garantir eliminações depende, em última análise, de suas mecânicas de tiro. Este guia abrangente explorará todos os aspectos do sistema de armas de VALORANT, desde mecânicas básicas até técnicas avançadas, ajudando você a desenvolver a consistência e precisão necessárias para dominar suas partidas.

## Entendendo as Mecânicas de Tiro de VALORANT

O sistema de tiro de VALORANT combina elementos de jogos de tiro táticos como Counter-Strike com suas próprias características únicas. Antes de mergulhar em armas específicas e técnicas, é essencial entender as mecânicas centrais que governam o tiro no jogo.

### Os Fundamentos

#### Movimento e Precisão

O conceito mais importante no sistema de tiro de VALORANT é a relação entre movimento e precisão:

1. **Parado = Máxima Precisão**: Quando completamente estacionário, sua arma estará em sua precisão máxima.

2. **Movendo = Precisão Reduzida**: Qualquer movimento (caminhando, correndo, pulando) reduz drasticamente a precisão, criando um grande padrão de dispersão.

3. **Contra-Strafing**: Pressionar a tecla de movimento oposta antes de atirar para parar rapidamente e alcançar precisão.

4. **Tiro Agachado**: Agachar melhora ligeiramente a precisão e reduz o recuo, mas torna você um alvo mais estacionário.

#### Padrões de Recuo

Diferente de alguns jogos de tiro com padrões de recuo fixos, VALORANT usa um sistema de imprecisão crescente:

1. **Primeiros Tiros**: Balas iniciais seguem um padrão um tanto previsível (geralmente para cima).

2. **Fogo Sustentado**: Sprays prolongados se tornam cada vez mais aleatórios e difíceis de controlar.

3. **Reset de Recuo**: Após parar de atirar, as armas requerem um breve momento para resetar para precisão total.

4. **Transferência de Spray**: Mover sua mira para um novo alvo no meio do spray requer ajuste significativo para o recuo.

#### Sistema de Dano

Entender como o dano funciona ajuda a tomar decisões informadas em combate:

1. **Hitboxes**: VALORANT apresenta hitboxes padrão com regiões de cabeça, corpo e pernas.

2. **Queda de Dano**: Armas causam menos dano a distâncias maiores.

3. **Penetração de Parede**: Armas têm diferentes valores de penetração (Baixa, Média, Alta) determinando sua capacidade de atirar através de objetos.

4. **Armadura**: Armadura pesada (50 pontos de escudo) reduz o dano em aproximadamente 66%.

## Categorias de Armas e Seleção

VALORANT apresenta diversas categorias de armas, cada uma com características únicas, pontos de preço e casos de uso ideais.

### Armas Secundárias (Pistolas)

Armas secundárias servem como suas armas iniciais e opções econômicas durante rodadas de economia.

#### Classic (Grátis)
- **Características**: Modo de rajada de três tiros no disparo alternativo, boa precisão no primeiro tiro
- **Dano**: 78 cabeça/26 corpo (0-30m)
- **Melhor Uso**: Como pistola padrão em rodadas de pistola ou quando economizando
- **Dicas**: Use o disparo primário para longa distância, modo de rajada para encontros próximos

#### Shorty (300 Créditos)
- **Características**: Pistola shotgun de curto alcance com apenas dois cartuchos
- **Dano**: 24 dano por pellet (12 pellets)
- **Melhor Uso**: Ângulos fechados, especialmente quando jogando economicamente
- **Dicas**: Deve ser usada a distâncias extremamente curtas para ser efetiva; jogue em cantos e espaços apertados

#### Frenzy (450 Créditos)
- **Características**: Pistola totalmente automática com alta cadência de tiro
- **Dano**: 78 cabeça/26 corpo (0-20m)
- **Melhor Uso**: Engajamentos de curta distância em rodadas de pistola ou econômicas
- **Dicas**: Mire na altura da cabeça e controle o padrão de recuo selvagem; use rajadas a médias distâncias

#### Ghost (500 Créditos)
- **Características**: Pistola silenciada com alta precisão e cadência de tiro média
- **Dano**: 105 cabeça/30 corpo (0-30m)
- **Melhor Uso**: Rodadas de pistola quando mirando em headshots
- **Dicas**: Tem excelente precisão no primeiro tiro; pode matar com um tiro na cabeça oponentes sem armadura

#### Sheriff (800 Créditos)
- **Características**: Revólver de alto dano, baixa cadência de tiro
- **Dano**: 159 cabeça/55 corpo (0-30m)
- **Melhor Uso**: Rodadas econômicas contra oponentes com armadura
- **Dicas**: Pode matar com um tiro na cabeça inimigos com armadura pesada dentro de 30m; requer mira precisa

### SMGs

SMGs oferecem opções de custo-benefício para rodadas de compra forçada ou após vencer rodadas de pistola.

#### Stinger (1.100 Créditos)
- **Características**: SMG de alta cadência de tiro com dano moderado
- **Dano**: 67 cabeça/27 corpo (0-20m)
- **Melhor Uso**: Compras forçadas de curta a média distância ou rodadas anti-eco
- **Dicas**: Efetiva no modo de disparo em rajada a média distância; mortal em automático de perto

#### Spectre (1.600 Créditos)
- **Características**: SMG silenciada com boa precisão e recuo controlável
- **Dano**: 78 cabeça/26 corpo (0-20m)
- **Melhor Uso**: Segundas rodadas após vencer a pistola ou cenários de meia compra
- **Dicas**: Flexível o suficiente para múltiplas distâncias; silenciador ajuda a esconder posição

### Shotguns

Shotguns se destacam em combate a curta distância, mas sofrem a distância.

#### Bucky (850 Créditos)
- **Características**: Shotgun de ação por bombeamento com modos de disparo primário e alternativo
- **Dano**: Até 40 dano por pellet (15 pellets)
- **Melhor Uso**: Ângulos fechados, especialmente em rodadas econômicas
- **Dicas**: Disparo primário para curta distância, disparo alternativo (clique direito) para engajamentos um pouco mais distantes

#### Judge (1.850 Créditos)
- **Características**: Shotgun automática com alta cadência de tiro
- **Dano**: Até 34 dano por pellet (12 pellets)
- **Melhor Uso**: Posições defensivas onde inimigos devem empurrar para curta distância
- **Dicas**: Excelente para limpar espaços apertados; posicione-se para forçar engajamentos próximos

### Rifles

Rifles formam a espinha dorsal das rodadas de compra completa, oferecendo o melhor equilíbrio de dano, alcance e precisão.

#### Bulldog (2.050 Créditos)
- **Características**: Rifle de disparo em rajada com precisão decente
- **Dano**: 115 cabeça/35 corpo (0-50m)
- **Melhor Uso**: Rodadas de compra leve ou quando economizando para uma Operator
- **Dicas**: Use mira (ADS) para rajadas de três tiros precisas a longas distâncias

#### Guardian (2.250 Créditos)
- **Características**: Rifle semi-automático de precisão com alto dano
- **Dano**: 195 cabeça/65 corpo (todas as distâncias)
- **Melhor Uso**: Engajamentos de longa distância ou por jogadores com mira precisa
- **Dicas**: Elimina com um tiro na cabeça a qualquer distância; disciplina de disparo único é essencial

#### Phantom (2.900 Créditos)
- **Características**: Rifle automático silenciado com maior cadência de tiro e traçadores menos visíveis
- **Dano**: 156 cabeça/39 corpo (0-15m), 140 cabeça/35 corpo (15-30m)
- **Melhor Uso**: Engajamentos de curta a média distância e segurar ângulos
- **Dicas**: Melhor para spray e disparo através de fumaças; silenciador esconde posição

#### Vandal (2.900 Créditos)
- **Características**: Rifle de alto dano com perfeita precisão no primeiro tiro
- **Dano**: 160 cabeça/40 corpo (todas as distâncias)
- **Melhor Uso**: Todas as distâncias, especialmente quando segurando ângulos longos
- **Dicas**: Pode matar com um tiro na cabeça a qualquer distância; requer mais controle de recuo que o Phantom

### Rifles de Precisão

Rifles de precisão oferecem opções poderosas de longa distância, mas requerem bom posicionamento e mira.

#### Marshal (950 Créditos)
- **Características**: Sniper leve de ferrolho com alta mobilidade
- **Dano**: 202 cabeça/101 corpo (todas as distâncias)
- **Melhor Uso**: Rodadas econômicas ou quando segurando ângulos longos economicamente
- **Dicas**: Pode matar com um tiro na cabeça a qualquer distância; tempo de escopo rápido

#### Outlaw (2.400 Créditos)
- **Características**: Rifle de precisão de cano duplo com dois tiros rápidos
- **Dano**: 238 cabeça/140 corpo (todas as distâncias)
- **Melhor Uso**: Sniping agressivo de média distância, especialmente em rodadas econômicas
- **Dicas**: Dois tiros rápidos permitem eliminações corpo+corpo; mais perdoador que a Operator

#### Operator (4.700 Créditos)
- **Características**: Rifle de precisão de ferrolho de alta potência
- **Dano**: 255 cabeça/150 corpo (todas as distâncias)
- **Melhor Uso**: Segurando ângulos longos críticos e pontos de estrangulamento
- **Dicas**: Mata com um tiro no corpo independente da armadura; requer suporte da equipe

### Metralhadoras

Metralhadoras fornecem capacidades de fogo sustentado para cenários específicos.

#### Ares (1.600 Créditos)
- **Características**: Metralhadora leve com precisão que melhora durante fogo sustentado
- **Dano**: 75 cabeça/30 corpo (0-30m)
- **Melhor Uso**: Disparando através de paredes ou fumaças, segurando pontos de estrangulamento
- **Dicas**: Fica mais precisa quanto mais tempo você atira; boa penetração de parede

#### Odin (3.200 Créditos)
- **Características**: Metralhadora pesada com alta cadência de tiro e penetração
- **Dano**: 95 cabeça/38 corpo (0-30m)
- **Melhor Uso**: Suprimindo posições inimigas, atirando através de paredes em locais comuns
- **Dicas**: Use ADS para aumentar a cadência de tiro; excelente para negar áreas e disparar através de paredes

## Técnicas Avançadas de Tiro

Indo além das mecânicas básicas, estas técnicas ajudarão a elevar seu jogo ao próximo nível.

### Posicionamento de Mira

Talvez a habilidade de tiro mais crítica em VALORANT:

1. **Posicionamento na Altura da Cabeça**: Sempre mantenha sua mira na altura da cabeça de onde os inimigos provavelmente aparecerão.

2. **Pré-apontando Ângulos Comuns**: Antecipe posições comuns e pré-aponte estes locais antes de dar o peek.

3. **Limpando Cantos**: Limpe sistematicamente ângulos um por um em vez de se expor a múltiplas linhas de visão.

4. **Ajuste de Distância**: Considere diferentes alturas de cabeça quando inimigos estão em posições elevadas ou agachados.

### Técnicas de Peek

Como você dá peek em ângulos pode determinar o resultado de duelos antes mesmo que eles comecem:

1. **Shoulder Peek**: Expor brevemente seu ombro para bait de tiros antes de re-peek.

2. **Wide Peek**: Balançar amplamente ao redor de um canto para pegar inimigos segurando ângulos apertados.

3. **Jiggle Peek**: Strafar rapidamente para dentro e fora de cobertura para coletar informações com segurança.

4. **Crouch Peek**: Usar agachamento para dar peek sob obstáculos ou desalinhar a mira do inimigo.

5. **Posicionamento Fora do Ângulo**: Segurar posições ligeiramente afastadas de ângulos comuns para surpreender inimigos.

### Controle de Recuo

Dominando padrões de recuo para suas armas preferidas:

1. **Disparo em Rajada**: Atirando em rajadas controladas de 3-5 balas para melhor precisão.

2. **Controle de Spray**: Puxando para baixo (e eventualmente ligeiramente para esquerda ou direita) para contrariar o padrão de recuo para cima.

3. **Tap Firing**: Clicando para tiros únicos a distâncias maiores, permitindo que o recuo reset entre tiros.

4. **Transferência de Spray**: Controlando recuo enquanto movendo de um alvo para outro em um único spray.

### Mecânicas de Movimento

Combinando movimento com tiro para máxima efetividade:

1. **Contra-Strafing**: Pressionar a tecla de direção oposta para parar o movimento instantaneamente antes de atirar.

2. **Strafe Shooting**: Alternando movimento lateral entre tiros para manter imprevisibilidade enquanto preserva precisão.

3. **Jump Spotting**: Pular para coletar informações sem se comprometer totalmente com um peek.

4. **Timing de Agachamento**: Usar agachamento no meio do spray para desalinhar a mira inimiga e levemente apertar o padrão de dispersão.

## Estratégias de Tiro Situacionais

Diferentes cenários requerem adaptação de sua abordagem de tiro para resultados ótimos.

### Entry Fragging

Quando criando espaço e abrindo oportunidades para sua equipe:

1. **Pre-fire em Ângulos Comuns**: Atire em posições comuns de defesa antes de ver completamente os inimigos.

2. **Prontidão de Mira**: Mantenha sua mira na altura da cabeça onde defensores provavelmente estarão posicionados.

3. **Wide Peeks**: Use swings amplos para limpar múltiplos ângulos quando apoiado por companheiros de equipe.

4. **Coordenação de Utilidade**: Sincronize seus peeks com flashes e fumaças da equipe.

### Segurando Ângulos

Quando defendendo uma posição:

1. **Posicionamento Fora do Ângulo**: Segure posições inesperadas para pegar atacantes desprevenidos.

2. **Configuração de Crossfire**: Posicione-se com companheiros para criar múltiplos ângulos que atacantes devem checar.

3. **Jiggle Baiting**: Use peeks rápidos para bait utilidades ou tiros antes de se comprometer totalmente.

4. **Planejamento de Recuo**: Conheça suas posições de recuo se for sobrecarregado.

### Trocando Eliminações

Trabalhando com companheiros para garantir trocas favoráveis:

1. **Espaçamento**: Mantenha distância apropriada de companheiros para evitar que ambos sejam mortos pelo mesmo spray.

2. **Seguimento Imediato**: Troque rapidamente quando um companheiro cai para capitalizar no reload inimigo ou reposicionamento.

3. **Posicionamento de Mira**: Mantenha sua mira pronta onde o inimigo apareceu após matar seu companheiro.

4. **Uso de Utilidade**: Use flashes ou outras habilidades para criar vantagens ao trocar.

### Situações Pós-Planta

Defendendo o spike após plantar:

1. **Estabelecimento de Crossfire**: Configure posições que se cobrem e forçam engajamentos difíceis.

2. **Gerenciamento de Tempo**: Entre em combate apenas quando necessário; o tempo está ao seu lado.

3. **Disciplina de Som**: Minimize sons de movimento para esconder sua posição.

4. **Spray Através de Fumaça**: Use dicas sonoras para disparar através de fumaças quando sons de desarme são ouvidos.

## Domínio Específico de Armas

### Análise Vandal vs. Phantom

O debate eterno merece atenção especial:

**Vantagens Vandal**:
- Headshot com um tiro a qualquer distância (160 dano)
- Perfeita precisão no primeiro tiro
- Números de dano mais previsíveis

**Desvantagens Vandal**:
- Recuo mais difícil de controlar
- Cadência de tiro mais lenta (9.75 tiros/seg)
- Traçadores visíveis revelam posição

**Quando Escolher Vandal**:
- Mapas com linhas de visão mais longas (Breeze, Icebox)
- Quando segurando ângulos longos
- Se sua mira está particularmente precisa naquele dia
- Quando one-taps são seu ponto forte

**Vantagens Phantom**:
- Padrão de recuo mais fácil
- Cadência de tiro mais rápida (11 tiros/seg)
- Sem traçadores ao atirar (silenciada)
- Recarga ligeiramente mais rápida

**Desvantagens Phantom**:
- Queda de dano (140 dano de headshot além de 15m)
- Ligeiramente menos precisão no primeiro tiro

**Quando Escolher Phantom**:
- Mapas com engajamentos mais próximos (Split, Bind)
- Quando jogando através ou ao redor de fumaças
- Para disparar através de paredes ou fumaças
- Quando segurando ângulos mais próximos

### Domínio da Operator

A sniper de alto risco, alta recompensa requer técnicas específicas:

1. **Posicionamento**: Segure ângulos onde você pode recuar após dar um tiro.

2. **Quick Scoping**: Pratique entrar em mira pouco antes de dar tiros em vez de segurar ângulos em mira.

3. **Gerenciamento de Movimento**: Nunca se mova enquanto atira; contra-strafe para parar completamente.

4. **Timing de Re-peek**: Evite dar re-peek no mesmo ângulo após errar um tiro.

5. **Coordenação de Suporte**: Comunique-se com companheiros para receber utilidades de suporte.

6. **Planejamento Econômico**: Planeje antecipadamente para compras de Operator e economize de acordo.

## Desenvolvendo uma Rotina de Prática

Melhoria consistente requer prática estruturada focada em habilidades específicas.

### O Campo de Treinamento

Utilize o campo de treinamento de VALORANT para aquecimento mecânico:

1. **Prática com Bots**: Comece com bots estacionários, depois médios, depois difíceis.

2. **Prática de Strafe**: Pratique contra-strafing e atirando enquanto se move entre alvos.

3. **Treino de Flick**: Trabalhe em aquisição rápida de alvo e tiros de flick.

4. **Controle de Spray**: Pratique controlar padrões de recuo em alvos na parede.

5. **Familiaridade com Armas**: Alterne entre diferentes armas para manter versatilidade.

### Mata-Mata

Use mata-mata para aplicação prática contra jogadores reais:

1. **Treino Focado**: Pratique habilidades específicas (apenas headshots, armas específicas, etc.).

2. **Som Desligado**: Às vezes jogue sem som para focar puramente no posicionamento de mira.

3. **Strafe Shooting**: Trabalhe em movimento entre tiros contra oponentes imprevisíveis.

4. **Limpeza de Ângulos**: Pratique limpar sistematicamente ângulos enquanto move-se pelo mapa.

### Revisão de VOD

Grave e analise sua jogabilidade para melhoria:

1. **Análise de Duelo Perdido**: Revise cada combate perdido para identificar erros.

2. **Avaliação de Mira**: Verifique se seu posicionamento de mira estava consistente durante todo o jogo.

3. **Padrões de Movimento**: Analise se você está strafing efetivamente ou se movendo enquanto atira.

4. **Revisão de Posicionamento**: Determine se você entrou em engajamentos favoráveis ou se colocou em desvantagem.

## Solucionando Problemas Comuns

### Mira Inconsistente

Se sua mira parece inconsistente de dia para dia:

1. **Aquecimento Consistente**: Desenvolva e siga uma rotina de aquecimento pré-jogo.

2. **Verificação de Sensibilidade**: Garanta que sua sensibilidade não mudou e sua configuração é consistente.

3. **Reset Mental**: Faça pequenas pausas entre jogos se sentir sua mira deteriorando.

4. **Foco nos Fundamentos**: Retorne aos básicos como posicionamento de mira quando estiver com dificuldades.

### Perdendo Duelos Apesar de Boa Mira

Se você está perdendo combates apesar de sentir que sua mira está boa:

1. **Avaliação de Posicionamento**: Verifique se você está entrando em engajamentos desfavoráveis.

2. **Técnica de Peek**: Analise como você está dando peek em ângulos e se você está sendo muito previsível.

3. **Movimento Durante Tiro**: Garanta que você está completamente parado antes de atirar.

4. **Posicionamento de Mira**: Verifique se você está mirando na altura da cabeça consistentemente.

### Problemas de Controle de Spray

Se seus sprays parecem erráticos e incontroláveis:

1. **Timing de Puxar para Baixo**: Pratique o timing de quando começar a puxar para baixo durante um spray.

2. **Disciplina de Rajada**: Considere usar rajadas mais curtas em vez de sprays completos.

3. **Ajuste de Distância**: Reconheça diferentes necessidades de controle de recuo em várias distâncias.

4. **Seleção de Arma**: Escolha armas com padrões de recuo mais fáceis enquanto desenvolve controle.

## Conclusão

Dominar o sistema de tiro em VALORANT é uma jornada contínua que combina habilidade mecânica, conhecimento de jogo e consciência situacional. Enquanto habilidades de agentes criam profundidade tática, suas mecânicas fundamentais de tiro frequentemente determinarão o resultado de encontros cruciais.

Concentre-se em desenvolver fundamentos fortes antes de se preocupar com técnicas avançadas. Posicionamento de mira consistente, mecânicas de movimento adequadas e familiaridade com armas fornecerão uma base sólida para melhoria. À medida que estes fundamentos se tornam segunda natureza, incorpore gradualmente técnicas mais avançadas em sua jogabilidade.

Lembre-se que a melhoria vem com prática deliberada. Identifique fraquezas específicas em seu jogo de tiro e crie rotinas de prática direcionadas para abordá-las. Revise sua jogabilidade criticamente e seja honesto sobre áreas que precisam de melhoria.

Aplicando os princípios e técnicas descritos neste guia, você desenvolverá a consistência de tiro necessária para complementar sua tomada de decisão tática, tornando-se, em última análise, um jogador de VALORANT mais completo e perigoso. Boa sorte no campo de batalha, e que seus tiros encontrem seu alvo.', 'Weapon');

-- Brimstone
INSERT INTO guide (user_id, title, content, guide_type) VALUES 
(1, 'VALORANT: Guia Completo do Brimstone', '# VALORANT: Guia Completo do Brimstone

## Visão Geral

Brimstone é um dos Controladores originais de VALORANT, conhecido por seu conjunto de habilidades versátil e fácil de dominar. Como comandante da organização VALORANT e seu membro mais antigo, Brimstone traz uma abordagem tática e estratégica ao campo de batalha. Seu arsenal orbital proporciona à sua equipe vantagens significativas, tanto na ofensiva quanto na defensiva, tornando-o uma escolha confiável em qualquer composição.

Originário dos Estados Unidos, Liam "Brimstone" Byrne tem um longo histórico militar e de liderança. Sua experiência anterior inclui trabalhos como bombeiro no Departamento de Bombeiros de Baltimore e como soldado liderando uma equipe de forças especiais conhecida como "Ragged Ravens". Sua dedicação à equipe e sua recusa em deixar um companheiro para trás definem sua personalidade.

Brimstone é extremamente eficaz para controlar o ritmo do jogo, obstruir a visão dos inimigos e criar espaço para sua equipe. Suas habilidades o tornam particularmente poderoso em situações pós-planta e na execução de estratégias coordenadas.

## Habilidades

### Sinalizador Estimulante (E) - 100 Créditos

**Descrição:** Brimstone lança instantaneamente um sinalizador estimulante no chão. Ao aterrissar, cria um campo que concede aos jogadores dentro da área um Estimulante de Combate e um Aumento de Velocidade.

**Efeitos:**
- Aumenta a taxa de disparo em 15%
- Aumenta a velocidade de movimento em 15%
- Aumenta a velocidade de recarga/equipamento em 10%
- Acelera a recuperação de mira em 10%
- O campo não pode ser destruído

**Dicas de Uso:**
- Lance o sinalizador antes de entrar em um site para dar vantagem a toda sua equipe
- Use para contra-atacar rushes inimigos
- Coloque atrás de cobertura para que sua equipe possa avançar e recuar com o buff
- Você ganha assistências quando aliados eliminam inimigos sob o efeito do Sinalizador
- Combine com execuções coordenadas de sua equipe
- Não esqueça desta habilidade no calor da batalha - muitos jogadores a deixam sem usar

### Incendiário (Q) - 250 Créditos

**Descrição:** Brimstone equipa um lançador de granadas incendiárias. Ao disparar, lança uma granada que detona ao tocar o solo, criando uma zona de fogo persistente que causa dano a jogadores na área.

**Características:**
- Duração de 7 segundos
- Cause dano alto ao longo do tempo
- Pode ser usado através de paredes
- Pode ser lançado em lineups precisas

**Dicas de Uso:**
- Excelente para situações pós-planta para negar o desarme da Spike
- Use para limpar cantos e forçar inimigos a saírem de posições
- Aprenda lineups para locais comuns de planta para usar de posições seguras
- Combine com o Ultimate para criar uma zona de negação mais longa
- Use para controlar corredores apertados durante defesas
- Ideal para retardar pushes inimigos

### Fumaça Celeste (C) - Habilidade Assinatura (1 carga gratuita, cargas adicionais por 100 créditos)

**Descrição:** Brimstone equipa um mapa tático. Ao disparar, marca locais onde suas nuvens de fumaça aterrizarão. O disparo alternativo confirma, lançando nuvens de fumaça de longa duração que bloqueiam a visão na área selecionada.

**Características:**
- As fumaças duram 19,25 segundos (as mais longas do jogo)
- Pode lançar até 3 fumaças simultaneamente
- Cobertura ampla
- Alcance limitado ao centro do mapa tático
- Deixa Brimstone vulnerável durante a seleção

**Dicas de Uso:**
- Use para bloquear linhas de visão críticas durante execuções de site
- Posicione fumaças nas bordas de paredes para evitar que inimigos tenham cobertura adicional
- Reserve uma fumaça para situações pós-planta quando possível
- Cronometragem é crucial - lembre-se de quando suas fumaças expirarão
- Posicione-se centralmente no mapa quando defender para maximizar a cobertura
- Use fumaças para feints em um site enquanto ataca outro
- Combine com utilidades de aliados para execuções eficientes

### Ataque Orbital (X) - 7 Pontos de Ultimate

**Descrição:** Brimstone equipa um mapa tático. Ao disparar, lança um ataque orbital laser persistente no local selecionado, causando alto dano ao longo do tempo aos jogadores capturados na área.

**Características:**
- Causa dano massivo na área selecionada
- Bloqueia visão dentro e fora da área
- Tem um breve período de preparação antes de disparar
- Marcador vermelho visível para inimigos
- Destrói utilidades e objetos na área

**Dicas de Uso:**
- Excelente para situações pós-planta para evitar o desarme
- Use para limpar posições defensivas difíceis
- Combine com Fumaça Celeste e Incendiário para criar zonas letais
- Ideal para negar áreas durante pushes inimigos
- Use em conjunto com utilidades de controle de multidão de aliados
- Em situações críticas, pode ser usado para forçar inimigos a sair de cobertura

## Estratégias de Jogo

### Como Atacante

1. **Execuções de Site:**
   - Use todas as três fumaças para cobrir ângulos críticos de defesa
   - Lance o Sinalizador Estimulante antes de entrar no site para vantagem em combate
   - Comunique-se com a equipe para coordenar utilidades
   - Mantenha-se próximo aos aliados para maximizar a eficiência das suas habilidades

2. **Controle de Mapa:**
   - Use fumaças para ganhar controle de áreas médias do mapa
   - Combine com iniciadores para limpar posições defensivas
   - Mantenha controle de informações bloqueando linhas de visão de operadores inimigos

3. **Pós-Planta:**
   - Aprenda lineups de Incendiário para locais comuns de planta
   - Reserve o Ultimate para negar desarmes
   - Use táticas de empilhamento - Ultimate seguido por Incendiário para máxima negação
   - Posicione-se em locais seguros para lançar utilidades à distância

### Como Defensor

1. **Defesa de Site:**
   - Posicione-se centralmente para maximizar o alcance das fumaças
   - Use fumaças para bloquear entradas principais durante pushes inimigos
   - Lance Incendiário em corredores apertados para retardar avanços
   - Coloque o Sinalizador Estimulante para ajudar companheiros de equipe durante retakes

2. **Retakes:**
   - Use fumaças para bloquear posições pós-planta comuns
   - Coordene com a equipe para entrar no site com o buff do Sinalizador
   - Use o Ultimate para limpar áreas onde a Spike está plantada
   - Conserve pelo menos uma fumaça para situações de retake

## Mapas Favoráveis

Brimstone é particularmente eficaz nos seguintes mapas:

### Bind
- Excelente para controle de áreas com seus três conjuntos de fumaças
- Lineups eficazes para ambos os sites
- Corredores estreitos ideais para Incendiário e Ataque Orbital

### Fracture
- Controle eficaz sobre áreas centrais
- Pode cobrir múltiplas entradas simultaneamente com fumaças
- Ataque Orbital eficaz em áreas confinadas do mapa

### Split
- Excelente para bloquear linhas de visão em corredores estreitos
- Lineups de Incendiário poderosas para sites
- Sinalizador Estimulante eficaz em rampas e áreas de entrada

### Haven
- Pode controlar múltiplas áreas com três fumaças
- Posicionamento central permite cobrir mais áreas do mapa
- Eficaz para execuções rápidas e retakes

## Composições de Equipe Eficazes

Brimstone funciona bem com:

**Iniciadores (Sova, Fade, KAY/O):**
- Combinam bem para execuções coordenadas
- Iniciadores podem revelar inimigos enquanto Brimstone bloqueia linhas de visão

**Duelistas (Phoenix, Raze, Jett):**
- Criam espaço enquanto protegidos pelas fumaças de Brimstone
- Beneficiam-se significativamente do Sinalizador Estimulante durante duelos

**Sentinelas (Killjoy, Cypher):**
- Adicionam segurança para áreas controladas por Brimstone
- Fornecem informações para uso mais eficiente das utilidades

**Outros Controladores (Viper):**
- Oferecem cobertura adicional para execuções complexas
- Complementam as áreas de controle de mapa

## Desafios e Limitações

1. **Vulnerabilidade Durante Uso de Habilidades:**
   - Vulnerável enquanto usa o mapa tático para fumaças e Ultimate
   - Requer posicionamento seguro antes de usar habilidades

2. **Limitações de Alcance:**
   - Fumaça Celeste tem alcance limitado, exigindo proximidade
   - Menos eficaz em mapas muito grandes com múltiplas áreas

3. **Contadores Específicos:**
   - KAY/O pode suprimir suas habilidades
   - Agentes com alta mobilidade podem escapar do Ataque Orbital
   - Vulnerável a flanqueadores durante o uso de lineups

## Dicas Avançadas

1. **Lineups Essenciais:**
   - Dedique tempo para aprender lineups de Incendiário para todos os sites
   - Pratique fumaças one-way para vantagem defensiva

2. **Gestão de Tempo de Fumaça:**
   - Acompanhe o tempo de duração das fumaças (aproximadamente 19 segundos)
   - Calcule o tempo para refumar áreas críticas

3. **Comunicação de Equipe:**
   - Comunique suas intenções de fumar áreas específicas
   - Coordene utilidades com sua equipe para máxima eficiência

4. **Posicionamento Estratégico:**
   - Jogue de posições onde você pode usar linearmente seu Incendiário
   - Mantenha-se próximo ao centro do mapa quando defender para maximizar a cobertura de fumaça

5. **Usos Criativos do Sinalizador Estimulante:**
   - Coloque-o em áreas onde possa baitar inimigos a esperarem pelo término do efeito
   - Use em combinação com rushes para surpreender defesas

## Conclusão

Brimstone oferece um conjunto de habilidades versátil e fácil de aprender que o torna uma escolha excelente tanto para iniciantes quanto para jogadores experientes. Sua capacidade de controlar o ritmo do jogo, negar áreas e apoiar a equipe faz dele um controlador extremamente valioso em qualquer composição.

Dominando o posicionamento estratégico de fumaças, aprendendo lineups eficazes e coordenando com sua equipe, você pode transformar Brimstone em um agente formidável que controla o campo de batalha e garante vantagens decisivas para seu time. Seja planejando execuções de site precisas ou defendendo posições estratégicas, Brimstone oferece as ferramentas necessárias para o sucesso.

Lembre-se de que a comunicação é essencial ao jogar como controlador - suas decisões influenciam diretamente o desempenho de toda a equipe. Com prática e compreensão das mecânicas de Brimstone, você estará pronto para liderar seu time à vitória, comandando o campo de batalha como o verdadeiro comandante que Brimstone é.', 'Agent');

-- Phoenix
INSERT INTO guide (user_id, title, content, guide_type) VALUES 
(1, 'VALORANT: Guia Completo do Phoenix', '# VALORANT: Guia Completo do Phoenix

## Visão Geral

Phoenix é um Duelista carismático e explosivo originário do Reino Unido, projetado para criar espaço para sua equipe através de habilidades agressivas e auto-sustentáveis. Com um estilo de jogo baseado em elemento fogo, Phoenix é um agente que literalmente ilumina o campo de batalha.

Sua capacidade de se curar após usar suas habilidades incendiárias faz dele um agente auto-suficiente, ideal para jogadores que preferem um estilo agressivo e independente. Phoenix pode controlar zonas, cegar inimigos e até mesmo ganhar uma segunda chance com seu ultimate - uma combinação que o torna excelente para entradas e duelos.

## Habilidades

### Bola Curva (Q) - 250 Créditos

**Descrição:** Equipa um orbe flamejante que curva para a esquerda ou direita. Dispare para curvar o orbe para a esquerda, e use o disparo alternativo para curvar para a direita. O orbe detona após um breve período, cegando qualquer jogador que estiver olhando para ele.

**Características:**
- Pode curvar ao redor de cantos e paredes
- Duração do flash: aproximadamente 1,1 segundos
- Pode ser usado para cegar a si mesmo se mal posicionado

**Dicas de Uso:**
- Use para cegar inimigos ao entrar em sites ou verificar cantos
- Curve o flash ao redor de obstáculos para surpreender inimigos
- Coordene com sua equipe para maximizar o valor do flash
- Pratique diferentes curvas para dominar ângulos específicos
- Combina bem com sua Muralha de Fogo para entradas poderosas

### Mãos Quentes (E) - 150 Créditos

**Descrição:** Equipa uma bola de fogo que, ao ser disparada, explode após um breve atraso ou ao impactar o solo. A explosão cria uma zona de fogo que causa dano aos inimigos, mas cura Phoenix quando ele está dentro dela.

**Características:**
- Duração de 4 segundos
- Cura Phoenix quando está na área de efeito
- Causa dano aos inimigos
- Pode ser arremessada a média distância

**Dicas de Uso:**
- Use para curar-se quando estiver com vida baixa
- Bloqueie cantos estreitos e corredores durante defesas
- Force inimigos a saírem de posições ou sofrerem dano
- Combine com outras habilidades para criar situações win-win
- Pode ser usada para negar defusas em situações pós-planta

### Muralha de Fogo (C) - 200 Créditos

**Descrição:** Equipa um muro de fogo. Dispare para criar uma linha de chamas que avança, criando uma parede que bloqueia a visão e causa dano a inimigos que a atravessarem. Phoenix pode atravessar sua própria parede sem dano e será curado enquanto passa por ela.

**Características:**
- Dura aproximadamente 8 segundos
- Cura Phoenix ao passar através dela
- Bloqueia visão como uma fumaça
- Causa dano a inimigos que a atravessam

**Dicas de Uso:**
- Use para bloquear linhas de visão durante execuções
- Divida sites para facilitar a limpeza de áreas
- Atravesse sua própria parede para ganhar cura durante engajamentos
- Bloqueie corredores estreitos durante defesas
- Use criativamente para isolar inimigos em encontros 1v1

### Renascimento (X) - 6 Pontos de Ultimate

**Descrição:** Phoenix coloca um marcador em sua localização atual. Enquanto a habilidade estiver ativa, morrer ou permitir que a duração expire fará com que Phoenix retorne ao local marcado com vida completa.

**Características:**
- Duração de 10 segundos
- Retorna com vida completa ao local marcado
- Permite jogadas agressivas com risco reduzido
- Corpo da réplica desaparece quando termina

**Dicas de Uso:**
- Use para obter informações em áreas perigosas
- Perfeito para entradas agressivas em sites
- Útil para garantir eliminações de operadores inimigos
- Valioso em situações de clutch para ganhar informações
- Posicione o marcador em local seguro, não exposto a inimigos
- Comunique à equipe quando usar para coordenar pushes

## Estratégias de Jogo

### Como Atacante

1. **Entradas em Site:**
   - Use Bola Curva para cegar defensores em posições comuns
   - Siga com Muralha de Fogo para dividir o site e bloquear ângulos
   - Utilize Renascimento para entradas de alto risco/alta recompensa
   - Comunique com sua equipe para seguir quando criar espaço

2. **Duelos:**
   - Aproveite sua capacidade de cura para tomar duelos múltiplos
   - Use Mãos Quentes para curar entre duelos
   - Combine flash e peeks para vantagem em duelos

3. **Pós-Planta:**
   - Use Mãos Quentes para negar defusas
   - Coloque Muralha de Fogo para dividir site e isolar retakes
   - Utilize Renascimento para jogar agressivamente e ganhar tempo

### Como Defensor

1. **Defesa de Site:**
   - Use Muralha de Fogo para atrasar pushes inimigos
   - Coloque Mãos Quentes em corredores estreitos
   - Utilize Bola Curva para cegar inimigos durante rushes

2. **Retakes:**
   - Use Bola Curva para cegar inimigos em posições pós-planta
   - Divida o site com Muralha de Fogo para facilitar a limpeza
   - Utilize Renascimento para obter informações antes de um retake completo
   - Coordene com a equipe para maximizar o valor dos seus utilitários

## Mapas Favoráveis

Phoenix é particularmente eficaz nos seguintes mapas:

### Haven
- Múltiplos corredores ideais para Muralha de Fogo
- Sites compactos onde Bola Curva é extremamente eficaz
- Bons pontos para utilizar Renascimento em áreas como Long C e A Lobby

### Bind
- Áreas fechadas onde Bola Curva é altamente eficaz
- Corredores estreitos para Muralha de Fogo
- Teleportes oferecem oportunidades criativas para Renascimento

### Ascent
- Áreas abertas onde a mobilidade de Phoenix brilha
- Bons ângulos para curvar flashes
- Posições defensivas que podem ser efetivamente negadas com Mãos Quentes

## Composições de Equipe Eficazes

Phoenix funciona bem com:

**Controladores (Brimstone, Omen):**
- Fornecem cobertura de fumaça para complementar suas entradas
- As habilidades de Phoenix podem ser usadas após as fumaças para limpeza eficiente

**Sentinelas (Killjoy, Cypher):**
- Garantem segurança para flancos quando Phoenix está criando espaço
- Fornecem informações para usar suas habilidades de maneira mais eficaz

**Iniciadores (Sova, Breach):**
- Oferecem informações e utilitários para complementar entradas
- Podem debilitar inimigos antes de Phoenix entrar com flashes

**Outros Duelistas (Jett, Raze):**
- Criam equipes de dupla entrada muito poderosas
- Oferecem mobilidade complementar à sustentabilidade de Phoenix

## Desafios e Limitações

1. **Auto-Cegueira:**
   - Possibilidade de cegar a si mesmo com Bola Curva se mal utilizada
   - Requer prática para dominar ângulos de flash

2. **Habilidades Previsíveis:**
   - Inimigos experientes podem antecipar flashes e paredes
   - Limitado por terreno para usos eficazes da Muralha de Fogo

3. **Alcance Limitado:**
   - A maioria das habilidades tem alcance médio
   - Menos eficaz em mapas muito abertos

4. **Vulnerabilidade Durante Ultimate:**
   - Corpo estacionário durante Renascimento pode ser descoberto e eliminado
   - Timing crucial para maximizar o valor do ultimate

## Dicas Avançadas

1. **Combo de Habilidades:**
   - Use Muralha de Fogo seguida de Bola Curva através da parede para surpreender inimigos
   - Combine Mãos Quentes com posicionamento agressivo para forçar inimigos a engajar em seu termo

2. **Gerenciamento de Tempo com Ultimate:**
   - Aprenda a maximizar os 10 segundos do Renascimento
   - Use os últimos segundos para jogadas agressivas, já que voltará de qualquer forma

3. **Flash Criativo:**
   - Aprenda diferentes alturas e ângulos para curvar flashes
   - Use flashes "pop" (instantâneos) arremessando a curta distância para reações rápidas

4. **Economia de Cura:**
   - Não desperdice Mãos Quentes apenas para cura quando poderia ser útil para controle de área
   - Planeje a travessia da Muralha de Fogo para maximizar cura

5. **Jogo de Equipe:**
   - Comunique seu uso de Renascimento para que a equipe possa capitalizar na informação
   - Avise companheiros sobre uso de Muralha de Fogo para evitar danos a aliados

## Conclusão

Phoenix é um agente versátil e autossuficiente, perfeito para jogadores que gostam de um estilo agressivo e independente. Sua capacidade de cura, combinada com utilitários de flash e controle de área, faz dele um excelente criador de espaço e duelista. 

Para dominar Phoenix, é necessário desenvolver um bom senso de timing e posicionamento, além de praticar bastante os ângulos de suas habilidades, especialmente a Bola Curva. A capacidade de tomar duelos favoráveis, criar espaço para a equipe e se recuperar entre encontros é o que define um bom jogador de Phoenix.

Com prática e comunicação eficaz com a equipe, Phoenix pode ser uma força dominante no campo de batalha, iluminando o caminho para a vitória com seu estilo flamejante e confiante.', 'Agent');

-- Sage
INSERT INTO guide (user_id, title, content, guide_type) VALUES 
(1, 'VALORANT: Guia Completo da Sage', '# VALORANT: Guia Completo da Sage

## Visão Geral

Sage é uma Sentinela originária da China, cuja função principal é fornecer suporte e cura para sua equipe, enquanto também controla áreas do mapa através de suas habilidades defensivas. Como a única verdadeira "curandeira" de VALORANT, Sage é uma presença inestimável em qualquer composição, capaz de reviver aliados caídos e criar barreiras para impedir o avanço inimigo.

Seu conjunto de habilidades a torna um baluarte de estabilidade para sua equipe, proporcionando segurança e força em qualquer lugar. Sage combina perfeitamente seu papel de suporte com a capacidade de negar avanços inimigos e retardar rushes, tornando-a uma agente extremamente versátil e valiosa tanto na defesa quanto no ataque.

## Habilidades

### Orbe de Lentidão (Q) - 200 Créditos

**Descrição:** Equipa um orbe de lentidão que é lançado e se rompe ao impactar o solo. O orbe cria um campo que desacelera jogadores que passam por ele, tornando-os mais vulneráveis.

**Características:**
- Duração do campo: aproximadamente 9 segundos
- Reduz drasticamente a velocidade e altura de pulo dos jogadores afetados
- Afeta tanto aliados quanto inimigos
- Emite som distinto quando jogadores entram no campo

**Dicas de Uso:**
- Use para atrasar rushes inimigos em corredores estreitos
- Lance em áreas de planta para dificultar pós-planta inimigo
- Combine com damageadores para facilitar eliminações em alvos lentos
- Utilize para cobrir retiradas ou rotações
- Lance sob inimigos durante combates para dar vantagem à sua equipe

### Orbe Curativo (E) - 100 Créditos

**Descrição:** Equipa um orbe curativo. Use com Disparo para curar um aliado ou em si mesma ao longo do tempo.

**Características:**
- Recupera 60 pontos de vida ao longo de poucos segundos
- Tem alcance médio quando usado em aliados
- Limitado a 2 cargas por rodada
- Não pode sobrecarregar a vida além do máximo (100 pontos)

**Dicas de Uso:**
- Priorize curar aliados com alta capacidade de combate (Duelistas, principalmente)
- Guarde pelo menos uma carga para momentos críticos da rodada
- Cure-se enquanto em cobertura entre engajamentos
- Comunique com sua equipe para maximizar o valor das curas
- Lembre-se que a cura é gradual, não instantânea

### Orbe de Barreira (C) - 400 Créditos

**Descrição:** Equipa um orbe de barreira. Dispare para posicionar uma parede sólida. Disparo alternativo rotaciona o indicador de direção.

**Características:**
- A barreira tem 800 pontos de vida
- Dura 40 segundos se não for destruída
- Muda de cor à medida que é danificada
- Bloqueia movimento e balas
- Pode ser posicionada em ângulos diversos

**Dicas de Uso:**
- Bloqueie corredores principais para retardar pushes
- Use para elevar a si mesma ou aliados a posições inesperadas
- Feche locais de planta para dificultar defusas
- Cubra aliados durante ressurreições arriscadas
- Bloqueie linhas de visão de snipers
- Rotacione a parede para cobertura máxima em diferentes situações

### Ressurreição (X) - 8 Pontos de Ultimate

**Descrição:** Equipa um orbe de ressurreição. Use com Disparo para escolher um aliado morto. Após um breve canal, o aliado é revivido com vida completa.

**Características:**
- Revive com vida completa (100 pontos)
- Exige linha de visão e proximidade ao aliado morto
- Canal de 3 segundos onde Sage fica vulnerável
- Um dos ultimates mais poderosos e impactantes do jogo

**Dicas de Uso:**
- Use em situações de vantagem numérica para ampliar a pressão
- Reviva aliados em posições seguras, não expostos a inimigos
- Priorize reviver jogadores com ultimates valiosos ou utilidades não usadas
- Considere reviver Duelistas que podem criar espaço novamente
- Comunique sua intenção de reviver para coordenar proteção
- Em situações críticas, use barreira para proteger-se durante a ressurreição

## Estratégias de Jogo

### Como Atacante

1. **Entrada em Sites:**
   - Use Orbe de Barreira para bloquear ângulos defensivos comuns
   - Apoie Duelistas com curas após entradas
   - Utilize Orbe de Lentidão para dividir defensores e dificultar retakes
   - Reserve Ressurreição para recuperar entradas caídas e manter vantagem numérica

2. **Controle de Mapa:**
   - Posicione-se para dar suporte a aliados que controlam áreas-chave
   - Use Orbe de Lentidão para negar áreas de rotação
   - Mantenha-se viva para maximizar o valor de suas habilidades de suporte

3. **Pós-Planta:**
   - Use Orbe de Barreira para bloquear linhas de defusa comuns
   - Posicione Orbe de Lentidão para atrasar retakes
   - Ressuscite aliados para manter vantagem numérica durante retakes inimigos

### Como Defensora

1. **Defesa de Site:**
   - Use Orbe de Barreira para bloquear entradas principais
   - Posicione Orbe de Lentidão para atrasar pushes
   - Mantenha-se em posições seguras para fornecer cura e suporte
   - Comunique-se para rotações eficientes

2. **Retakes:**
   - Use Orbe de Barreira para dividir sites durante retakes
   - Aplique Orbe de Lentidão para limitar movimentação inimiga
   - Ressuscite aliados caídos para igualar ou ganhar vantagem numérica
   - Forneça cura para aliados durante retakes prolongados

## Mapas Favoráveis

Sage é eficaz em quase todos os mapas, mas particularmente forte em:

### Split
- Áreas elevadas ideais para uso criativo da Barreira
- Corredores estreitos para uso eficiente de Orbe de Lentidão
- Múltiplas posições defensivas onde pode apoiar aliados com segurança

### Icebox
- Terreno vertical permite uso criativo da Barreira
- Áreas estreitas para efetivo controle com Orbe de Lentidão
- Muitas posições para ressurreições seguras durante retakes

### Haven
- Três sites para defender oferece oportunidades para rotações estratégicas
- Corredores estreitos ideais para Orbe de Barreira
- Bons pontos para aplicar Orbe de Lentidão em áreas de push

## Composições de Equipe Eficazes

Sage funciona bem com:

**Duelistas (Jett, Reyna, Phoenix):**
- Fornece cura após entradas agressivas
- Pode ressuscitar Duelistas para entradas adicionais
- Cria espaço com Barreira para complementar jogadas de Duelistas

**Controladores (Brimstone, Omen):**
- Combina controle de área com ferramentas defensivas
- Fumaças complementam barreiras para maior bloqueio de visão

**Iniciadores (Sova, Breach):**
- Fornece sustentabilidade para Iniciadores coletarem informações
- Combina bem com utilitários de iniciação para retakes eficientes

**Outras Sentinelas (Killjoy, Cypher):**
- Cria setups defensivos extremamente difíceis de quebrar
- Camadas múltiplas de controle de território

## Desafios e Limitações

1. **Mobilidade Limitada:**
   - Sem habilidades de movimento, depende de posicionamento convencional
   - Pode ser vulnerável a flanqueadores

2. **Valor como Alvo:**
   - Prioridade alta para eliminação pelos inimigos devido ao seu potencial de suporte
   - Pressão para permanecer viva para maximizar o valor da equipe

3. **Canal da Ressurreição:**
   - Vulnerável durante o processo de ressurreição
   - Requer coordenação da equipe para cobertura

4. **Habilidades Previsíveis:**
   - Inimigos experientes podem antecipar posicionamentos de Barreira
   - Orbe de Lentidão pode ser evitado com movimento adequado

## Dicas Avançadas

1. **Posicionamento de Barreira Criativo:**
   - Aprenda spots elevados em todos os mapas que a barreira pode alcançar
   - Use barreira em ângulos incomuns para surpreender inimigos
   - Pratique rotações rápidas de barreira para adaptação em tempo real

2. **Economia de Cura:**
   - Não cure imediatamente pequenos danos no início das rodadas
   - Priorize curas baseadas no impacto potencial do alvo (armas, utilidades disponíveis)

3. **Timing de Ressurreição:**
   - Ressuscite quando inimigos estão recuando ou recarregando
   - Use comunicação da equipe para tempos ideais de ressurreição
   - Às vezes é melhor não ressuscitar para evitar revelar sua posição

4. **Uso Off-Meta de Orbe de Lentidão:**
   - Lance em locais elevados para que caia silenciosamente em áreas inesperadas
   - Use para negar plantas de Spike em situações de retake
   - Aplique em sua própria posição quando sob pressão para dificultar pushes inimigos

5. **Gerenciamento de Barreira:**
   - Aprenda a temporizador da barreira e comece a se posicionar antes dela cair
   - Use o status de saúde da barreira (cor) para tomar decisões táticas

## Conclusão

Sage é uma agente fundamental em VALORANT, oferecendo uma combinação única de suporte e controle defensivo. Sua capacidade de curar, retardar avanços inimigos e até mesmo ressuscitar aliados caídos a torna um baluarte para qualquer equipe.

Dominar Sage requer uma mentalidade de suporte, mas também exige compreensão tática e bom senso de posicionamento. A diferença entre uma Sage mediana e uma excepcional geralmente está na tomada de decisões: saber quando curar, onde posicionar barreiras, e o momento certo para usar a ressurreição.

Lembre-se sempre que sua presença é vital para a equipe, e permanecer viva para utilizar suas habilidades deve ser uma prioridade. Com prática e desenvolvimento de jogo de equipe, Sage pode ser o pilar que sustenta sua equipe rumo à vitória, criando estabilidade e segurança mesmo nas situações mais caóticas.', 'Agent');

-- Sova
INSERT INTO guide (user_id, title, content, guide_type) VALUES 
(1, 'VALORANT: Guia Completo do Sova', '# VALORANT: Guia Completo do Sova

## Visão Geral

Sova é um Iniciador excepcional originário da Rússia, especializado em localizar e rastrear inimigos com seu arsenal de tecnologia de reconhecimento. Como um caçador nascido na tundra russa, Sova utiliza seu arco personalizado e habilidades de rastreamento para encontrar presas que pensam estar escondidas, tornando-o um pesadelo para oponentes que confiam em esconderijos e emboscadas.

Com suas flechas de revelação, drones de reconhecimento e um poderoso ultimate que atravessa paredes, Sova é o mestre da coleta de informações, proporcionando à sua equipe uma vantagem de conhecimento inigualável. Seu valor está em expor a posição dos inimigos, permitindo que sua equipe ataque com informações completas ou defenda com antecedência.

## Habilidades

### Flecha de Choque (Q) - 150 Créditos

**Descrição:** Equipa um arco com uma flecha de choque. Dispare para lançar a flecha que explode após impacto, causando dano aos inimigos próximos. Mantenha pressionado para aumentar o alcance da flecha. Use o disparo alternativo para adicionar até dois ricochetes à flecha.

**Características:**
- Até dois ricochetes possíveis
- Causа dano em área após explosão
- Pode ser carregada para maior distância
- Máximo de 2 cargas por rodada

**Dicas de Uso:**
- Use para limpar cantos comuns sem se expor
- Combine ricochetes para atingir posições escondidas
- Aprenda lineups para atingir locais específicos em cada mapa
- Use para interromper defusas da Spike em situações pós-planta
- Combina bem com informações do Drone ou Flecha Rastreadora

### Flecha Rastreadora (E) - 250 Créditos

**Descrição:** Equipa um arco com uma flecha de reconhecimento. Dispare para lançar a flecha que se ativa ao atingir uma superfície, revelando a localização de qualquer inimigo próximo. Os inimigos podem destruir a flecha. Mantenha pressionado para aumentar o alcance. Use o disparo alternativo para adicionar até dois ricochetes.

**Características:**
- Revela inimigos em um raio de ação
- Pode ser destruída por inimigos
- Permite até dois ricochetes
- Oferece pulsos de revelação por alguns segundos
- Máximo de 2 cargas por rodada

**Dicas de Uso:**
- Lance no início das rodadas para obter informações iniciais
- Use ricochetes para alcançar áreas difíceis
- Aprenda lineups para pontos específicos de cada site
- Varie locais de lançamento para manter inimigos em dúvida
- Comunique efetivamente as informações obtidas à equipe
- Combine com outras habilidades de iniciação da equipe

### Drone Coruja (C) - 400 Créditos

**Descrição:** Equipa um drone de reconhecimento. Dispare para enviar e controlar o drone. Enquanto controla o drone, dispare para atirar um dardo marcador que revela a localização do inimigo atingido.

**Características:**
- Duração de 10 segundos de voo
- Dardo marcador revela inimigos por alguns segundos
- Pode ser destruído por inimigos (40 pontos de vida)
- Fornece controle em primeira pessoa
- Limitado a 1 carga por rodada

**Dicas de Uso:**
- Use antes de entradas em site para reconhecimento
- Conserve altura quando possível para maximizar visibilidade
- Priorize marcar inimigos em posições críticas
- Utilize de maneira imprevisível para evitar ser destruído facilmente
- Comunique todas as informações obtidas para sua equipe
- Em situações críticas, use para verificar flancos ou áreas suspeitas

### Fúria do Caçador (X) - 8 Pontos de Ultimate

**Descrição:** Equipa um arco com três disparos de longo alcance que penetram paredes. A energia destes disparos pode revelar e causar dano a inimigos. Cada disparo causa dano e revela a localização do inimigo atingido.

**Características:**
- Penetra paredes e obstáculos
- Três disparos poderosos
- Cada acerto causa dano significativo e revela inimigos
- Raio de revelação ao redor do ponto de impacto
- Disparos podem ser ajustados entre cada tiro

**Dicas de Uso:**
- Use para limpar posições comuns de defesa durante execuções
- Ideal para situações pós-planta para negar defusas
- Utilize informações prévias para maximizar eficácia
- Ajuste seu ângulo após cada disparo baseado em informações obtidas
- Combine com habilidades de aliados que podem fixar inimigos em posição
- Eficaz para quebrar setups defensivos difíceis

## Estratégias de Jogo

### Como Atacante

1. **Preparação para Execuções:**
   - Use Flecha Rastreadora para coletar informações sobre defesas inimigas
   - Siga com Drone Coruja para confirmar posições e marcar defensores
   - Comunique todas as informações obtidas para sua equipe
   - Limpe cantos com Flecha de Choque baseado nas informações coletadas

2. **Execuções de Site:**
   - Utilize lineups pré-definidas para verificar posições defensivas comuns
   - Combine informações de Flecha Rastreadora com utilidades de aliados
   - Use Fúria do Caçador para limpar posições difíceis durante pushes
   - Posicione-se para apoiar entradas com informações em tempo real

3. **Pós-Planta:**
   - Utilize Flecha de Choque para negar defusas
   - Posicione Flecha Rastreadora para detectar retakes
   - Use Fúria do Caçador para eliminar defusadores através de paredes
   - Mantenha controle de informações para posicionar sua equipe adequadamente

### Como Defensor

1. **Defesa de Site:**
   - Use Flecha Rastreadora no início da rodada para detectar rushes
   - Posicione Drone Coruja para verificar áreas não cobertas
   - Comunique rotações baseadas em informações obtidas
   - Utilize Flecha de Choque para atrasar pushes em corredores

2. **Retakes:**
   - Recon áreas do site com Flecha Rastreadora antes do retake
   - Use Drone Coruja para informações detalhadas sobre posições inimigas
   - Limpe cantos com Flecha de Choque
   - Utilize Fúria do Caçador para eliminar inimigos em posições pós-planta comuns

## Mapas Favoráveis

Sova é particularmente eficaz nos seguintes mapas:

### Haven
- Múltiplas linhas de visão para Flechas Rastreadoras eficientes
- Drone Coruja extremamente valioso para verificar múltiplos sites
- Excelentes ângulos para Fúria do Caçador em retakes e defesas

### Ascent
- Layout aberto ideal para Flechas Rastreadoras
- Áreas críticas facilmente verificáveis com Drone Coruja
- Muitas superfícies para ricochetes eficazes
- Paredes penetráveis para uso potente da Fúria do Caçador

### Bind
- Boas superfícies para ricochetes de flechas
- Drone Coruja valioso para verificar teletransportes
- Excelentes lineups para situações pós-planta

### Icebox
- Verticidade oferece oportunidades criativas para Flechas Rastreadoras
- Drone Coruja eficaz para navegar níveis diferentes
- Fúria do Caçador altamente valioso devido às muitas coberturas

## Composições de Equipe Eficazes

Sova funciona bem com:

**Controladores (Brimstone, Omen, Astra):**
- Informações de Sova complementam as fumaças para execuções precisas
- Podem bloquear rotas de fuga após Sova revelar inimigos

**Duelistas (Jett, Raze, Reyna):**
- Podem capitalizar imediatamente nas informações fornecidas
- Criam espaço enquanto Sova coleta informações adicionais

**Sentinelas (Killjoy, Cypher):**
- Fornecem segurança para flancos enquanto Sova opera seu drone
- Informações combinadas criam consciência de mapa quase perfeita

**Outros Iniciadores (Breach, Skye):**
- Combinação de utilitários de informação cria execuções poderosas
- Podem fixar inimigos em posição para revelar com Sova

## Desafios e Limitações

1. **Curva de Aprendizado:**
   - Lineups de flechas requerem prática extensiva
   - Entender ângulos de ricochete demanda tempo e conhecimento de mapa

2. **Vulnerabilidade Durante Uso de Habilidades:**
   - Estacionário e vulnerável ao controlar o Drone Coruja
   - Posicionamento é crucial para uso eficaz e seguro das habilidades

3. **Dependência de Comunicação:**
   - Valor reduzido sem comunicação eficaz com a equipe
   - Requer equipe que capitalize nas informações fornecidas

4. **Contadores Específicos:**
   - KAY/O pode desativar suas habilidades
   - Equipes experientes podem antecipar e destruir utilidades

## Dicas Avançadas

1. **Lineups Double Shock:**
   - Aprenda a temporizar duas Flechas de Choque para atingir o mesmo local
   - Use para negar defusas em situações pós-planta críticas

2. **Reconhecimento Vocal com Drone:**
   - Comunique em tempo real enquanto opera o drone
   - Faça callouts claros sobre posições e movimentos inimigos

3. **Variações de Flechas Rastreadoras:**
   - Desenvolva múltiplas lineups para o mesmo local
   - Alterne entre diferentes pontos de lançamento para surpreender inimigos

4. **Fúria do Caçador Estratégica:**
   - Use em momentos críticos como defusas ou durante execuções
   - Aprenda ângulos comuns para maximizar cobertura de áreas importantes

5. **Economia de Utilidades:**
   - Nem sempre é necessário usar todas as cargas em cada rodada
   - Conserve utilidades para momentos decisivos da rodada

## Conclusão

Sova representa o pilar de informações em VALORANT, oferecendo um conjunto de habilidades focado em reconhecimento e dano através de obstáculos. Sua capacidade de revelar inimigos escondidos, marcar posições e causar dano em áreas de difícil acesso o torna um asset inestimável para qualquer composição de equipe.

Dominar Sova requer dedicação para aprender lineups específicas, entender ângulos de ricochete e desenvolver um bom senso de timing para uso de habilidades. A comunicação é fundamental - as informações coletadas por Sova só têm valor real quando compartilhadas efetivamente com a equipe.

Para jogadores que gostam de um estilo mais tático e calculado, Sova oferece uma experiência gratificante, permitindo que você contribua significativamente para o sucesso da equipe mesmo sem necessariamente liderar o placar de eliminações. Sua presença em uma equipe eleva o nível de consciência situacional e permite tomadas de decisão mais informadas em todos os estágios da rodada.

Como diz o próprio Sova: "Onde quer que estejam, eu os encontrarei." Com prática e determinação, você se tornará o olhar vigilante de sua equipe, garantindo que nenhum inimigo permaneça escondido por muito tempo.', 'Agent');

-- Jett
INSERT INTO guide (user_id, title, content, guide_type) VALUES 
(1, 'VALORANT: Guia Completo da Jett', '# VALORANT: Guia Completo da Jett

## Visão Geral

Jett é uma Duelista ágil e elusiva originária da Coreia do Sul, especializada em mobilidade e jogadas agressivas. Representando o vento em sua essência, Jett utiliza sua agilidade excepcional para flanquear inimigos, criar ângulos surpreendentes e escapar de situações perigosas. Com um conjunto de habilidades focado em movimento rápido e ataques precisos, ela é perfeita para jogadores que preferem um estilo de jogo dinâmico e individualista.

Como a agente mais móvel de VALORANT, Jett é frequentemente escolhida por jogadores mecanicamente habilidosos que confiam em seus reflexos e precisão. Seu potencial para criar jogadas espetaculares e sua capacidade de operar com relativa independência a tornam uma escolha popular tanto em jogos casuais quanto competitivos.

## Habilidades

### Corrente Ascendente (X) - 150 Créditos

**Descrição:** INSTANTANEAMENTE impulsiona Jett para cima após um breve carregamento.

**Características:**
- Propulsão vertical rápida
- Permite atingir locais elevados
- Combina com o planador passivo
- Reposiciona rapidamente durante combates
- Máximo de 2 cargas

**Dicas de Uso:**
- Use para acessar posições de sniper não convencionais
- Combine com o planador para movimento aéreo estendido
- Crie ângulos inesperados durante duelos
- Escape de utilidades inimigas como molotovs e granadas
- Reposicione rapidamente após eliminar um inimigo

### Brisa de Impulso (E) - Habilidade Assinatura (Recarrega a cada duas eliminações)

**Descrição:** INSTANTANEAMENTE propulsiona Jett na direção do movimento atual. Se estiver parada, Jett avançará para frente.

**Características:**
- Dash rápido na direção do movimento
- Recarrega com duas eliminações
- Permite esquivas e reposicionamentos rápidos
- Ativação quase instantânea

**Dicas de Uso:**
- Escape após fazer disparos com Operator/Guardian
- Reposicione durante duelos para criar vantagem
- Entre e saia rapidamente de linhas de visão perigosas
- Combine com Corrente Ascendente para mobilidade tridimensional
- Evite usar previsivamente - guarde para situações reativas
- Não dash em linha reta para inimigos preparados

### Erupção Nebulosa (C) - 200 Créditos

**Descrição:** Lança INSTANTANEAMENTE um projétil que se expande numa breve nuvem de fumaça ao impactar uma superfície. SEGURE o botão da habilidade para curvar a fumaça na direção da sua mira.

**Características:**
- Fumaça de curta duração (4-5 segundos)
- Pode ser curvada durante o lançamento
- Implantação relativamente rápida
- Máximo de 2 cargas

**Dicas de Uso:**
- Bloqueie linhas de visão durante entradas agressivas
- Use para cobrir reposicionamentos após eliminar inimigos
- Crie one-ways temporários em cantos e elevações
- Bloqueie visão de operadores inimigos para traçar rotas seguras
- Combine com dash para jogadas agressivas e recuos táticos

### Tormenta de Aço (X) - 7 Pontos de Ultimate

**Descrição:** Equipa um conjunto de facas de arremesso altamente precisas. DISPARE para lançar uma única faca com precisão. DISPARO ALTERNATIVO arremessa todas as facas restantes. As facas se recarregam ao matar um inimigo.

**Características:**
- Alta precisão mesmo durante movimento
- Eliminação instantânea com acertos na cabeça
- Recarrega ao eliminar inimigos
- Permite mobilidade total durante uso
- Disparo alternativo lança todas as facas restantes

**Dicas de Uso:**
- Ative durante rodadas econômicas para conservar créditos
- Use quando enfrentando múltiplos inimigos para recarga potencial
- Mantenha mobilidade máxima enquanto usa - esse é o maior benefício
- Priorize tiros únicos precisos sobre o disparo alternativo na maioria das situações
- Combine com Corrente Ascendente para ângulos aéreos letais
- Excelente para retakes quando em desvantagem econômica

## Estratégias de Jogo

### Como Atacante

1. **Entradas em Site:**
   - Use Erupção Nebulosa para bloquear ângulos defensivos críticos
   - Siga com Corrente Ascendente para criar ângulos inesperados
   - Elimine um defensor e use Brisa de Impulso para reposicionar rapidamente
   - Comunique com sua equipe para seguir sua entrada

2. **Operação com Operator:**
   - Pegue ângulos agressivos com o Operator
   - Depois de atirar, use Brisa de Impulso para recuar em segurança
   - Reposicione com Corrente Ascendente para ângulos imprevisíveis
   - Use Erupção Nebulosa para cobrir reposicionamentos

3. **Flancos:**
   - Utilize sua mobilidade para rotas de flanco rápidas
   - Corrente Ascendente para acessar rotas inesperadas
   - Brisa de Impulso para engajar e desarmar adversários rapidamente
   - Tormenta de Aço para eliminações silenciosas durante flancos

### Como Defensora

1. **Defesa de Site:**
   - Tome posições off-angle com Corrente Ascendente
   - Após uma eliminação, Brisa de Impulso para reposicionamento
   - Use Erupção Nebulosa para cobrir recuos táticos
   - Mantenha mobilidade para evitar trades inimigos

2. **Operação com Operator:**
   - Tome linhas de visão agressivas com segurança
   - Dash para trás de cobertura após cada tiro
   - Reposicione constantemente para manter imprevisibilidade
   - Use mobilidade para cobrir múltiplos ângulos rapidamente

3. **Retakes:**
   - Corrente Ascendente para ângulos verticais durante retakes
   - Erupção Nebulosa para bloqueio visual temporário
   - Tormenta de Aço para combate eficiente durante desvantagem econômica
   - Use Brisa de Impulso para entrar rapidamente em sites

## Mapas Favoráveis

Jett é versátil em todos os mapas, mas particularmente forte em:

### Icebox
- Verticalidade ideal para Corrente Ascendente
- Muitos ângulos off-meta para explorar
- Espaços abertos onde sua mobilidade brilha
- Excelente para operar com Operator

### Breeze
- Grandes espaços abertos para maximizar mobilidade
- Verticidade que favorece posições elevadas
- Linhas de visão longas ideais para dash após tiros de Operator
- Muitas rotas para flancos rápidos

### Haven
- Múltiplos sites oferecem oportunidades de flancos e rotações rápidas
- Diversas posições elevadas para explorar com Corrente Ascendente
- Boas oportunidades para jogadas com Operator + dash

## Composições de Equipe Eficazes

Jett funciona bem com:

**Controladores (Omen, Astra, Brimstone):**
- Fornecem fumaças duradouras para complementar as fumaças temporárias de Jett
- Criam cobertura para entradas agressivas de Jett

**Iniciadores (Sova, Skye, Breach):**
- Oferecem utilidades para cegar/atordoar inimigos antes de entradas
- Fornecem informações para jogadas agressivas mais seguras

**Sentinelas (Killjoy, Cypher):**
- Protegem flancos enquanto Jett opera agressivamente
- Fornecem intelligence para direcionar agressões de Jett

**Outros Duelistas (Reyna, Phoenix):**
- Criam pressão em múltiplos ângulos
- Podem alternar função de primeira entrada dependendo do mapa

## Desafios e Limitações

1. **Alta Dependência de Habilidade Mecânica:**
   - Valor reduzido sem boa mira e reflexos
   - Requer excelente controle de movimento e posicionamento

2. **Curva de Aprendizado Íngreme:**
   - Timing de habilidades demanda prática extensiva
   - Movimento aéreo preciso requer desenvolvimento de memória muscular

3. **Vulnerabilidade a Utilitários de Controle:**
   - Susceptível a flashes, atordoamentos e slow orbs
   - Limitada se Brisa de Impulso é neutralizada (KAY/O, Astra)

4. **Expectativas de Performance:**
   - Pressão social para performar como Duelista
   - Pode ser frustrante durante dias "off" de mira

## Dicas Avançadas

1. **Dash Updraft Combos:**
   - Combine Corrente Ascendente + Brisa de Impulso para movimento tridimensional
   - Pratique timing preciso para maximizar alcance e altura

2. **Smoke One-Ways:**
   - Aprenda posicionamentos de Erupção Nebulosa que criam vantagens unilaterais
   - Use fumaças em alturas incomuns para criar one-ways temporários

3. **Economia Eficiente de Dashes:**
   - Não desperdice Brisa de Impulso para movimento básico
   - Reserve para situações de combate e escape táticos

4. **Knife Accuracy Training:**
   - Pratique precisão com Tormenta de Aço em modo de treino
   - Foque em headshots precisos em vez de spams com clique direito

5. **Updraft Variations:**
   - Aprenda diferentes alturas e timings de Corrente Ascendente
   - Domine o controle aéreo para maximizar imprevisibilidade

## Conclusão

Jett representa o pináculo de agilidade e mobilidade em VALORANT, oferecendo um estilo de jogo único focado em velocidade, precisão e jogadas individuais impactantes. Sua capacidade de criar ângulos inesperados, engajar e desengajar rapidamente a torna uma força formidável em mãos habilidosas.

Dominar Jett requer dedicação não apenas às mecânicas do agente, mas também ao desenvolvimento de habilidades fundamentais de tiro e movimento. A diferença entre uma Jett mediana e uma excepcional está na tomada de decisões - saber quando ser agressivo, quando recuar, e como maximizar o valor de cada habilidade.

Para jogadores que investem tempo em aprender seus limites e capacidades, Jett oferece algumas das jogadas mais gratificantes e espetaculares possíveis em VALORANT. Lembre-se que mesmo sendo uma agente altamente individualista, a comunicação e coordenação com sua equipe ainda multiplicam significativamente seu impacto.

Como diria a própria Jett: "Eles nunca saberão o que os atingiu" - com prática e determinação, você se tornará aquela rajada de vento impossível de capturar, deixando apenas a desolação para trás.', 'Agent');

-- Cypher
INSERT INTO guide (user_id, title, content, guide_type) VALUES 
(1, 'VALORANT: Guia Completo do Cypher', '# VALORANT: Guia Completo do Cypher

## Visão Geral

Cypher é uma Sentinela originária do Marrocos, especializada em vigilância e coleta de informações. Como um verdadeiro vigia, Cypher utiliza uma rede de dispositivos para monitorar cada movimento do inimigo, garantindo que nenhuma ação passe despercebida. Seu estilo de jogo gira em torno de controle de território, informação e negação de acessos.

Com seu conjunto de habilidades focado em câmeras, armadilhas e ferramentas de rastreamento, Cypher é o mestre da informação. Ele excele em segurar sites sozinho, vigiar flancos e proporcionar consciência situacional valiosa para toda sua equipe. Seu valor está na capacidade de alertar sobre movimentos inimigos e controlar áreas do mapa sem estar fisicamente presente.

## Habilidades

### Gaiola Cibernética (Q) - 100 Créditos

**Descrição:** Equipa uma gaiola cibernética. DISPARE para lançar. ATIVE para criar uma zona que bloqueia a visão e reduz a velocidade de inimigos que a atravessam.

**Características:**
- Ativa instantaneamente quando lançada
- Pode ser pré-colocada e ativada remotamente mais tarde
- Bloqueia visão em ambas direções
- Aplica efeito de desaceleração em inimigos que atravessam
- Duração de 7 segundos após ativação
- Máximo de 2 cargas por rodada

**Dicas de Uso:**
- Coloque preventivamente em rotas de flanco ou entradas de site
- Ative quando inimigos estão prestes a entrar para atrasar pushes
- Use para cobrir reposicionamentos durante retakes
- Combine com armadilhas para criar zonas de negação potentes
- Ative durante sons de passos para cegar inimigos durante pushes

### Câmera de Vigilância (E) - 200 Créditos

**Descrição:** Equipa uma câmera de vigilância. DISPARE para colocar a câmera. ATIVE para acessar a visão da câmera. Quando a câmera está ativa, DISPARE para lançar um dardo marcador que revelará a localização de qualquer jogador atingido.

**Características:**
- Câmera reposicionável (recuperável com F)
- Dardo marcador revela inimigos por alguns segundos
- Pode ser destruída por inimigos (1 ponto de vida)
- Permite visão em primeira pessoa quando ativa
- Tem zoom ajustável quando em uso
- Limitada a 1 câmera ativa por vez

**Dicas de Uso:**
- Posicione em locais elevados com boa visibilidade, mas difíceis de detectar
- Use para monitorar áreas não cobertas por você ou aliados
- Alterne rapidamente para a câmera para checar áreas críticas
- Conserve o dardo marcador para momentos cruciais
- Mude frequentemente a posição para evitar previsibilidade
- Posicione para cobrir múltiplos ângulos quando possível

### Armadilha Cibernética (C) - 200 Créditos

**Descrição:** Equipa uma armadilha cibernética. DISPARE para colocar uma armadilha invisível que revela inimigos quando acionada. A armadilha pode ser recolhida e reutilizada.

**Características:**
- Invisível após breve período de implantação
- Revela e concede tag a inimigos que a ativarem
- Produz efeito sonoro audível quando ativada
- Pode ser destruída por inimigos se detectada
- Reposicionável (recuperável com F)
- Máximo de 2 armadilhas ativas por vez

**Dicas de Uso:**
- Coloque em locais inesperados, não apenas entradas óbvias
- Posicione em altura média para evitar ser facilmente detectada
- Use para cobrir flancos durante ataques ou defesas
- Combine com Gaiolas Cibernéticas para maior eficácia
- Em defesa, coloque em pontos de entrada de site
- Durante ataques, proteja rotas de rotação com armadilhas

### Roubo Neural (X) - 7 Pontos de Ultimate

**Descrição:** INSTANTANEAMENTE usa em um inimigo morto na sua linha de visão para revelar a localização de todos os inimigos vivos.

**Características:**
- Revelação imediata de todos os inimigos vivos
- Requer linha de visão para um cadáver inimigo recente
- Duração curta mas impactante da revelação
- Não há animação significativa de uso, tornando-o discreto

**Dicas de Uso:**
- Use em momentos críticos como início de retakes
- Ideal após primeiras eliminações durante execuções
- Valioso em situações pós-planta para localizar defensores
- Especialmente poderoso em situações de clutch
- Comunique claramente as informações obtidas à equipe
- Use rapidamente antes que o corpo inimigo desapareça

## Estratégias de Jogo

### Como Atacante

1. **Controle de Flanco:**
   - Posicione Armadilhas Cibernéticas em rotas comuns de flanco
   - Use Câmera de Vigilância para monitorar áreas não cobertas pela equipe
   - Mantenha consciência de rotações inimigas durante execuções

2. **Execuções de Site:**
   - Coloque Câmera em posições que permitem reconhecimento seguro
   - Use Gaiola Cibernética para bloquear linhas de visão defensivas
   - Posicione armadilhas para detectar contra-ataques após tomar o site

3. **Pós-Planta:**
   - Estabeleça rede de vigilância ao redor da Spike
   - Utilize Gaiolas pré-colocadas para atrasar retakes
   - Use Roubo Neural após uma eliminação para localizar restantes defensores
   - Monitore múltiplos ângulos com sua Câmera durante defesa da Spike

### Como Defensor

1. **Defesa de Site:**
   - Crie setups com armadilhas e câmera para maximizar informação
   - Utilize Gaiolas para atrasar pushes quando armadilhas são acionadas
   - Posicione-se para capitalizar nas informações de suas utilidades
   - Varie seus setups para manter imprevisibilidade

2. **Retakes:**
   - Use Roubo Neural no início do retake para informações cruciais
   - Coloque Gaiolas para dividir o site durante retakes
   - Utilize Câmera para reconhecimento seguro antes de comprometer-se
   - Posicione Armadilhas durante retakes para detectar reposicionamentos

## Mapas Favoráveis

Cypher é particularmente eficaz nos seguintes mapas:

### Haven
- Três sites para defender beneficiam seu conjunto de utilidades
- Múltiplos pontos de flanco ideais para armadilhas
- Excelentes posicionamentos para câmera com visão ampla

### Bind
- Corredores estreitos perfeitos para armadilhas
- Layout favorece sua capacidade de controlar flancos
- Bons pontos de emboscada após detecção de inimigos

### Ascent
- Muitas posições elevadas para câmera
- Layout facilita controle de mid com utilidades
- Armadilhas eficazes em múltiplas entradas de site

## Composições de Equipe Eficazes

Cypher funciona bem com:

**Controladores (Brimstone, Omen, Astra):**
- Fumaças complementam suas ferramentas de controle de área
- Permitem que Cypher segure sites com maior segurança

**Duelistas (Jett, Reyna, Raze):**
- Podem capitalizar nas informações fornecidas por Cypher
- Criam espaço enquanto Cypher mantém segurança de flancos

**Iniciadores (Sova, Breach):**
- Combinam informações para consciência de mapa quase completa
- Utilitários de iniciação complementam detecção passiva de Cypher

**Outras Sentinelas (Killjoy, Sage):**
- Criam defesas extremamente difíceis de romper
- Capacidades defensivas sobrepostas liberam aliados para jogadas agressivas

## Desafios e Limitações

1. **Utilidades Destrutíveis:**
   - Câmera e armadilhas podem ser destruídas, neutralizando seu valor
   - Requer adaptação constante contra equipes experientes

2. **Setups Previsíveis:**
   - Jogadores experientes conhecem posições comuns de utilidades
   - Necessita variação constante para manter eficácia

3. **Mobilidade Limitada:**
   - Sem habilidades de reposicionamento rápido
   - Vulnerável a rushes coordenados quando sozinho

4. **Contadores Específicos:**
   - Raze pode destruir facilmente utilidades com explosivos
   - Sova pode revelar e destruir armadilhas com flechas
   - KAY/O pode desativar todas suas habilidades temporariamente

## Dicas Avançadas

1. **Posicionamento Criativo de Câmera:**
   - Aprenda spots incomuns em cada mapa
   - Use posições que cubram múltiplos ângulos simultaneamente
   - Coloque em superfícies escuras para dificultar detecção

2. **One-Way Cages:**
   - Aprenda setups de Gaiolas que criam vantagens unilaterais de visão
   - Posicione Gaiolas em alturas específicas para criar one-ways potentes

3. **Adaptação de Setups:**
   - Varie constantemente posições de armadilhas e câmeras
   - Adapte baseado no comportamento inimigo observado

4. **Tripwires Avançados:**
   - Posicione armadilhas em alturas inesperadas (nível da cabeça, não do solo)
   - Coloque em cantos não óbvios ou atrás de objetos pequenos

5. **Comunicação Eficiente:**
   - Desenvolva callouts claros e concisos para informações detectadas
   - Comunique intenções de utilização do Roubo Neural

## Conclusão

Cypher representa o pilar de informações defensivas em VALORANT, oferecendo um conjunto de habilidades focado em vigilância e controle de território. Sua capacidade de monitorar múltiplas áreas, detectar movimentos inimigos e revelar posições o torna um asset inestimável para qualquer composição de equipe.

Dominar Cypher requer pensamento estratégico, conhecimento profundo de mapas e habilidade para adaptar-se. O verdadeiro poder de Cypher está na antecipação - prever movimentos inimigos e posicionar suas utilidades para maximizar valor. A diferença entre um Cypher mediano e um excepcional está na criatividade dos setups e na eficiência da comunicação.

Para jogadores que valorizam informação e controle sobre agressão pura, Cypher oferece uma experiência gratificante. Com prática e desenvolvimento de game sense, você se tornará os olhos e ouvidos da sua equipe, sempre um passo à frente dos inimigos.

Como diz o próprio Cypher: "Eu sei exatamente onde vocês estão" - com maestria e vigilância constante, você garantirá que nenhuma ameaça passe despercebida, tecendo uma teia de informações que levará sua equipe à vitória.', 'Agent');

-- Reyna
INSERT INTO guide (user_id, title, content, guide_type) VALUES 
(1, 'VALORANT: Guia Completo da Reyna', '# VALORANT: Guia Completo da Reyna

## Visão Geral

Reyna é uma Duelista de alto risco e alta recompensa originária do México, cujo conjunto de habilidades gira em torno de dominar o combate individual e prosperar a partir de eliminações. Diferente de outros agentes, Reyna depende totalmente de suas habilidades para sucesso, sendo virtualmente inútil sem eliminações prévias.

Desenhada para jogadores confiantes em suas habilidades mecânicas, Reyna pode ser devastadora quando está dominando, com capacidade de curar-se completamente após cada eliminação, tornar-se intangível para evitar trocas, e potencialmente vencer rounds inteiros sozinha. No entanto, sua extrema dependência de eliminações faz dela uma escolha arriscada, pois oferece pouco valor para a equipe em dias ruins de desempenho.

Reyna representa o individualismo puro em VALORANT, recompensando jogadores agressivos com reflexos rápidos e mira precisa, enquanto pune impiedosamente aqueles que falham em garantir eliminações.

## Habilidades

### Devorar (Q) - 200 Créditos

**Descrição:** Inimigos mortos por Reyna deixam Orbes de Alma que duram 3 segundos. INSTANTANEAMENTE consome um Orbe de Alma próximo, curando-se rapidamente por uma quantidade significativa ao longo de um curto período. A cura acima de 100 pontos de vida decai com o tempo. Se IMPERATRIZ estiver ativa, esta habilidade será lançada automaticamente e não consumirá o orbe.

**Características:**
- Cura 100 pontos de vida ao longo de aproximadamente 2-3 segundos
- Permite sobrecura (até 150 de vida), que decai com o tempo
- Requer eliminação prévia para ativar
- Orbes duram apenas 3 segundos após eliminação
- Limitado a 2 cargas por rodada
- Automaticamente ativado durante o Ultimate sem consumir cargas

**Dicas de Uso:**
- Priorize usar após eliminar o primeiro inimigo em engajamentos multi-inimigos
- Use imediatamente quando não há ameaças imediatas para maximizar valor
- Alternativa entre Devorar e Dispensar baseado na situação
- Considere não usar em pequenos danos para conservar cargas
- Observe que a cura não é instantânea - precisa de cobertura breve

### Dispensar (E) - 200 Créditos

**Descrição:** INSTANTANEAMENTE consome um Orbe de Alma próximo, tornando-se intangível por um curto período. Se IMPERATRIZ estiver ativa, Reyna também fica invisível.

**Características:**
- Torna Reyna intangível (não pode ser atingida) por aproximadamente 2 segundos
- Requer eliminação prévia para ativar
- Permite reposicionamento sem ser atingida
- Durante Ultimate, adiciona invisibilidade parcial
- Limitado a 2 cargas por rodada
- Não pode atirar durante a intangibilidade

**Dicas de Uso:**
- Use para evitar trades após eliminações
- Ideal para reposicionamento após engajamentos
- Perfeito para escapar de utilidades inimigas (molotovs, ultimates)
- Priorize em situações com múltiplos inimigos visíveis
- Pode ser usado para cruzar ângulos perigosos após uma eliminação
- Baite tiros inimigos durante intangibilidade

### Olhar Voraz (C) - 250 Créditos

**Descrição:** Equipa um olho etéreo destrutível. ATIVE para lançar o olho a uma curta distância. O olho deixa com Nearsight todos os inimigos que olharem para ele.

**Características:**
- Causa Nearsight (visão extremamente limitada) em inimigos que olharem para ele
- Pode ser destruído por inimigos (1 ponto de vida)
- Duração de aproximadamente 2 segundos após ativação
- Visível para inimigos (orbe vermelho)
- Único utilitário não dependente de eliminações

**Dicas de Uso:**
- Lance antes de entrar em sites para cegar defensores
- Posicione acima do nível do olhar para maximizar eficácia
- Use para criar vantagem em duelos 1v1
- Coloque em ângulos onde inimigos devem olhar durante retakes
- Lance através de fumaças para criar entradas surpresa
- Combine com pré-disparo em ângulos comuns

### Imperatriz (X) - 6 Pontos de Ultimate

**Descrição:** INSTANTANEAMENTE entra em um frenesi, aumentando drasticamente a velocidade de disparo, de equipamento, e de recarga. Abates renovam a duração.

**Características:**
- Duração base de 30 segundos, estendível com eliminações
- Aumenta significativamente velocidade de disparo (+25%)
- Acelera velocidade de recarga e troca de armas
- Ativa Devorar automaticamente sem consumir orbes
- Adiciona invisibilidade ao Dispensar
- Reformula Reyna em sua forma mais letal

**Dicas de Uso:**
- Ative antes de entradas agressivas em sites
- Use durante rodadas eco para maximizar chances com armas inferiores
- Ideal para situações de clutch quando enfrentando múltiplos inimigos
- Combine com Olhar Voraz para duelos extremamente vantajosos
- Use o Dispensar durante Ultimate para jogadas agressivas com invisibilidade
- Comunique com a equipe quando ativado para coordenar pushes

## Estratégias de Jogo

### Como Atacante

1. **Entradas em Site:**
   - Use Olhar Voraz para cegar defensores em posições comuns
   - Busque duelos individuais para gerar orbes
   - Após primeira eliminação, use Dispensar para evitar trades e reposicionar
   - Comunique com time para seguir após criar espaço

2. **Rodadas Econômicas:**
   - Considere usar Ultimate com armas eco para maximizar valor
   - Foque em eliminar inimigos com armas avançadas para recuperá-las
   - Use Olhar Voraz para criar vantagem em duelos desiguais

3. **Pós-Planta:**
   - Jogue agressivamente com Devorar/Dispensar para negar retakes
   - Use Olhar Voraz em pontos de retake comuns
   - Crie vantagens 1v1 sequenciais em vez de enfrentar múltiplos inimigos simultaneamente

### Como Defensora

1. **Defesa de Site:**
   - Tome posições agressivas off-angle
   - Use Olhar Voraz quando pushes inimigos são detectados
   - Após eliminação inicial, cicle entre Devorar e Dispensar conforme necessário
   - Reposicione constantemente para criar jogadas imprevisíveis

2. **Retakes:**
   - Ative Ultimate para retakes em desvantagem numérica
   - Use Olhar Voraz para criar aberturas em posições pós-planta comuns
   - Elimine inimigos isolados antes de enfrentar grupos
   - Use Dispensar para cruzar áreas abertas ou perigosas após eliminar um inimigo

## Mapas Favoráveis

Reyna é versátil em todos os mapas, mas particularmente forte em:

### Icebox
- Muitos ângulos estreitos para colocação eficaz de Olhar Voraz
- Layout favorece duelos isolados
- Verticidade permite exploração criativa durante Dispensar

### Ascent
- Linhas de visão médias ideais para duelos
- Posições defensivas adequadas para uso de Olhar Voraz
- Bom fluxo para cadeias de eliminações

### Bind
- Corredores estreitos onde Olhar Voraz é extremamente eficaz
- Muitas oportunidades para duelos isolados
- Teletransportes permitem reposicionamentos estratégicos após Dispensar

## Composições de Equipe Eficazes

Reyna funciona bem com:

**Controladores (Brimstone, Omen):**
- Fornecem fumaças para complementar suas entradas
- Criam isolamento para duelos favoráveis

**Iniciadores (Sova, Skye, Breach):**
- Oferecem utilitários para enfraquecer inimigos antes de seus duelos
- Fornecem informações para direcionar suas agressões

**Sentinelas (Cypher, Killjoy):**
- Asseguram flancos enquanto Reyna opera agressivamente
- Fornecem informações para suas jogadas agressivas

**Complemento de outros Duelistas:**
- Reyna + Jett/Raze podem criar entradas poderosas
- Alternando funções de entrada baseado em economia e mapas

## Desafios e Limitações

1. **Dependência de Eliminações:**
   - Virtualmente sem valor sem eliminar inimigos
   - Ciclo negativo em dias ruins (sem eliminações = sem habilidades = sem valor)

2. **Limitado Valor para Equipe:**
   - Não oferece utilitários que beneficiam diretamente aliados
   - Sem capacidade de coleta de informações confiável

3. **Alta Expectativa de Performance:**
   - Pressão social para dominar como Duelista
   - Curva de risco/recompensa íngreme

4. **Vulnerabilidade a Utilitários:**
   - Susceptível a flashes e atordoamento durante agressões
   - Olhar Voraz facilmente neutralizado por equipes coordenadas

## Dicas Avançadas

1. **Gerenciamento de Orbes:**
   - Priorize qual habilidade usar baseado na situação específica
   - Comunique à equipe quando você precisa de espaço para consumir orbes

2. **Posicionamento de Olhar Voraz:**
   - Lance em posições elevadas para maximizar área de efeito
   - Use ângulos inesperados além de simplesmente em frente a entradas

3. **Timing de Ultimate:**
   - Não espere situações desesperadas - use proativamente
   - Coordene com execuções de equipe para máxima eficácia

4. **Economia de Habilidades:**
   - Nem toda eliminação exige uso de orbe - avalie a situação
   - Considere guardar cargas para momentos mais críticos da rodada

5. **Adaptação de Agressividade:**
   - Ajuste seu nível de agressão baseado no sucesso inicial
   - Seja mais conservador quando enfrentando adversários fortes

## Conclusão

Reyna representa o arquétipo de duelista individual em sua forma mais pura, oferecendo potencial inigualável para dominar partidas, mas com o risco significativo de contribuir pouco nos dias ruins. Sua capacidade de se curar, tornar-se intangível e potencializar habilidades de combate a tornam uma força aterrorizante quando utilizada por jogadores mecanicamente habilidosos.

Dominar Reyna requer não apenas excelentes habilidades de mira e reflexos, mas também inteligência tática para maximizar o valor de suas habilidades limitadas. A diferença entre uma Reyna mediana e uma extraordinária está não apenas na capacidade de ganhar duelos, mas na tomada de decisão de quais habilidades usar após cada eliminação.

Para jogadores dispostos a abraçar o risco e confiantes em suas habilidades, Reyna oferece algumas das experiências mais gratificantes em VALORANT, com potencial para momentos de destaque e jogadas espetaculares. Lembre-se que mesmo sendo um agente individualista, comunicação e coordenação com a equipe ainda amplificam significativamente seu impacto.

Como diria a própria Reyna: "Eles não são páreo para mim. Eu não sou apenas suas sombras, sou seu aniquilamento." Com prática e confiança, você se tornará a força imparável que Reyna foi projetada para ser, devorando almas e dominando o campo de batalha.', 'Agent');