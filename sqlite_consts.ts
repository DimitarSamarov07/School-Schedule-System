// TODO: SQLite query strings go here

class Sqlite_consts {
    static readonly SELECT_SCHEDULES_FOR_DATE =
        `SELECT cl.Name as 'className', c.Name as 'courseName', CONCAT(t.FName, ' ', t.LName) as 'fullTeacherName', r.Name as 'roomNumber', r.Floor as 'floor'
         FROM Schedule
                  JOIN Dates d on D.D_ID = Schedule.D_ID
                  JOIN Classes cl on Schedule.Class = cl.C_ID
                  JOIN Courses c on c.C_ID = Schedule.Course
                  JOIN Teachers t on t.T_ID = Schedule.T_ID
                  JOIN Rooms r on r.R_ID = c.Room
         WHERE d.Date = unixepoch(?);`;

    static readonly SELECT_BELL_BY_NAME =
        `SELECT Id, Name, SoundPath
         FROM Bells
         WHERE Name = (?)
         LIMIT 1;`
}

export default Sqlite_consts;