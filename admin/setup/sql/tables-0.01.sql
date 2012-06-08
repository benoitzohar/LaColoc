CREATE DATABASE IF NOT EXISTS `{gestio_db}`;

CREATE TABLE IF NOT EXISTS `{gestio_db}`.`{gestio_prefix}users` (
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`login` TEXT NOT NULL ,
`passwd` TEXT NOT NULL ,
 `last_login_time` int(11) NOT NULL,
`last_login_ip` TEXT NOT NULL
) ENGINE = MYISAM;

CREATE TABLE IF NOT EXISTS `{gestio_db}`.`{gestio_prefix}modules` (
 `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` text NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `version` text NOT NULL,
  `last_edit` int(11) NOT NULL,
  `logo` text,
  `page_setup` text,
  `page_admin` text,
  `page_main` text,
  `tables` text
) ENGINE = MYISAM;

CREATE TABLE IF NOT EXISTS `{gestio_db}`.`{gestio_prefix}modules_users` (
`id_module` INT NOT NULL ,
`id_user` INT NOT NULL ,
  `added` int(11) NOT NULL
) ENGINE = MYISAM;
ALTER TABLE  `{gestio_db}`.`{gestio_prefix}modules_users` ADD UNIQUE (
`id_module` ,
`id_user`
);

CREATE TABLE IF NOT EXISTS `{gestio_db}`.`{gestio_prefix}infos` (
`version` TEXT NOT NULL ,
`title` TEXT NOT NULL ,
`default_lang` TEXT NOT NULL
) ENGINE = MYISAM;