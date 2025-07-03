PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Teachers (
    T_ID INTEGER PRIMARY KEY,
    FName VARCHAR(25),
    LName VARCHAR(25)
);

CREATE TABLE IF NOT EXISTS Rooms (
    R_ID INTEGER PRIMARY KEY,
    Name VARCHAR(50),
    Floor INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Courses (
    C_ID INTEGER PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Teacher INTEGER,
    Room INTEGER,
    FOREIGN KEY (Teacher) REFERENCES Teachers(T_ID),
    FOREIGN KEY (Room) REFERENCES Rooms(R_ID)
);

CREATE TABLE IF NOT EXISTS Classes (
	C_ID INTEGER PRIMARY KEY,
	Name VARCHAR(50) NOT NULL,
	Description VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Times (
	T_ID INTEGER PRIMARY KEY,
	Start TIME NOT NULL,
	End TIME
);

CREATE TABLE IF NOT EXISTS Dates (
	D_ID INTEGER PRIMARY KEY,
	Date TEXT NOT NULL,
	IsHoliday BOOLEAN
);

CREATE TABLE IF NOT EXISTS Schedule (
    Course INTEGER,
    Class INTEGER,
    T_ID INTEGER,
    D_ID INTEGER,
    FOREIGN KEY (Course) REFERENCES Courses(C_ID),
    FOREIGN KEY (Class) REFERENCES Classes(C_ID),
    FOREIGN KEY (T_ID) REFERENCES Times(T_ID),
    FOREIGN KEY (D_ID) REFERENCES Dates(D_ID),
    PRIMARY KEY (Course, Class, T_ID)
);

CREATE TABLE IF NOT EXISTS Advertising (
    A_ID INTEGER PRIMARY KEY,
    Content TEXT,
    ImagePath TEXT
);

CREATE TABLE IF NOT EXISTS Bells (
    B_ID INTEGER PRIMARY KEY,
    Name VARCHAR(20),
    SoundPath TEXT
);

INSERT INTO Teachers (FName, LName) VALUES
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
    ('11-03-2025', FALSE),
    ('24-04-2025', TRUE);

INSERT INTO Rooms (Name, Floor) VALUES
    ('21', 2),
    ('10', 1);

/*
SELECT * FROM Teachers;
SELECT * FROM Courses;
SELECT * FROM Rooms;
SELECT * FROM Times;
SELECT * FROM Schedule;
SELECT * FROM Dates;
SELECT * FROM Classes;
SELECT * FROM Advertising;
SELECT * FROM Bells;
*/