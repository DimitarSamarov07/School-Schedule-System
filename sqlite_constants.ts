// TODO: SQLite query strings go here

class SqliteConstants {
    static readonly SELECT_SCHEDULES_FOR_DATE = `
        SELECT c.id           as 'courseId',
               c.Name         as 'courseName',
               t.id           as 'teacherId',
               t.FirstName    as 'firstName',
               t.LastName     as 'lastName',
               cl.Name        as 'className',
               cl.Description as 'classDesc',
               d.id           as 'dateId',
               d.Date         as 'date',
               d.IsHoliday    as 'isHoliday',
               r.id           as 'roomId',
               r.Name         as 'roomName',
               r.Floor        as 'floor',
               ti.id          as 'timeId',
               ti.Start       as 'startTime',
               ti.End         as 'endTime'

        FROM Schedule
                 JOIN Dates d on D.id = Schedule.D_id
                 JOIN Classes cl on Schedule.Class = cl.id
                 JOIN Courses c on c.id = Schedule.Course
                 JOIN Teachers t on t.id = Schedule.T_id
                 JOIN Rooms r on r.id = c.Room
                 JOIN Times ti on ti.id = Schedule.T_id
        WHERE strftime('%s', d.Date) = strftime('%s', (?));
        `;
    //YYYY.MM.DD


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
        WHERE strftime('%s', d.Date) = strftime('%s', ?) AND cl.Class = classID;       
        `;

    static readonly SELECT_ALL_TIMES = `
    SELECT id, Start, End FROM Times
    `
}

export default SqliteConstants;