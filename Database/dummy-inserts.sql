-- GLOBAL SETTINGS
USE school_system;
SET default_storage_engine = InnoDB;

-- ==========================================
-- 1. Create Schools
-- ==========================================
INSERT INTO Schools (name, address, work_week_config)
VALUES ('Springfield High', '123 Evergreen Terrace', '[1, 2, 3, 4, 5]'),
       ('Future Tech Academy', '404 Silicon Valley', '[1, 2, 3, 4, 5, 6]');

-- ==========================================
-- 2. Create Users
-- ==========================================
INSERT INTO Users (username, email, password_hash)
VALUES ('principal_skinner', 'skinner@springfield.edu', 'hash1'),
       ('teacher_krabappel', 'edna@springfield.edu', 'hash2'),
       ('teacher_hoover', 'liz@springfield.edu', 'hash3'),
       ('teacher_largo', 'dewey@springfield.edu', 'hash4'),
       ('teacher_pommelhorst', 'brunella@springfield.edu', 'hash5'),
       ('teacher_flanders', 'ned@springfield.edu', 'hash6'),
       ('admin_musk', 'elon@future.tech', 'hash7'),
       ('prof_farnsworth', 'hubert@future.tech', 'hash8'),
       ('dr_zoidberg', 'john@future.tech', 'hash9'),
       ('unit_x1', 'x1@future.tech', 'hash10');

-- ==========================================
-- 3. Link Users to Schools
-- ==========================================
INSERT INTO SchoolMembers (school_id, user_id, is_admin)
VALUES (1, 1, 1),
       (1, 2, 0),
       (1, 3, 0),
       (1, 4, 0),
       (1, 5, 0),
       (1, 6, 0),
       (2, 7, 1),
       (2, 8, 0),
       (2, 9, 0),
       (2, 10, 0);

-- ==========================================
-- 4. Create Rooms
-- ==========================================
INSERT INTO Rooms (school_id, name,floor, capacity)
VALUES (1, 'Room 101 (Homeroom)',1, 30),
       (1, 'Room 102', 1,30),
       (1, 'Science Lab A',1, 20),
       (1, 'Music Hall',1, 50),
       (1, 'Gymnasium',2, 100),
       (1, 'Library',2, 60),
       (2, 'Quantum Lab',4, 10),
       (2, 'Hologram Deck',5, 40),
       (2, 'Server Farm',4, 5);

-- ==========================================
-- 5. Create Subjects
-- ==========================================
INSERT INTO Subjects (school_id, name, description)
VALUES (1, 'Mathematics', 'Algebra I'),
       (1, 'History', 'World History'),
       (1, 'Music', 'Band Practice'),
       (1, 'P.E.', 'Physical Education'),
       (1, 'Science', 'Chemistry Basics'),
       (1, 'English', 'Literature'),
       (2, 'Quantum Mechanics', 'Advanced'),
       (2, 'Alien Biology', 'Anatomy'),
       (2, 'Binary Coding', '010101');

-- ==========================================
-- 6. Create Classes
-- ==========================================
INSERT INTO Classes (school_id, name, home_room_id)
VALUES (1, 'Grade 4A', 1),
       (1, 'Grade 4B', 2),
       (1, 'Grade 2A', 1),
       (1, 'Grade 5', 2),
       (2, 'Alpha Squad', 7),
       (2, 'Beta Squad', 8);

-- ==========================================
-- 7. Create Periods (WITH VARIABLE BREAKS)
-- ==========================================
INSERT INTO Periods (school_id, name, start_time, end_time)
VALUES
-- SPRINGFIELD HIGH SCHEDULE

-- Period 1 (08:00 - 08:45)
(1, 'Period 1', '08:00:00', '08:45:00'),      -- ID 1

-- BREAK: 10 Minutes (08:45 - 08:55)

-- Period 2 (08:55 - 09:40)
(1, 'Period 2', '08:55:00', '09:40:00'),      -- ID 2

-- RECESS: 20 Minutes (09:40 - 10:00)

-- Period 3 (10:00 - 10:45)
(1, 'Period 3', '10:00:00', '10:45:00'),      -- ID 3

-- LUNCH: 50 Minutes (10:45 - 11:35)

-- Period 4 (11:35 - 12:20)
(1, 'Period 4', '11:35:00', '12:20:00'),      -- ID 4


-- FUTURE TECH SCHEDULE (Longer blocks)
(2, 'Morning Cycle', '09:00:00', '12:00:00'), -- ID 5
(2, 'Evening Cycle', '18:00:00', '21:00:00');
-- ID 6

-- ==========================================
-- 8. THE MASTER SCHEDULE
-- ==========================================
INSERT INTO Schedule (school_id, date, period_id, class_id, teacher_id, subject_id, room_id)
VALUES

-- === PERIOD 1 (08:00 - 08:45) ===
(1, '2023-10-16', 1, 1, 2, 1, 1), -- 4A Math
(1, '2023-10-16', 1, 2, 3, 2, 2), -- 4B History
(1, '2023-10-16', 1, 4, 6, 5, 3), -- 5  Science

-- === PERIOD 2 (08:55 - 09:40) ===
(1, '2023-10-16', 2, 1, 6, 5, 3), -- 4A Science (Swaps to Lab)
(1, '2023-10-16', 2, 2, 2, 1, 2), -- 4B Math
(1, '2023-10-16', 2, 4, 5, 4, 5), -- 5  Gym

-- === PERIOD 3 (10:00 - 10:45) ===
(1, '2023-10-16', 3, 1, 4, 3, 4), -- 4A Music
(1, '2023-10-16', 3, 2, 5, 4, 5), -- 4B Gym
(1, '2023-10-16', 3, 4, 3, 2, 1), -- 5  History

-- === PERIOD 4 (11:35 - 12:20) ===
(1, '2023-10-16', 4, 1, 3, 2, 1), -- 4A History
(1, '2023-10-16', 4, 2, 6, 5, 3), -- 4B Science
(1, '2023-10-16', 4, 4, 2, 1, 2);
-- 5  Math

-- ==========================================
-- 9. ADD HOLIDAYS
-- ==========================================
INSERT INTO SchoolHolidays (school_id, name, start_date, end_date)
VALUES
-- Springfield High Holidays
(1, 'Spring Break', '2023-10-23', '2023-10-27'),       -- A full week off
(1, 'Founder\'s Day', '2023-11-10', '2023-11-10'),     -- Single day off
(1, 'Winter Break', '2023-12-20', '2024-01-05'),       -- Long break

-- Future Tech Academy Holidays
(2, 'Server Maintenance', '2023-11-01', '2023-11-01'), -- Single day
(2, 'Upgrade Week', '2023-12-01', '2023-12-07'); -- Week off