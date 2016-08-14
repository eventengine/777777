--
-- Скрипт сгенерирован Devart dbForge Studio for MySQL, Версия 7.1.13.0
-- Домашняя страница продукта: http://www.devart.com/ru/dbforge/mysql/studio
-- Дата скрипта: 15.08.2016 3:44:15
-- Версия сервера: 5.7.13-0ubuntu0.16.04.2
-- Версия клиента: 4.1
--


-- 
-- Отключение внешних ключей
-- 
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

-- 
-- Установить режим SQL (SQL mode)
-- 
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 
-- Установка кодировки, с использованием которой клиент будет посылать запросы на сервер
--
SET NAMES 'utf8';

-- 
-- Установка базы данных по умолчанию
--
USE gdetus;



--
-- Описание для таблицы tokens_remember_me
--
DROP TABLE IF EXISTS tokens_remember_me;
CREATE TABLE tokens_remember_me (
  user_id INT(11) DEFAULT NULL,
  token VARCHAR(255) DEFAULT NULL
)
ENGINE = INNODB
CHARACTER SET latin1
COLLATE latin1_swedish_ci
ROW_FORMAT = DYNAMIC;

--
-- Описание для таблицы users
--
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  firstname VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  lastname VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  gender VARCHAR(255) DEFAULT NULL,
  nickname VARCHAR(255) DEFAULT NULL,
  useruri VARCHAR(255) DEFAULT NULL,
  password VARCHAR(255) DEFAULT NULL,
  email VARCHAR(50) DEFAULT NULL,
  birthday_date DATETIME DEFAULT NULL,
  salt VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB
AUTO_INCREMENT = 5
AVG_ROW_LENGTH = 16384
CHARACTER SET latin1
COLLATE latin1_swedish_ci
ROW_FORMAT = DYNAMIC;

-- 
-- Вывод данных для таблицы tokens_remember_me
--

-- Таблица gdetus.tokens_remember_me не содержит данных

-- 
-- Вывод данных для таблицы users
--
INSERT INTO users VALUES
(1, 'Fktrcfylh', 'dfedfr', NULL, NULL, 'qwerty', '`12345678', 'ceo@gdetus.io', NULL, NULL),
(2, 'Иван', 'Петров', NULL, NULL, '1q2w3e', '9169e59230f9206e61fbf40378cbc11f580c523c', 'sefs@sdfsdf.com', NULL, NULL),
(3, 'Сухроб', 'Хусамов', NULL, NULL, 'khusamov', '65d078b84a3e36019d4cd601b0475ff487fd65fa', 'qa@qa.ru', NULL, NULL),
(4, 'Саша', 'Novikov', NULL, NULL, 'qazwsx', 'c4853e572bb46daea61cc1243cc196deeec3e666', 'qaw@qaw.ru', NULL, '721475176616');

-- 
-- Восстановить предыдущий режим SQL (SQL mode)
-- 
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

-- 
-- Включение внешних ключей
-- 
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;