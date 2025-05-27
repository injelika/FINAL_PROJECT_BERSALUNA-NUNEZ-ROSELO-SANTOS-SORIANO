-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 27, 2025 at 08:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `helpdesk_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`) VALUES
(1, 'IT'),
(2, 'HR'),
(3, 'Finance'),
(4, 'Operations'),
(5, 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `remarks`
--

CREATE TABLE `remarks` (
  `id` int(11) NOT NULL,
  `ticketId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `content` text NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `remarks`
--

INSERT INTO `remarks` (`id`, `ticketId`, `userId`, `content`, `createdAt`) VALUES
(201, 101, 2, 'Checked power cables, everything seems fine.', '2025-05-02 11:00:00'),
(202, 102, 3, 'Contacted payroll department, awaiting response.', '2025-05-04 14:20:00'),
(203, 103, 8, 'Replaced access card and tested entry — working now.', '2025-05-04 10:45:00'),
(204, 104, 1, 'Confirmed crash on latest build. Escalating to dev team.', '2025-05-05 12:30:00'),
(205, 105, 6, 'Investigating audit logs to trace deleted file.', '2025-05-06 13:00:00'),
(206, 106, 9, 'Tried restarting printer. Still not responding.', '2025-05-07 10:00:00'),
(207, 107, 6, 'Ordered thermal paste for laptop re-application.', '2025-05-08 15:00:00'),
(208, 108, 8, 'Requested facilities to inspect AC unit.', '2025-05-08 16:00:00'),
(209, 109, 1, 'Monitor request noted, checking inventory.', '2025-05-09 09:00:00'),
(210, 110, 4, 'Reset email credentials, should work now.', '2025-05-09 11:00:00'),
(211, 111, 2, 'Tested VPN config, needs firewall exception.', '2025-05-10 10:00:00'),
(212, 112, 7, 'Requested replacement chair from admin.', '2025-05-10 12:00:00'),
(213, 113, 9, 'Uploaded updated HR handbook to portal.', '2025-05-11 10:00:00'),
(214, 114, 5, 'Cleared cache, still facing issue. Needs dev input.', '2025-05-11 15:00:00'),
(215, 115, 1, 'Router restarted, issue persisted. Escalating.', '2025-05-12 09:00:00'),
(216, 116, 5, 'Updated folder permissions for user access.', '2025-05-12 11:00:00'),
(217, 117, 4, 'Maintenance contacted. Cleaned machine internals.', '2025-05-13 10:30:00'),
(218, 118, 1, 'Renewal request submitted to procurement.', '2025-05-13 12:00:00'),
(219, 119, 9, 'Added schedule to HR calendar. Email sent to attendees.', '2025-05-14 09:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `assignedTo` int(11) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `severity` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `title`, `description`, `createdBy`, `assignedTo`, `departmentId`, `severity`, `status`, `createdAt`) VALUES
(101, 'Computer won\'t start', 'PC won\'t turn on after power surge.', 1, 2, 1, 'High', 'Open', '2025-05-01 10:00:00'),
(102, 'Payroll issue', 'Salary not reflecting for May.', 3, NULL, 3, 'Medium', 'InProgress', '2025-05-03 09:30:00'),
(103, 'Access card not working', 'Unable to enter building using access card.', 7, 8, 4, 'Low', 'Resolved', '2025-05-04 08:15:00'),
(104, 'System crash on login', 'App crashes immediately after login.', 2, 1, 1, 'Critical', 'Open', '2025-05-05 11:45:00'),
(105, 'Budget sheet missing', 'Latest monthly report disappeared from shared drive.', 5, 6, 3, 'High', 'InProgress', '2025-05-06 12:00:00'),
(106, 'Printer not responding', 'Printer in 3rd floor office isn\'t printing.', 9, NULL, 5, 'Medium', 'Open', '2025-05-07 09:10:00'),
(107, 'Laptop overheating', 'Laptop becomes very hot within 10 minutes of usage.', 6, NULL, 3, 'Medium', 'Open', '2025-05-08 14:00:00'),
(108, 'Aircon not working in conference room', 'Air conditioning unit not cooling during meetings.', 8, NULL, 4, 'High', 'Open', '2025-05-08 15:30:00'),
(109, 'Request for additional monitor', 'Need dual screens for productivity.', 2, NULL, 1, 'Low', 'Open', '2025-05-09 08:45:00'),
(110, 'Email access revoked', 'Unable to access work email after password reset.', 4, NULL, 5, 'High', 'Open', '2025-05-09 10:00:00'),
(111, 'VPN not connecting', 'Remote connection fails with timeout error.', 1, NULL, 1, 'Critical', 'Open', '2025-05-10 09:20:00'),
(112, 'Office chair broken', 'Chair base is cracked and wobbly.', 7, NULL, 4, 'Low', 'Open', '2025-05-10 11:30:00'),
(113, 'Need updated company handbook', 'Looking for 2025 HR policy document.', 3, NULL, 2, 'Medium', 'Open', '2025-05-11 09:00:00'),
(114, 'Finance dashboard error', 'Graphs not loading on monthly report dashboard.', 5, NULL, 3, 'High', 'Open', '2025-05-11 14:10:00'),
(115, 'Network outage on 2nd floor', 'No internet connectivity in the east wing.', 8, 1, 4, 'Critical', 'InProgress', '2025-05-12 08:30:00'),
(116, 'Unable to access shared folder', 'Permission denied on FinanceDocs.', 6, 5, 3, 'High', 'Open', '2025-05-12 10:45:00'),
(117, 'Coffee machine needs servicing', 'Machine is leaking and won’t brew.', 9, 4, 5, 'Low', 'Resolved', '2025-05-13 09:50:00'),
(118, 'Software license expired', 'Can’t access premium features in design tool.', 2, 1, 1, 'Medium', 'Open', '2025-05-13 11:15:00'),
(119, 'Orientation schedule missing', 'New hire onboarding session not appearing on calendar.', 3, 9, 2, 'Medium', 'InProgress', '2025-05-14 08:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `role`, `departmentId`, `email`, `password`) VALUES
(1, 'Angel Santos', 'Supervisor', 1, 'angel@gmail.com', '123456'),
(2, 'Ivan Bersaluna', 'Junior Officer', 1, 'ivan@gmail.com', '123456'),
(3, 'John Daniel Roselo', 'Officer', 2, 'daniel@gmail.com', '123456'),
(4, 'Niel Harriss Nuñez', 'Admin', 5, 'niel@gmail.com', '123456'),
(5, 'Sarah Lim', 'Supervisor', 3, 'sarah@gmail.com', '123456'),
(6, 'Ben Cruz', 'Officer', 3, 'ben@gmail.com', '123456'),
(7, 'Jessica Tan', 'Junior Officer', 4, 'jessica@gmail.com', '123456'),
(8, 'Chris Dela Cruz', 'Officer', 4, 'chris@gmail.com', '123456'),
(9, 'Mia Gonzales', 'Supervisor', 2, 'mia@gmail.com', '123456');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `remarks`
--
ALTER TABLE `remarks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticketId` (`ticketId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `createdBy` (`createdBy`),
  ADD KEY `assignedTo` (`assignedTo`),
  ADD KEY `departmentId` (`departmentId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `departmentId` (`departmentId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `remarks`
--
ALTER TABLE `remarks`
  ADD CONSTRAINT `remarks_ibfk_1` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`),
  ADD CONSTRAINT `remarks_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
