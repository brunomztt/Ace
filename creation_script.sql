CREATE DATABASE Ace;
USE ace;

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

DROP TABLE IF EXISTS role;
CREATE TABLE role (
  role_id INT NOT NULL AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL,
  PRIMARY KEY (role_id)
);

DROP TABLE IF EXISTS agent;
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

DROP TABLE IF EXISTS user;
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

DROP TABLE IF EXISTS agent_video;
CREATE TABLE agent_video (
  video_id INT NOT NULL AUTO_INCREMENT,
  agent_id INT DEFAULT NULL,
  youtube_link VARCHAR(255) NOT NULL,
  PRIMARY KEY (video_id),
  KEY agent_id (agent_id),
  CONSTRAINT agent_video_ibfk_1 FOREIGN KEY (agent_id) REFERENCES agent (agent_id)
);

DROP TABLE IF EXISTS map;
CREATE TABLE map (
  map_id INT NOT NULL AUTO_INCREMENT,
  map_name VARCHAR(50) NOT NULL,
  map_description TEXT,
  map_image VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (map_id)
);

DROP TABLE IF EXISTS guide;
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

DROP TABLE IF EXISTS comment;
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

DROP TABLE IF EXISTS skin;
CREATE TABLE skin (
  skin_id INT NOT NULL AUTO_INCREMENT,
  skin_name VARCHAR(100) NOT NULL,
  skin_type ENUM('Weapon','Agent') DEFAULT 'Weapon',
  skin_image VARCHAR(255) DEFAULT NULL,
  description TEXT,
  PRIMARY KEY (skin_id)
);

-- Inserções de dados
INSERT INTO role (role_name) VALUES ('Admin'), ('Moderator'), ('User'), ('Influencer');

INSERT INTO address (street, district, zip_code, house_number, complement) VALUES 
('TiraDentes', 'Boqueirao', '12345678', '101', 'Apt 1'),
('SirThomas', 'Agua verde', '87654321', '202', NULL),
('Brigadeiro Frango', 'Batel', '11223344', '303', 'Casa verde');

INSERT INTO user (role_id, is_enabled, first_name, last_name, nickname, cpf, phone_number, email, password, address_id) VALUES
(1, 1, 'Bruno', 'Mazetto', 'brunomztt', '12345678901', '11999990000', 'bruno@gmail.com', '$2a$12$aMYXEqoIFtYXkIVEEPO6sO3fJ0J8J2DIY/68JyhgPQC/UCH7baPZW', 1),
(2, 1, 'Rafael', '', 'rafasx', '98765432100', '11988887777', 'rafa@gmail.com', '$2a$12$h.nFcDDyRBJEv74Jw5.QXunXhcMZGPe.BoZ3zHd/m7/.cW8ClXOJC', 2),
(3, 1, 'Marco', 'Capote', 'marcocapote', '19283746500', '11977776666', 'marco@gmail.com', '$2a$12$O3Z0VW4i5n3S1KfOv8QUdeVGzeVgXvWu/0eVLsrLo4qVm5VcTXvbe', 3);