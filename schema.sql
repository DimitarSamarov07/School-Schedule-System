PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Teachers (
    T_ID INTEGER PRIMARY KEY,
    FName varchar(25),
    LName varchar(25)
);

CREATE TABLE IF NOT EXISTS Rooms (
    R_ID INTEGER PRIMARY KEY,
    Name varchar(50) NOT NULL,
    Floor int NOT NULL
);

CREATE TABLE IF NOT EXISTS Courses (
    C_ID INTEGER PRIMARY KEY,
    Name varchar(50) NOT NULL,
    Teacher INTEGER,
    Room INTEGER,
    FOREIGN KEY (Teacher) REFERENCES Teachers(T_ID),
    FOREIGN KEY (Room) REFERENCES Rooms(R_ID)
);
