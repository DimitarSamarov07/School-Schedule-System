CREATE DATABASE IF NOT EXISTS school_system;
SET default_storage_engine = InnoDB;
USE school_system;

-- 1. Core Tables
CREATE TABLE IF NOT EXISTS `Schools`
(
    `id`               INT AUTO_INCREMENT PRIMARY KEY,
    `name`             VARCHAR(255) NOT NULL,
    `address`          VARCHAR(512),
    `work_week_config` JSON      DEFAULT '[
      1,
      2,
      3,
      4,
      5
    ]',
    `created_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users: Only for people who LOG IN (Admins, Principal, etc.)
CREATE TABLE IF NOT EXISTS `Users`
(
    `id`            INT AUTO_INCREMENT PRIMARY KEY,
    `username`      VARCHAR(50)  NOT NULL UNIQUE,
    `email`         VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(512) NOT NULL,
    `is_sudo` BOOLEAN DEFAULT FALSE,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Links Admins to Schools (Auth Logic)
CREATE TABLE IF NOT EXISTS `SchoolMembers`
(
    `school_id` INT NOT NULL,
    `user_id`   INT NOT NULL,
    `is_admin` BOOLEAN DEFAULT FALSE,
    `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`school_id`, `user_id`),
    FOREIGN KEY (`school_id`) REFERENCES `Schools` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
);

-- 2. The New Teachers Table (Staffing Logic)
-- No passwords, no accounts. Just employees.
CREATE TABLE IF NOT EXISTS `Teachers`
(
    `id`        INT AUTO_INCREMENT PRIMARY KEY,
    `school_id` INT          NOT NULL,
    `name`      VARCHAR(255) NOT NULL,
    `email`     VARCHAR(255), -- Optional contact email
    FOREIGN KEY (`school_id`) REFERENCES `Schools` (`id`) ON DELETE CASCADE
);

-- 3. Academic Assets
CREATE TABLE IF NOT EXISTS `Rooms`
(
    `id`        INT AUTO_INCREMENT PRIMARY KEY,
    `school_id` INT          NOT NULL,
    `name`      VARCHAR(255) NOT NULL,
    `floor`    INT NOT NULL DEFAULT 1,
    `capacity` INT          DEFAULT 30,
    FOREIGN KEY (`school_id`) REFERENCES `Schools` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `Subjects`
(
    `id`          INT AUTO_INCREMENT PRIMARY KEY,
    `school_id`   INT          NOT NULL,
    `name`        VARCHAR(255) NOT NULL,
    `description` VARCHAR(512),
    FOREIGN KEY (`school_id`) REFERENCES `Schools` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `Classes`
(
    `id`           INT AUTO_INCREMENT PRIMARY KEY,
    `school_id`    INT          NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `home_room_id` INT          NULL,
    `description` VARCHAR(512),
    FOREIGN KEY (`school_id`) REFERENCES `Schools` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`home_room_id`) REFERENCES `Rooms` (`id`) ON DELETE SET NULL
);

-- 4. Time Management
CREATE TABLE IF NOT EXISTS `Periods`
(
    `id`         INT AUTO_INCREMENT PRIMARY KEY,
    `school_id`  INT         NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `start_time` TIME        NOT NULL,
    `end_time`   TIME        NOT NULL,
    FOREIGN KEY (`school_id`) REFERENCES `Schools` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `SchoolHolidays`
(
    `id`         INT AUTO_INCREMENT PRIMARY KEY,
    `school_id`  INT          NOT NULL,
    `name`     VARCHAR(255) NOT NULL,
    `start_date` DATE         NOT NULL,
    `end_date` DATE         NOT NULL,
    FOREIGN KEY (`school_id`) REFERENCES `Schools` (`id`) ON DELETE CASCADE
);

-- 5. The Master Schedule
CREATE TABLE IF NOT EXISTS `Schedule`
(
    `id`         INT AUTO_INCREMENT PRIMARY KEY,
    `school_id`  INT  NOT NULL,
    `date`       DATE NOT NULL,
    `period_id`  INT  NOT NULL,
    `class_id`   INT  NOT NULL,
    `teacher_id` INT  NOT NULL,
    `subject_id` INT  NOT NULL,
    `room_id`    INT  NOT NULL,

    FOREIGN KEY (`school_id`) REFERENCES `Schools` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`period_id`) REFERENCES `Periods` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`class_id`) REFERENCES `Classes` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`teacher_id`) REFERENCES `Teachers` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_id`) REFERENCES `Subjects` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`room_id`) REFERENCES `Rooms` (`id`) ON DELETE CASCADE,

    -- CONSTRAINTS
    -- 1. Room cannot be double booked
    UNIQUE KEY `unique_room_time` (`date`, `period_id`, `room_id`),
    -- 2. Teacher cannot be double booked
    UNIQUE KEY `unique_teacher_time` (`date`, `period_id`, `teacher_id`),
    -- 3. Class cannot be double booked
    UNIQUE KEY `unique_class_time` (`date`, `period_id`, `class_id`)
);