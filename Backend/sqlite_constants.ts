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

    static readonly SELECT_SCHEDULES_FOR_DATE = `${this.BASE_SCHEDULE_QUERY} WHERE d.Date = (?) AND IsHoliday = 0;`;

    static readonly SELECT_SCHEDULES_FOR_DATE_AND_CLASS_ID = `${this.BASE_SCHEDULE_QUERY} WHERE d.date = (?) AND cl.id = (?) AND IsHoliday = 0`

    static readonly SELECT_BREAKS = `SELECT id, END as 'Start', LEAD(Start) over (ORDER BY id) as 'End'
                                     from Times `
    static readonly SELECT_SCHEDULES_BY_DATE_AND_TIME = `${this.BASE_SCHEDULE_QUERY} WHERE d.date = (?) and (?) BETWEEN ti.Start AND ti.End AND IsHoliday = 0`
    static readonly SELECT_BELL_BY_NAME =
        `SELECT Id, Name, SoundPath
         FROM Bells
         WHERE Name = (?)
         LIMIT 1;`

    static readonly SELECT_ALL_TIMES = `
    SELECT id, Start, End FROM Times
    `

    //INSERT queries

    static readonly INSERT_INTO_TEACHERS = `INSERT INTO Teachers(FirstName, LastName)
                                            VALUES ((?), (?))
                                            RETURNING id;`

    static readonly INSERT_INTO_CLASSES = `INSERT INTO Classes(Name, Description)
                                           VALUES ((?), (?))
                                           RETURNING id;`

    static readonly INSERT_INTO_TIMES = `INSERT INTO Times(Start, End)
                                         VALUES ((?), (?))
                                         RETURNING id;`

    static readonly INSERT_INTO_COURSES = `INSERT INTO Courses(Name, Teacher, Room)
                                           VALUES ((?), (?), (?))
                                           RETURNING id;`

    static readonly INSERT_INTO_DATES = `INSERT INTO Dates(Date, IsHoliday)
                                         VALUES ((?), (?))
                                         RETURNING id;`

    static readonly INSERT_INTO_SCHEDULE = `INSERT INTO Schedule(Course, Class, T_id, D_id)
                                            VALUES ((?), (?), (?), (?));`

    static readonly INSERT_INTO_ROOMS = `INSERT INTO Rooms(Name, Floor)
                                         VALUES ((?), (?))
                                         RETURNING id;`

    //DELETE queries

    static readonly DELETE_FROM_CLASSES = `DELETE
                                           FROM Classes
                                           WHERE id = (?);`

    static readonly DELETE_FROM_DATES = `DELETE
                                         FROM Dates
                                         WHERE id = (?);`

    static readonly DELETE_FROM_TEACHERS = `DELETE
                                            FROM Teachers
                                            WHERE id = (?);`

    static readonly DELETE_FROM_COURSES = `DELETE
                                           FROM Courses
                                           WHERE id = (?);`

    static readonly DELETE_FROM_ROOMS = `DELETE
                                         FROM Rooms
                                         WHERE id = (?);`

    static readonly DELETE_FROM_ADVERTISING = `DELETE
                                               FROM Advertising
                                               WHERE id = (?);`

    static readonly DELETE_FROM_BELLS = `DELETE
                                         FROM Bells
                                         WHERE id = (?);`

    static readonly DELETE_FROM_SCHEDULE = `DELETE
                                            FROM Schedule
                                            WHERE (Course, Class, T_id) = ((?), (?), (?));`

    static readonly DELETE_FROM_TIMES = `DELETE
                                         FROM Times
                                         WHERE id = (?);`
}

export default SqliteConstants;