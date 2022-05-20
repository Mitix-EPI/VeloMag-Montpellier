-- Bike Database
CREATE DATABASE IF NOT EXISTS broken_bike;

USE broken_bike;

CREATE TABLE IF NOT EXISTS `bikes` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `id_bike` int(11) NOT NULL,
    `priority` ENUM('low', 'important', 'urgent') NOT NULL DEFAULT 'low',
    `reason` ENUM(
        'brake problem',
        'gear problem',
        'seat problem',
        'touch panel not working',
        'other'
    ) NOT NULL DEFAULT 'other',
    `description` text NOT NULL,
    `created_at` datetime NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1 AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS `admin` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1 AUTO_INCREMENT = 1;

INSERT INTO
    `admin` (`id`, `email`, `password`)
VALUES
    (1, 'admin', 'admin');
