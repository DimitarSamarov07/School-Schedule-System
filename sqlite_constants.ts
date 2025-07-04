// TODO: SQLite query strings go here

class SqliteConstants {
    static readonly SELECT_SCHEDULES_FOR_DATE = `
        SELECT cl.Name as 'className', c.Name as 'courseName', CONCAT(t.FirstName, ' ', t.LastName) as 'fullTeacherName', r.Name as 'roomNumber', r.Floor as 'floor'
        FROM Schedule
                 JOIN Dates d on D.id = Schedule.D_ID
                 JOIN Classes cl on Schedule.Class = cl.id
                 JOIN Courses c on c.id = Schedule.Course
                 JOIN Teachers t on t.id = Schedule.T_ID
                 JOIN Rooms r on r.id = c.Room
        WHERE strftime('%s', d.Date) = strftime('%s', ?);
        `;

    static readonly SELECT_BELL_BY_NAME =
        `SELECT Id, Name, SoundPath
         FROM Bells
         WHERE Name = (?)
         LIMIT 1;`

    static readonly SELECT_SCHEDULES_BY_CLASS_ID_FOR_DATE = `
        SELECT cl.Name as 'className', c.Name as 'courseName', CONCAT(t.FirstName, ' ', t.LastName) as 'fullTeacherName', r.Name as 'roomNumber', r.Floor as 'floor'
        FROM Schedule
                 JOIN Dates d on D.id = Schedule.D_ID
                 JOIN Classes cl on Schedule.Class = cl.id
                 JOIN Courses c on c.id = Schedule.Course
                 JOIN Teachers t on t.id = Schedule.T_ID
                 JOIN Rooms r on r.id = c.Room
        WHERE strftime('%s', d.Date) = strftime('%s', ?) && cl.Class = classID;       
        `;
}

export default SqliteConstants;