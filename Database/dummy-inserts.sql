-- ==========================================================
-- DEV SEED DATA SCRIPT
-- RUN THIS AFTER CREATING THE TABLES
-- ==========================================================

-- 1. SCHOOLS
-- ----------------------------------------------------------
INSERT INTO Schools (name, address, work_week_config)
VALUES ('Springfield High', '123 Evergreen Terrace', '[1, 2, 3, 4, 5]'), -- ID 1
       ('Westside Tech', '404 Silicon Valley Blvd', '[1, 2, 3, 4, 5, 6]');
-- ID 2 (Has Saturday classes)

-- 2. USERS
-- ----------------------------------------------------------
-- Only these people can log in to the app
INSERT INTO Users (username, email, password_hash, is_sudo)
VALUES ('super_admin', 'root@system.com', 'hash_root', TRUE),               -- ID 1
       ('principal_skinner', 'skinner@springfield.edu', 'hash_skin', TRUE), -- ID 2
       ('dean_pelton', 'dean@westside.edu', 'hash_dean', FALSE),            -- ID 3
       ('dean_pelton12', 'dean1@westside.edu', 'hash_dean1', FALSE),        -- ID 4
       ('dean_pelton21', 'dean3@westside.edu', 'hash_dean2', FALSE); -- ID 5

INSERT INTO SchoolMembers (school_id, user_id, is_admin)
VALUES (1, 2, 1), -- Skinner manages Springfield
       (2, 3, 1), -- Dean Pelton manages Westside
       (1, 4, 0), -- Standard user for Springfield
       (2, 5, 0);
-- Standard user for Westside

-- 3. TEACHERS (THE STAFF)
-- ----------------------------------------------------------
-- Note: These IDs (1-10) are used in the Schedule table
INSERT INTO Teachers (school_id, name, email)
VALUES
-- Springfield Staff (IDs 1-6)
(1, 'Mrs. Krabappel', 'edna@springfield.edu'),         -- ID 1 (Math)
(1, 'Miss Hoover', 'liz@springfield.edu'),             -- ID 2 (History)
(1, 'Mr. Largo', 'dewey@springfield.edu'),             -- ID 3 (Music)
(1, 'Coach Pommelhorst', 'gym@springfield.edu'),       -- ID 4 (PE)
(1, 'Groundskeeper Willie', 'willie@springfield.edu'), -- ID 5 (Shop)
(1, 'Mr. Bergstrom', 'bergstrom@springfield.edu'),     -- ID 6 (Sub/English)

-- Westside Tech Staff (IDs 7-10)
(2, 'Prof. Frink', 'frink@westside.edu'),              -- ID 7 (Science)
(2, 'Dr. Hibbert', 'hibbert@westside.edu'),            -- ID 8 (Biology)
(2, 'Comic Book Guy', 'cbg@westside.edu'),             -- ID 9 (Computer Sci)
(2, 'Disco Stu', 'stu@westside.edu');
-- ID 10 (Arts)

-- 4. ROOMS
-- ----------------------------------------------------------
INSERT INTO Rooms (school_id, name, floor, capacity)
VALUES
-- Springfield Rooms
(1, 'Room 101 (4th Grade)', 1, 30), -- ID 1
(1, 'Room 102 (2nd Grade)', 1, 30), -- ID 2
(1, 'Music Room', 2, 50),           -- ID 3
(1, 'Gymnasium', 1, 200),           -- ID 4
(1, 'Shop Class (Basement)', 0, 20),-- ID 5
(1, 'Library', 2, 60),              -- ID 6

-- Westside Rooms
(2, 'Lecture Hall A', 1, 100),      -- ID 7
(2, 'Computer Lab', 3, 40),         -- ID 8
(2, 'Robotics Lab', 3, 20);
-- ID 9

-- 5. SUBJECTS
-- ----------------------------------------------------------
INSERT INTO Subjects (school_id, name)
VALUES
-- Springfield
(1, 'Mathematics'),
(1, 'History'),
(1, 'Music'),           -- IDs 1, 2, 3
(1, 'P.E.'),
(1, 'Woodworking'),
(1, 'English'),         -- IDs 4, 5, 6

-- Westside
(2, 'Quantum Physics'),
(2, 'Bio-Engineering'), -- IDs 7, 8
(2, 'Python Programming'),
(2, 'Digital Art');
-- IDs 9, 10

