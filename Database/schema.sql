CREATE DATABASE IF NOT EXISTS school_system;
SET default_storage_engine = InnoDB;
USE school_system;

-- 1. Core Independent Tables
CREATE TABLE IF NOT EXISTS `Schools`
(
    `id`               INT AUTO_INCREMENT PRIMARY KEY,
    `name`             VARCHAR(255) NOT NULL,
    `address`          VARCHAR(512),

    -- Configuration for "Default Rest Days"
    -- Storing as JSON allows flexibility (e.g., [1,2,3,4,5] = Mon-Fri).
    -- Defaulting to Mon-Fri (ISO Weekday 1-5).
    `work_week_config` JSON      DEFAULT '[
      1,
      2,
      3,
      4,
      5
    ]',

    `created_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Users`
(
    `id`            INT AUTO_INCREMENT PRIMARY KEY,
    `username`      VARCHAR(50)  NOT NULL UNIQUE,
    `email`         VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(512) NOT NULL,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Linker Table (Defines Teachers & Admins contextually)
CREATE TABLE IF NOT EXISTS `SchoolMembers`
(
    `school_id` INT NOT NULL,
    `user_id`   INT NOT NULL,
    `is_admin`  BOOLEAN   DEFAULT FALSE, -- True = Admin, False = Standard Teacher/Staff
    `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`school_id`, `user_id`),
    FOREIGN KEY (`school_id`) REFERENCES `Schools` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
);

-- 3. Academic Assets
CREATE TABLE IF NOT EXISTS `Rooms`
(
    `id`        INT AUTO_INCREMENT PRIMARY KEY,
    `school_id` INT          NOT NULL,
    `name`      VARCHAR(255) NOT NULL,
    `capacity`  INT DEFAULT 30,
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
    `name`         VARCHAR(255) NOT NULL, -- e.g. "Grade 10"
    `home_room_id` INT          NULL,
    FOREIGN KEY (`school_id`) REFERENCES `Schools` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`home_room_id`) REFERENCES `Rooms` (`id`) ON DELETE SET NULL
);

-- 4. Time Management & Exceptions
CREATE TABLE IF NOT EXISTS `Periods`
(
    `id`         INT AUTO_INCREMENT PRIMARY KEY,
    `school_id`  INT         NOT NULL,
    `name`       VARCHAR(50) NOT NULL, -- e.g. "1st Period"
    `start_time` TIME        NOT NULL,
    `end_time`   TIME        NOT NULL,
    FOREIGN KEY (`school_id`) REFERENCES `Schools` (`id`) ON DELETE CASCADE
);

-- Handles specific holidays or events
CREATE TABLE IF NOT EXISTS `SchoolHolidays`
(
    `id`         INT AUTO_INCREMENT PRIMARY KEY,
    `school_id`  INT          NOT NULL,
    `name`       VARCHAR(255) NOT NULL, -- e.g. "Sports Day", "Winter Break"
    `start_date` DATE         NOT NULL,
    `end_date`   DATE         NOT NULL, -- For single day events, start_date = end_date
    FOREIGN KEY (`school_id`) REFERENCES `Schools` (`id`) ON DELETE CASCADE
);

-- The Master Schedule
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
    FOREIGN KEY (`teacher_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_id`) REFERENCES `Subjects` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`room_id`) REFERENCES `Rooms` (`id`) ON DELETE CASCADE,

    -- SMART CONSTRAINTS
    UNIQUE KEY `unique_room_time` (`date`, `period_id`, `room_id`),
    UNIQUE KEY `unique_teacher_time` (`date`, `period_id`, `teacher_id`),
    UNIQUE KEY `unique_class_time` (`date`, `period_id`, `class_id`)
);
