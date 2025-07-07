PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Teachers (
    id INTEGER PRIMARY KEY,
    FirstName VARCHAR(25),
    LastName VARCHAR(25)
);

CREATE TABLE IF NOT EXISTS Rooms (
    id INTEGER PRIMARY KEY,
    Name VARCHAR(50),
    Floor INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Courses (
    id INTEGER PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Teacher INTEGER,
    Room INTEGER,
    FOREIGN KEY (Teacher) REFERENCES Teachers(id),
    FOREIGN KEY (Room) REFERENCES Rooms(id)
);

CREATE TABLE IF NOT EXISTS Classes (
	id INTEGER PRIMARY KEY,
	Name VARCHAR(50) NOT NULL,
	Description VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Times (
	id INTEGER PRIMARY KEY,
	Start TIME NOT NULL,
	End TIME
);

CREATE TABLE IF NOT EXISTS Dates (
	id INTEGER PRIMARY KEY,
	Date TEXT NOT NULL,
	IsHoliday BOOLEAN
);

CREATE TABLE IF NOT EXISTS Schedule (
    Course INTEGER,
    Class INTEGER,
    T_id INTEGER,
    D_id INTEGER,
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
	id INTEGER,
	User VARCHAR(20),
	Pass VARCHAR(20)
);

INSERT INTO Teachers (FirstName, LastName) VALUES
    ('Иван','Добрев'),
    ('Христо','Георгиев');

INSERT INTO Courses (Name) VALUES
    ('Български език и литература - ООП'),
    ('Руски език');

INSERT INTO Times (Start, End) VALUES
    ('8:00', '8:45'),
    ('8:55', '9:40'),
    ('9:50', '10:35'),
    ('10:55', '11:40'),
    ('11:50','12:35'),
    ('12:45', '13:30'),
    ('13:40', '14:25');

INSERT INTO Classes (Name, Description) VALUES
    ('8A','Приложно програмиране'),
    ('9А','Приложно програмиране'),
    ('9Б','Графичен дизайн');

INSERT INTO Dates (Date, IsHoliday) VALUES
    ('2025-07-03', FALSE),
    ('2025-07-04', TRUE);

INSERT INTO Rooms (Name, Floor) VALUES
    ('21', 2),
    ('10', 1);

INSERT OR REPLACE INTO Schedule(Course, Class, T_id, D_ID) VALUES
    (1, 1, 1, 1),
    (2, 2, 2, 2);

INSERT INTO Advertising(Content, ImagePath) VALUES
    ('Текст на реклама', './add_banner.png');

INSERT INTO Bells(Name, SoundPath) VALUES
    ('Звънец', './bell.mp3');

INSERT INTO Admins(User,Pass) VALUES
('admin@gmail.com','admin1')

/*
SELECT * FROM Teachers;
SELECT * FROM Courses;
SELECT * FROM Rooms;
SELECT * FROM Times;
SELECT * FROM Schedule;
SELECT * FROM Dates;
SELECT * FROM Classes;
*SELECT * FROM Advertising;
*SELECT * FROM Bells;
*/