-- 6. CLASSES (GROUPS OF STUDENTS)
-- ----------------------------------------------------------
INSERT INTO Classes (school_id, name, home_room_id, description)
VALUES
-- Springfield
(1, 'Class 4A (Bart)', 1, NULL),                -- ID 1
(1, 'Class 2A (Lisa)', 2, NULL),                -- ID 2
(1, 'Class 5C (Milhouse)', 1, 'Special needs'), -- ID 3 (Shares homeroom with 4A but different time)

-- Westside
(2, 'Cohort Alpha', 7, 'Programming'),          -- ID 4
(2, 'Cohort Beta', 8, NULL);
-- ID 5

-- 7. PERIODS (BELL SCHEDULE)
-- ----------------------------------------------------------
INSERT INTO Periods (school_id, name, start_time, end_time)
VALUES
-- Springfield (Standard Day)
(1, 'Homeroom', '08:00', '08:30'),      -- ID 1
(1, 'Period 1', '08:35', '09:25'),      -- ID 2
(1, 'Period 2', '09:30', '10:20'),      -- ID 3
(1, 'Lunch', '12:00', '13:00'),         -- ID 4
(1, 'Period 3', '13:00', '13:50'),      -- ID 5

-- Westside (Block Schedule)
(2, 'Morning Block', '09:00', '11:00'), -- ID 6
(2, 'Afternoon Block', '13:00', '15:00');
-- ID 7

-- 8. HOLIDAYS
-- ----------------------------------------------------------
INSERT INTO SchoolHolidays (school_id, name, start_date, end_date)
VALUES (1, 'Spring Break', '2023-04-10', '2023-04-14'),
       (1, 'Snow Day', '2023-01-15', '2023-01-15'),
       (2, 'Hackathon Week', '2023-05-01', '2023-05-05');

-- 9. THE SCHEDULE (HEAVY LOAD)
-- ----------------------------------------------------------
-- Target Date: Monday, 2023-10-16
-- Target Date: Tuesday, 2023-10-17

INSERT INTO Schedule (school_id, date, period_id, class_id, teacher_id, subject_id, room_id)
VALUES

-- =============================================
-- SPRINGFIELD HIGH - MONDAY (2023-10-16)
-- =============================================

-- PERIOD 1 (08:35 - 09:25) --
-- Class 4A: Math with Krabappel in Room 101
(1, '2023-10-16', 2, 1, 1, 1, 1),
-- Class 2A: History with Hoover in Room 102
(1, '2023-10-16', 2, 2, 2, 2, 2),
-- Class 5C: Shop with Willie in Basement
(1, '2023-10-16', 2, 3, 5, 5, 5),

-- PERIOD 2 (09:30 - 10:20) --
-- Class 4A: Goes to Music (Room swap!)
(1, '2023-10-16', 3, 1, 3, 3, 3),
-- Class 2A: Goes to Math (Teacher swap! Krabappel teaches 2A now)
(1, '2023-10-16', 3, 2, 1, 1, 1),
-- Class 5C: English with Bergstrom in Library
(1, '2023-10-16', 3, 3, 6, 6, 6),

-- PERIOD 3 (13:00 - 13:50) --
-- Class 4A: Gym (Large capacity room)
(1, '2023-10-16', 5, 1, 4, 4, 4),
-- Class 2A: Shop
(1, '2023-10-16', 5, 2, 5, 5, 5),
-- Class 5C: Math with Krabappel (She is busy again)
(1, '2023-10-16', 5, 3, 1, 1, 1),

-- =============================================
-- SPRINGFIELD HIGH - TUESDAY (2023-10-17)
-- =============================================
-- (Different pattern to test date filtering)

-- PERIOD 1 --
-- Class 4A: History instead of Math today
(1, '2023-10-17', 2, 1, 2, 2, 2),
-- Class 2A: Music
(1, '2023-10-17', 2, 2, 3, 3, 3),

-- =============================================
-- WESTSIDE TECH - MONDAY (2023-10-16)
-- =============================================

-- MORNING BLOCK (09:00 - 11:00) --
-- Cohort Alpha: Python with Comic Book Guy in Computer Lab
(2, '2023-10-16', 6, 4, 9, 9, 8),
-- Cohort Beta: Quantum Physics with Frink in Lecture Hall
(2, '2023-10-16', 6, 5, 7, 7, 7),

-- AFTERNOON BLOCK (13:00 - 15:00) --
-- Cohort Alpha: Swaps to Robotics Lab for Bio-Engineering
(2, '2023-10-16', 7, 4, 8, 8, 9),
-- Cohort Beta: Goes to Digital Art with Stu
(2, '2023-10-16', 7, 5, 10, 10, 8);