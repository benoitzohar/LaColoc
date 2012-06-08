CREATE TABLE `gestio_depenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `cost` decimal(10,0) NOT NULL,
  `comment` text NOT NULL,
  `recursive` varchar(200) NOT NULL,
  `date_created` bigint(20) NOT NULL,
  `date_updated` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;