-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for maganora
CREATE DATABASE IF NOT EXISTS `maganora` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `maganora`;

-- Dumping structure for table maganora.diak
CREATE TABLE IF NOT EXISTS `diak` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nev` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table maganora.diak: ~5 rows (approximately)
INSERT INTO `diak` (`id`, `nev`, `email`) VALUES
	(1, 'Kiss Miklós', 'kiss.miklos@gmail.com'),
	(2, 'Tóth Ákos', 'toth.akos@gmail.com'),
	(3, 'Nagy Ágnes', 'nagy.agnes@gmail.com'),
	(4, 'Varga László', 'varga.laszlo@gmail.com'),
	(5, 'Balogh Júlia', 'balogh.julia@gmail.com');

-- Dumping structure for table maganora.ertekeles
CREATE TABLE IF NOT EXISTS `ertekeles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `diak_id` int NOT NULL,
  `pontszam` int NOT NULL,
  `velemeny` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ertekeles_diak` (`diak_id`),
  CONSTRAINT `fk_ertekeles_diak` FOREIGN KEY (`diak_id`) REFERENCES `diak` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table maganora.ertekeles: ~5 rows (approximately)
INSERT INTO `ertekeles` (`id`, `diak_id`, `pontszam`, `velemeny`) VALUES
	(1, 5, 10, 'tökéletes'),
	(2, 2, 4, 'nem megfelelő'),
	(3, 1, 6, 'jó'),
	(4, 3, 9, 'tökéletes'),
	(5, 4, 5, 'jó');

-- Dumping structure for table maganora.idopont
CREATE TABLE IF NOT EXISTS `idopont` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tanar_id` int NOT NULL,
  `diak_id` int NOT NULL,
  `kezdete` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `vege` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `datum` date NOT NULL,
  `tipus` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_idopont_tanar` (`tanar_id`),
  KEY `fk_idopont_diak` (`diak_id`),
  CONSTRAINT `fk_idopont_diak` FOREIGN KEY (`diak_id`) REFERENCES `diak` (`id`),
  CONSTRAINT `fk_idopont_tanar` FOREIGN KEY (`tanar_id`) REFERENCES `tanar` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table maganora.idopont: ~5 rows (approximately)
INSERT INTO `idopont` (`id`, `tanar_id`, `diak_id`, `kezdete`, `vege`, `datum`, `tipus`) VALUES
	(1, 5, 2, '14:00', '15:30', '2026-10-15', 'online'),
	(2, 1, 4, '13:20', '14:05', '2026-09-28', 'jelenléti'),
	(3, 2, 3, '16:00', '17:00', '2026-10-01', 'jelenléti'),
	(4, 3, 3, '18:00', '18:50', '2026-10-05', 'feladatmegoldás'),
	(5, 5, 1, '10:00', '11:00', '2026-10-12', 'online');

-- Dumping structure for table maganora.tanar
CREATE TABLE IF NOT EXISTS `tanar` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ertekeles_id` int NOT NULL,
  `nev` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tanar_ertekeles` (`ertekeles_id`),
  CONSTRAINT `fk_tanar_ertekeles` FOREIGN KEY (`ertekeles_id`) REFERENCES `ertekeles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table maganora.tanar: ~5 rows (approximately)
INSERT INTO `tanar` (`id`, `ertekeles_id`, `nev`, `email`) VALUES
	(1, 4, 'Kovács Márton', 'marton.kovacs@gmail.com'),
	(2, 2, 'Szabó János', 'janos.szabo@gmail.com'),
	(3, 5, 'Havasi Zoltán', 'zoltan.havasi@gmail.com'),
	(4, 1, 'Németh Mihály', 'mihaly.nemeth@gmail.com'),
	(5, 3, 'Kis Pál', 'pal.kis@gmail.com');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
