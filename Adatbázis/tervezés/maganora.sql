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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table maganora.diak: ~0 rows (approximately)

-- Dumping structure for table maganora.ertekeles
CREATE TABLE IF NOT EXISTS `ertekeles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `diak_id` int NOT NULL,
  `pontszam` int NOT NULL,
  `velemeny` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ertekeles_diak` (`diak_id`),
  CONSTRAINT `fk_ertekeles_diak` FOREIGN KEY (`diak_id`) REFERENCES `diak` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table maganora.ertekeles: ~0 rows (approximately)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table maganora.idopont: ~0 rows (approximately)

-- Dumping structure for table maganora.tanar
CREATE TABLE IF NOT EXISTS `tanar` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ertekeles_id` int NOT NULL,
  `nev` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tanar_ertekeles` (`ertekeles_id`),
  CONSTRAINT `fk_tanar_ertekeles` FOREIGN KEY (`ertekeles_id`) REFERENCES `ertekeles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table maganora.tanar: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
