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
  agent_image VARCHAR(255) DEFAULT NULL,
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
  guide_type ENUM('Agent','Map','Strategy','Other') DEFAULT 'Other',
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