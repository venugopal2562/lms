-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Feb 17, 2015 at 08:19 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `holiday`
--

CREATE TABLE IF NOT EXISTS `holiday` (
  `date` datetime DEFAULT NULL,
  `occasion` varchar(255) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `holiday`
--

INSERT INTO `holiday` (`date`, `occasion`, `id`, `createdAt`, `updatedAt`) VALUES
('2015-01-26 00:00:00', NULL, 1, '2015-02-18 00:48:39', '2015-02-18 00:48:39'),
('2015-03-06 00:00:00', NULL, 2, '2015-02-18 00:48:39', '2015-02-18 00:48:39'),
('2015-04-02 00:00:00', NULL, 3, '2015-02-18 00:48:39', '2015-02-18 00:48:39'),
('2015-04-03 00:00:00', NULL, 4, '2015-02-18 00:48:39', '2015-02-18 00:48:39'),
('2015-05-04 00:00:00', NULL, 5, '2015-02-18 00:48:39', '2015-02-18 00:48:39'),
('2015-09-25 00:00:00', NULL, 6, '2015-02-18 00:48:39', '2015-02-18 00:48:39'),
('2015-10-22 00:00:00', NULL, 7, '2015-02-18 00:48:39', '2015-02-18 00:48:39'),
('2015-11-11 00:00:00', NULL, 8, '2015-02-18 00:48:39', '2015-02-18 00:48:39'),
('2015-10-02 00:00:00', NULL, 9, '2015-02-18 00:48:39', '2015-02-18 00:48:39'),
('2015-11-25 00:00:00', NULL, 10, '2015-02-18 00:48:39', '2015-02-18 00:48:39'),
('2015-12-24 00:00:00', NULL, 11, '2015-02-18 00:48:39', '2015-02-18 00:48:39'),
('2015-12-25 00:00:00', NULL, 12, '2015-02-18 00:48:39', '2015-02-18 00:48:39');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
