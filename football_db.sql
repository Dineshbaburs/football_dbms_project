-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 18, 2026 at 02:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `football_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `increase_salary` ()   begin
    declare done int default false;
    declare cid int;
    declare sal decimal(10,2);

    declare cur cursor for 
        select contract_id, salary from contract;

    declare continue handler for not found set done = true;

    open cur;

    read_loop: loop
        fetch cur into cid, sal;
        if done then
            leave read_loop;
        end if;

        update contract
        set salary = sal * 1.10
        where contract_id = cid;
    end loop;

    close cur;
end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `club`
--

CREATE TABLE `club` (
  `club_id` int(11) NOT NULL,
  `club_name` varchar(100) DEFAULT NULL,
  `founded_year` int(11) DEFAULT NULL,
  `total_trophies` int(11) DEFAULT NULL,
  `owner_name` varchar(100) DEFAULT NULL,
  `club_email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `club`
--

INSERT INTO `club` (`club_id`, `club_name`, `founded_year`, `total_trophies`, `owner_name`, `club_email`) VALUES
(2, 'Manchester United', 1878, 66, 'Glazers', NULL),
(3, 'Barcelona', 1899, 75, 'Laporta', NULL),
(4, 'Real Madrid', 1902, 95, 'Perez', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contract`
--

CREATE TABLE `contract` (
  `contract_id` int(11) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `contract_duration` int(11) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `player_id` int(11) DEFAULT NULL,
  `club_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contract`
--

INSERT INTO `contract` (`contract_id`, `start_date`, `end_date`, `contract_duration`, `salary`, `player_id`, `club_id`) VALUES
(1, '2023-01-01', '2026-01-01', 3, 55000.00, 1, 1),
(2, '2022-01-01', '2025-01-01', 3, 88000.00, 2, 2),
(3, '2023-01-01', '2027-01-01', 4, 132000.00, 3, 3),
(4, '2023-01-01', '2026-01-01', 3, 66000.00, 4, 1),
(5, '2021-01-01', '2024-01-01', 3, 99000.00, 5, 2);

-- --------------------------------------------------------

--
-- Table structure for table `match_info`
--

CREATE TABLE `match_info` (
  `match_id` int(11) NOT NULL,
  `match_type` varchar(50) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `match_date` date DEFAULT NULL,
  `club_id` int(11) DEFAULT NULL,
  `stadium_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `match_info`
--

INSERT INTO `match_info` (`match_id`, `match_type`, `duration`, `match_date`, `club_id`, `stadium_id`) VALUES
(1, 'League', 90, '2024-03-10', 1, 1),
(2, 'Friendly', 90, '2024-04-15', 2, 2),
(3, 'Champions League', 120, '2024-05-20', 3, 3),
(4, 'League', 90, '2024-06-05', 1, 1),
(5, 'Friendly', 90, '2024-07-01', 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `player`
--

CREATE TABLE `player` (
  `player_id` int(11) NOT NULL,
  `f_name` varchar(50) DEFAULT NULL,
  `l_name` varchar(50) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `club_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `player`
--

INSERT INTO `player` (`player_id`, `f_name`, `l_name`, `dob`, `age`, `position`, `city`, `state`, `pincode`, `club_id`) VALUES
(1, 'Bruno', 'Fernandes', '1994-09-08', 29, 'Midfielder', 'Manchester', 'England', '10001', 1),
(2, 'Pedri', 'Gonzalez', '2002-11-25', 21, 'Midfielder', 'Barcelona', 'Spain', '20002', 2),
(3, 'Vinicius', 'Junior', '2000-07-12', 23, 'Forward', 'Madrid', 'Spain', '30003', 3),
(4, 'Rashford', 'Marcus', '1997-10-31', 26, 'Forward', 'Manchester', 'England', '10002', 1),
(5, 'Lewandowski', 'Robert', '1988-08-21', 35, 'Striker', 'Barcelona', 'Spain', '20003', 2);

--
-- Triggers `player`
--
DELIMITER $$
CREATE TRIGGER `after_player_delete` AFTER DELETE ON `player` FOR EACH ROW begin
    insert into player_log(player_id, deleted_at)
    values (old.player_id, now());
end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_player_insert` BEFORE INSERT ON `player` FOR EACH ROW begin
    if new.age < 15 then
        set new.age = 15;
    end if;
end
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `player_club_view`
-- (See below for the actual view)
--
CREATE TABLE `player_club_view` (
`player_id` int(11)
,`f_name` varchar(50)
,`l_name` varchar(50)
,`club_name` varchar(100)
);

-- --------------------------------------------------------

--
-- Table structure for table `player_log`
--

CREATE TABLE `player_log` (
  `log_id` int(11) NOT NULL,
  `player_id` int(11) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `player_phone`
--

CREATE TABLE `player_phone` (
  `player_id` int(11) NOT NULL,
  `phone_no` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `player_phone`
--

INSERT INTO `player_phone` (`player_id`, `phone_no`) VALUES
(1, '9123456789'),
(1, '9876543210'),
(2, '9988776655'),
(3, '9090909090'),
(4, '8888888888'),
(5, '7777777777');

-- --------------------------------------------------------

--
-- Table structure for table `stadium`
--

CREATE TABLE `stadium` (
  `stadium_id` int(11) NOT NULL,
  `stadium_name` varchar(100) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stadium`
--

INSERT INTO `stadium` (`stadium_id`, `stadium_name`, `capacity`, `city`) VALUES
(1, 'Old Trafford', 74000, 'Manchester'),
(2, 'Camp Nou', 99000, 'Barcelona'),
(3, 'Bernabeu', 81000, 'Madrid');

-- --------------------------------------------------------

--
-- Structure for view `player_club_view`
--
DROP TABLE IF EXISTS `player_club_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `player_club_view`  AS SELECT `p`.`player_id` AS `player_id`, `p`.`f_name` AS `f_name`, `p`.`l_name` AS `l_name`, `c`.`club_name` AS `club_name` FROM (`player` `p` join `club` `c` on(`p`.`club_id` = `c`.`club_id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `club`
--
ALTER TABLE `club`
  ADD PRIMARY KEY (`club_id`);

--
-- Indexes for table `contract`
--
ALTER TABLE `contract`
  ADD PRIMARY KEY (`contract_id`),
  ADD KEY `player_id` (`player_id`),
  ADD KEY `club_id` (`club_id`);

--
-- Indexes for table `match_info`
--
ALTER TABLE `match_info`
  ADD PRIMARY KEY (`match_id`),
  ADD KEY `club_id` (`club_id`),
  ADD KEY `stadium_id` (`stadium_id`);

--
-- Indexes for table `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`player_id`),
  ADD KEY `club_id` (`club_id`);

--
-- Indexes for table `player_log`
--
ALTER TABLE `player_log`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `player_phone`
--
ALTER TABLE `player_phone`
  ADD PRIMARY KEY (`player_id`,`phone_no`);

--
-- Indexes for table `stadium`
--
ALTER TABLE `stadium`
  ADD PRIMARY KEY (`stadium_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `club`
--
ALTER TABLE `club`
  MODIFY `club_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `contract`
--
ALTER TABLE `contract`
  MODIFY `contract_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `match_info`
--
ALTER TABLE `match_info`
  MODIFY `match_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `player`
--
ALTER TABLE `player`
  MODIFY `player_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `player_log`
--
ALTER TABLE `player_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stadium`
--
ALTER TABLE `stadium`
  MODIFY `stadium_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contract`
--
ALTER TABLE `contract`
  ADD CONSTRAINT `contract_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `player` (`player_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contract_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`club_id`) ON DELETE CASCADE;

--
-- Constraints for table `match_info`
--
ALTER TABLE `match_info`
  ADD CONSTRAINT `match_info_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `club` (`club_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `match_info_ibfk_2` FOREIGN KEY (`stadium_id`) REFERENCES `stadium` (`stadium_id`) ON DELETE CASCADE;

--
-- Constraints for table `player`
--
ALTER TABLE `player`
  ADD CONSTRAINT `player_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `club` (`club_id`) ON DELETE CASCADE;

--
-- Constraints for table `player_phone`
--
ALTER TABLE `player_phone`
  ADD CONSTRAINT `player_phone_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `player` (`player_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
