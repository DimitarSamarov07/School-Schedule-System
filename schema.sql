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
('Георги', 'Густинов'),
('Мариана', 'Димитрова-Евстатиева'),
('Нели', 'Нинова'),
('Дафинка', 'Стоилова'),
('Кремена', 'Иванова'),
('Атанас', 'Костов'),
('Лилия', 'Думбалакова'),
('Богдана', 'Адаму'),
('Росен', 'Герасимов'),
('Йордан', 'Раднев'),
('Валентин', 'Георгиев'),
('Жана', 'Сиракова'),
('Сияна', 'Танева'),
('Станимир', 'Ламбов'),
('Петър', 'Гюдженов'),
('Рени', 'Иванова'),
('Мариана', 'Джонгарова'),
('Ваня', 'Парашкевова'),
('Видка', 'Делчева'),
('Емел', 'Мурад'),
('Гинка', 'Попова');

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
    ('Български език и литература - ООП',
    (SELECT id FROM Teachers WHERE FirstName = 'Гинка' and LastName = 'Попова'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ('Руски език',
    (SELECT id FROM Teachers WHERE FirstName = 'Мариана' and LastName = 'Димитрова-Евстатиева'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ('Математика-ООП',
    (SELECT id FROM Teachers WHERE FirstName = 'Дафинка' and LastName = 'Стоилова'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ('Гражданско образование-ООП',
    (SELECT id FROM Teachers WHERE FirstName = 'Нели' and LastName = 'Нинова'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ('Физическо възпитане и спорт-ООП',
    (SELECT id FROM Teachers WHERE FirstName = 'Лилия' and LastName = 'Думбалакова'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ('Чужд език по професията-ООП',
    (SELECT id FROM Teachers WHERE FirstName = 'Богдана' and LastName = 'Адаму'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ('Спортни дейности(тенис на маса)' ,
    (SELECT id FROM Teachers WHERE FirstName = 'Лилия' and LastName = 'Думбалакова'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ( 'Безопасност на движението',
    (SELECT id FROM Teachers WHERE FirstName = 'Кремена' and LastName = 'Иванова'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 25)),
    ( 'Час на класа',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ( 'Бази данни-ОтПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ( 'Обектно-ориентирано програмиране-ОтПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ( 'Разработка на софтуер-ОтПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Учебна практика-Бази данни-ОтПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Учебна практика-обектно-ориентирано програмиране-ОтПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Учебна практика-Разработка на софтуер-ОтПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ( 'Конкурентно програмиране-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ('Математически основи на програмирането-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ( 'Операционни системи',
    (SELECT id FROM Teachers WHERE FirstName = 'Росен' and LastName = 'Герасимов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ('Програмиране за вградени системи-СПП' ,
    (SELECT id FROM Teachers WHERE FirstName = 'Атанас' and LastName = 'Костов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 23)),
    ( 'Учебна практика-конкурентно програмиране',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Учебна практика-математически основи на програмирането-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Учебна практика-операционни системи-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Росен' and LastName = 'Герасимов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Учебна практика-програмиране на вградени системи-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Росен' and LastName = 'Герасимов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Бази данни-РПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Валентин' and LastName = 'Георгиев'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 24)),
    ( 'Алгоритми и структури от данни-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 24)),
    ( 'Интернет програмиране-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Атанас' and LastName = 'Костов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 24)),
    ( 'Софтуерно инженерство-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Валентин' and LastName = 'Георгиев'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 24)),
    ( 'Учебна практика-Софтуерно инженерство-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Валентин' and LastName = 'Георгиев'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Учебна практика-Алгоритми и структура от данни-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Учебна практика-Интернет програмиране-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Атанас' and LastName = 'Костов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Учебна практика-Функционално програмиране-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Валентин' and LastName = 'Георгиев'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Функционално програмиране-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Валентин' and LastName = 'Георгиев'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 24)),
    ( 'Бази данни-РПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Валентин' and LastName = 'Георгиев'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 24)),
    ( 'Български език и литература-РУ/УП-А',
    (SELECT id FROM Teachers WHERE FirstName = 'Гинка' and LastName = 'Попова'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 24)),
    ( 'Информационни технологии-ООП',
    (SELECT id FROM Teachers WHERE FirstName = 'Станимир' and LastName = 'Ламбов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 22)),
    ( 'История и цивилизации-ОПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Йордан' and LastName = 'Раднев'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 22)),
    ( 'География и икономика-ОПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Нели' and LastName = 'Нинова'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 22)),
    ( 'Биология и здравно образование-ООП',
    (SELECT id FROM Teachers WHERE FirstName = 'Петър' and LastName = 'Гюдженов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 22)),
    ( 'Физика и астрономия-ООП',
    (SELECT id FROM Teachers WHERE FirstName = 'Рени' and LastName = 'Иванова'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 22)),
    ( 'Химия и опазване на околната среда-ООП',
    (SELECT id FROM Teachers WHERE FirstName = 'Мариана' and LastName = 'Джонгарова'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 22)),
    ( 'Философия',
    (SELECT id FROM Teachers WHERE FirstName = 'Нели' and LastName = 'Нинова'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 22)),
    ( 'Здравословни и безопасни условия на труд',
    (SELECT id FROM Teachers WHERE FirstName = 'Видка' and LastName = 'Делчева'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 22)),
    ( 'Програмиране-ОтПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Станимир' and LastName = 'Ламбов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 22)),
    ( 'Учебна практика - Увод в програмирането-ОтПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Атанас' and LastName = 'Костов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Програмиране-РПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Станимир' and LastName = 'Ламбов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 22)),
    ( 'Графични техники-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Емел' and LastName = 'Мурад'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 25)),
    ('Учебна практика-графичен дизайн' ,
    (SELECT id FROM Teachers WHERE FirstName = 'Емел' and LastName = 'Мурад'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Графични техники',
    (SELECT id FROM Teachers WHERE FirstName = 'Емел' and LastName = 'Мурад'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 25)),
    ( 'Английски език',
    (SELECT id FROM Teachers WHERE FirstName = 'Кремена' and LastName = 'Иванова'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 25)),
    ( 'Предприемачество',
    (SELECT id FROM Teachers WHERE FirstName = 'Видка' and LastName = 'Делчева'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 25)),
    ( 'Рисуване',
    (SELECT id FROM Teachers WHERE FirstName = 'Емел' and LastName = 'Мурад'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 25)),
    ( 'Увод в програмирането',
    (SELECT id FROM Teachers WHERE FirstName = 'Атанас' and LastName = 'Костов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 25)),
    ( 'Учебна практика-Увод в програмирането',
    (SELECT id FROM Teachers WHERE FirstName = 'Станимир' and LastName = 'Ламбов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Графични техники-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Емел' and LastName = 'Мурад'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 25)),
    ('Графични техники-РПП' ,
    (SELECT id FROM Teachers WHERE FirstName = 'Станимир' and LastName = 'Ламбов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Програмиране-РПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Станимир' and LastName = 'Ламбов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Икономика',
    (SELECT id FROM Teachers WHERE FirstName = 'Видка' and LastName = 'Делчева'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 11)),
    ( 'Увод в обектно-ориентираното програмиране',
    (SELECT id FROM Teachers WHERE FirstName = 'Атанас' and LastName = 'Костов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 11)),
    ( 'Учебна практика-Програмиране',
    (SELECT id FROM Teachers WHERE FirstName = 'Атанас' and LastName = 'Костов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Учебна практика-увод в обектно-ориентираното програмиране',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Увод в алгоритмите и структура от данни',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 11)),
    ( 'Учебна практика-увод в алгоритмите и структура от данни',
    (SELECT id FROM Teachers WHERE FirstName = 'Георги' and LastName = 'Густинов'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26)),
    ( 'Графичен дизайн',
    (SELECT id FROM Teachers WHERE FirstName = 'Емел' and LastName = 'Мурад'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 22)),
    ( 'Графични техники-СПП',
    (SELECT id FROM Teachers WHERE FirstName = 'Емел' and LastName = 'Мурад'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 22)),
    ( 'Учебна практика-Рисунка, анимация',
    (SELECT id FROM Teachers WHERE FirstName = 'Емел' and LastName = 'Мурад'),
    (SELECT id FROM Rooms WHERE Rooms.Name = 26));

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
('9Б', 'Графичен дизайн'),
('10A', 'Приложно програмиране'),
('11А', 'Приложно програмиране'),
('12А', 'Приложно програмиране');

INSERT INTO Dates (Date, ISHOLIDAY) VALUES
('2025-07-07', 'False'),
('2025-07-08', 'False'),
('2025-07-09', 'False'),
('2025-07-10', 'False'),
('2025-07-11', 'False'),
('2025-07-12', 'True'),
('2025-07-13', 'True'),
('2025-07-14', 'False'),
('2025-07-15', 'True');

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