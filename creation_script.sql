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
  entity_type ENUM('Guide', 'Weapon', 'Map', 'Agent') NOT NULL,
  entity_id INT NOT NULL,
  user_id INT DEFAULT NULL,
  comment_text TEXT NOT NULL,
  comment_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comment_id),
  KEY entity_type_entity_id (entity_type, entity_id),
  KEY user_id (user_id),
  CONSTRAINT comment_ibfk_1 FOREIGN KEY (user_id) REFERENCES user (user_id)
);

ALTER TABLE comment 
ADD COLUMN `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved' AFTER comment_date,
ADD COLUMN rejected_reason VARCHAR(255) DEFAULT NULL AFTER status,
ADD COLUMN reviewed_by INT DEFAULT NULL AFTER rejected_reason,
ADD COLUMN reviewed_at TIMESTAMP NULL DEFAULT NULL AFTER reviewed_by,
ADD CONSTRAINT comment_ibfk_2 FOREIGN KEY (reviewed_by) REFERENCES user (user_id);

UPDATE comment SET `status` = 'approved';
