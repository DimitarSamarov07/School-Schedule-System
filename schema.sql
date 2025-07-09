PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS Schedule;
DROP TABLE IF EXISTS Dates;
DROP TABLE IF EXISTS Times;
DROP TABLE IF EXISTS Classes;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Rooms;
DROP TABLE IF EXISTS Teachers;
DROP TABLE IF EXISTS Advertising;
DROP TABLE IF EXISTS Bells;
DROP TABLE IF EXISTS Admins;

CREATE TABLE IF NOT EXISTS Teachers (
    id INTEGER PRIMARY KEY,
    FirstName VARCHAR(25) NOT NULL,
    LastName VARCHAR(25) NOT NULL
);

CREATE TABLE IF NOT EXISTS Rooms (
    id INTEGER PRIMARY KEY,
    Name VARCHAR(50),
    Floor INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Courses (
    id INTEGER PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Teacher INTEGER NOT NULL,
    Room INTEGER NOT NULL,
    FOREIGN KEY (Teacher) REFERENCES Teachers(id),
    FOREIGN KEY (Room) REFERENCES Rooms(id)
);

CREATE TABLE IF NOT EXISTS Classes (
	id INTEGER PRIMARY KEY,
	Name VARCHAR(50) NOT NULL,
	Description VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Times (
	id INTEGER PRIMARY KEY,
	Start TIME NOT NULL,
	End TIME NOT NULL
);

CREATE TABLE IF NOT EXISTS Dates (
	id INTEGER PRIMARY KEY,
	Date TEXT NOT NULL,
	IsHoliday BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS Schedule (
    Course INTEGER NOT NULL,
    Class INTEGER NOT NULL,
    T_id INTEGER NOT NULL,
    D_id INTEGER NOT NULL,
    FOREIGN KEY (Course) REFERENCES Courses(id),
    FOREIGN KEY (Class) REFERENCES Classes(id),
    FOREIGN KEY (T_id) REFERENCES Times(id) ,
    FOREIGN KEY (D_id) REFERENCES Dates(id),
    PRIMARY KEY (Course, Class, T_id)
);

CREATE TABLE IF NOT EXISTS Advertising (
    id INTEGER PRIMARY KEY,
    Content TEXT,
    ImagePath TEXT
);

CREATE TABLE IF NOT EXISTS Bells (
    id INTEGER PRIMARY KEY,
    Name VARCHAR(20),
    SoundPath TEXT
);

CREATE TABLE IF NOT EXISTS Admins (
	id INTEGER PRIMARY KEY,
	User VARCHAR(20) NOT NULL,
	Pass VARCHAR(20) NOT NULL
);

INSERT INTO Teachers (FirstName, LastName) VALUES
    ('Абена', 'Денкова'),
    ('Бояна', 'Костадинова'),
    ('Нели', 'Стоилова'),
    ('Верка', 'Стоянова'),
    ('Атанас', 'Петков');

INSERT INTO Rooms (Name, Floor) VALUES
    ('25', 2),
    ('22', 2),
    ('21', 2),
    ('11', 1),
    ('23', 2),
    ('24', 2),
    ('26', 2),
    ('27', 2);

INSERT INTO Courses(Name, Teacher, Room) VALUES
    (
        'Български език и литература',
        0,
        5
    ),
    (
        'Руски език',
        1,
        5
    ),
    (
        'Математика',
        2,
        3
    ),
    (
        'Гражданско образование',
        3,
        2
    ),
    (
        'Физическо възпитане и спорт',
        0,
        2
    ),
    (
        'Чужд език по професията',
        1,
        4
    );

INSERT INTO Times (Start, End) VALUES
    ('8:00', '8:45'),
    ('8:55', '9:40'),
    ('9:50', '10:35'),
    ('10:55', '11:40'),
    ('11:50', '12:35'),
    ('12:45', '13:30'),
    ('13:40', '14:25');

INSERT INTO Classes (Name, Description) VALUES
    ('8A', 'Приложно програмиране'),
    ('9А', 'Приложно програмиране'),
    ('9Б', 'Изкуствен интелект'),
    ('10A', 'Приложно програмиране'),
    ('11А', 'Приложно програмиране'),
    ('12А', 'Приложно програмиране');

INSERT INTO Dates (Date, IsHoliday) VALUES
    ('2025-07-07', false),
    ('2025-07-08', false),
    ('2025-07-09', false),
    ('2025-07-10', false),
    ('2025-07-11', false),
    ('2025-07-12', true),
    ('2025-07-13', true),
    ('2025-07-14', false),
    ('2025-07-15', true);

INSERT INTO Schedule (Course, Class, T_id, D_id) VALUES
    (1, 1, 1, 1),
    (2, 2, 1, 1);

INSERT INTO Advertising (Content, ImagePath) VALUES
    ('Текст на реклама', './add_banner.png');

INSERT INTO Bells (Name, SoundPath) VALUES
    ('Звънец', './bell.mp3');

INSERT INTO Admins (User , Pass) VALUES
    ('admin@gmail.com', 'admin1');

SELECT * FROM Teachers;
SELECT * FROM Courses;
SELECT * FROM Rooms;
SELECT * FROM Times;
SELECT * FROM Schedule;
SELECT * FROM Dates;
SELECT * FROM Classes;
SELECT * FROM Advertising;
SELECT * FROM Bells;
SELECT * FROM Admins;
