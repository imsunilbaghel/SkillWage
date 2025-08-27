-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: skillwage
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customerid` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(10) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `profileImage` varchar(255) DEFAULT NULL,
  `zip` varchar(6) NOT NULL,
  `state` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `subdivision` varchar(50) DEFAULT NULL,
  `address1` text NOT NULL,
  PRIMARY KEY (`customerid`),
  UNIQUE KEY `phoneNumber` (`phoneNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (18,'Sunil kumar','7303611016','official.sunilbaghel@gmail.com','Absus@987','image/profile_images/7303611016.jpeg','201007','Uttar Pradesh','Ghaziabad','Mohan Nagar (Ghaziabad)','1186'),(19,'Sunil Baghel','9873178540','official.sunilbghe@gmail.com','Absus@987','image/profile_images/9873178540.jpg','201007','Uttar Pradesh','Ghaziabad','Mohan Nagar (Ghaziabad)','1185 , khara kuan , arthala , mohan nagar');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_requirement`
--

DROP TABLE IF EXISTS `post_requirement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_requirement` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `customerid` int DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `postimage` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `customerid` (`customerid`),
  CONSTRAINT `post_requirement_ibfk_1` FOREIGN KEY (`customerid`) REFERENCES `customers` (`customerid`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_requirement`
--

LOCK TABLES `post_requirement` WRITE;
/*!40000 ALTER TABLE `post_requirement` DISABLE KEYS */;
INSERT INTO `post_requirement` VALUES (8,19,'Electrician','post_1745079366616_538204317.jpg','Write a requirement','2025-04-19');
/*!40000 ALTER TABLE `post_requirement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rate`
--

DROP TABLE IF EXISTS `rate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rate` (
  `rate_id` int NOT NULL AUTO_INCREMENT,
  `customerid` int DEFAULT NULL,
  `workerid` int DEFAULT NULL,
  `id` int DEFAULT NULL,
  `rating_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `rating` decimal(2,1) DEFAULT NULL,
  PRIMARY KEY (`rate_id`),
  KEY `customerid` (`customerid`),
  KEY `workerid` (`workerid`),
  KEY `id` (`id`),
  CONSTRAINT `rate_ibfk_1` FOREIGN KEY (`customerid`) REFERENCES `customers` (`customerid`),
  CONSTRAINT `rate_ibfk_2` FOREIGN KEY (`workerid`) REFERENCES `workers` (`workerid`),
  CONSTRAINT `rate_ibfk_3` FOREIGN KEY (`id`) REFERENCES `servicerequests` (`id`),
  CONSTRAINT `rate_chk_1` CHECK ((`rating` between 0 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rate`
--

LOCK TABLES `rate` WRITE;
/*!40000 ALTER TABLE `rate` DISABLE KEYS */;
INSERT INTO `rate` VALUES (2,18,79,11,'2025-04-27 17:14:03',5.0),(3,18,79,12,'2025-04-27 17:15:25',4.0),(4,18,79,14,'2025-05-01 21:52:42',2.0),(5,18,79,27,'2025-05-03 12:31:19',5.0),(6,18,84,28,'2025-05-03 12:51:17',5.0);
/*!40000 ALTER TABLE `rate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicerequests`
--

DROP TABLE IF EXISTS `servicerequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicerequests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerid` int DEFAULT NULL,
  `workerid` int DEFAULT NULL,
  `status` enum('pending','accepted','cancelled','completed') DEFAULT NULL,
  `requestDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `isHidden` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `customerid` (`customerid`),
  KEY `workerid` (`workerid`),
  CONSTRAINT `servicerequests_ibfk_1` FOREIGN KEY (`customerid`) REFERENCES `customers` (`customerid`),
  CONSTRAINT `servicerequests_ibfk_2` FOREIGN KEY (`workerid`) REFERENCES `workers` (`workerid`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicerequests`
--

LOCK TABLES `servicerequests` WRITE;
/*!40000 ALTER TABLE `servicerequests` DISABLE KEYS */;
INSERT INTO `servicerequests` VALUES (11,18,79,'completed','2025-04-27 11:43:29',1),(12,18,79,'completed','2025-04-27 11:44:59',1),(14,18,79,'completed','2025-04-27 12:02:58',1),(15,18,80,'pending','2025-04-27 12:33:22',0),(16,18,81,'pending','2025-04-28 14:14:13',0),(26,18,82,'pending','2025-05-02 06:04:44',0),(27,18,79,'completed','2025-05-03 07:00:47',0),(28,18,84,'completed','2025-05-03 07:20:47',0);
/*!40000 ALTER TABLE `servicerequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workers`
--

DROP TABLE IF EXISTS `workers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workers` (
  `workerid` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `aadhaarNumber` varchar(12) DEFAULT NULL,
  `occupation` varchar(15) DEFAULT NULL,
  `servicecharge` int DEFAULT NULL,
  `address1` text,
  `zip` varchar(6) DEFAULT NULL,
  `state` varchar(30) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `subdivision` varchar(50) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `aadhaarImage` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`workerid`),
  UNIQUE KEY `phoneNumber` (`phoneNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workers`
--

LOCK TABLES `workers` WRITE;
/*!40000 ALTER TABLE `workers` DISABLE KEYS */;
INSERT INTO `workers` VALUES (79,'Sunil kumar','9873178540','2002-05-12','Male','123694545456','Labour',2560,'11867','201007','Uttar Pradesh','Ghaziabad','Mohan Nagar (Ghaziabad)','image/profile_images/9873178540.jpeg','image/aadhaar_cards/9873178540.jpeg','123620029873'),(80,'Rohit','7303611015','2002-05-12','Male','123694545456','Labour',100,'1185 , khara kuan , arthala , mohan nagar','201007','Uttar Pradesh','Ghaziabad','Mohan Nagar (Ghaziabad)','image/profile_images/7303611015.png','image/aadhaar_cards/7303611015.png','123620027303'),(81,'Parvesh Kumar','9873178515','1992-05-12','Male','123694545456','Electrician',100,'1185 , khara kuan , arthala , mohan nagar','201007','Uttar Pradesh','Ghaziabad','Mohan Nagar (Ghaziabad)','image/profile_images/9873178515.jpg','image/aadhaar_cards/9873178515.jpg','123619929873'),(82,'Sunil Baghel','9873178536','2002-05-12','Male','963412349012','Labour',100,'1185 , khara kuan , arthala , mohan nagar','201007','Uttar Pradesh','Ghaziabad','Mohan Nagar (Ghaziabad)','image/profile_images/9873178536.jpg','image/aadhaar_cards/9873178536.jpeg','963420029873'),(83,'Nemar','9873178532','2002-05-12','Male','963412349045','Labour',156,'1185 , khara kuan , arthala , mohan nagar','201007','Uttar Pradesh','Ghaziabad','Mohan Nagar (Ghaziabad)','image/profile_images/9873178532.jpg','image/aadhaar_cards/9873178532.jpg','963420029873'),(84,'hjagjshgdasd','9873178530','2006-05-12','Male','122121212121','Labour',100,'1185','201007','Uttar Pradesh','Ghaziabad','Mohan Nagar (Ghaziabad)','image/profile_images/9873178530.png','image/aadhaar_cards/9873178530.png','122120069873');
/*!40000 ALTER TABLE `workers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-12 21:08:45
