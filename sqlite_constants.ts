// TODO: SQLite query strings go here

class SqliteConstants {
    static readonly BASE_SCHEDULE_QUERY = `
        SELECT c.id           as 'courseId',
               c.Name         as 'courseName',
               t.id           as 'teacherId',
               t.FirstName    as 'firstName',
               t.LastName     as 'lastName',
               cl.id          as 'classId',
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
    `;//YYYY.MM.DD

    static readonly SELECT_SCHEDULES_FOR_DATE = `${this.BASE_SCHEDULE_QUERY} WHERE d.Date = (?);`;

    static readonly SELECT_SCHEDULES_FOR_DATE_AND_CLASS_ID = `${this.BASE_SCHEDULE_QUERY} WHERE d.date = (?) AND cl.id = (?)`

    static readonly SELECT_BELL_BY_NAME =
        `SELECT Id, Name, SoundPath
         FROM Bells
         WHERE Name = (?)
         LIMIT 1;`

    static readonly SELECT_ALL_TIMES = `
    SELECT id, Start, End FROM Times
    `
}

export default SqliteConstants;