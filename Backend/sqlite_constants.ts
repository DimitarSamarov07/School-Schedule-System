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

    static readonly INSERT_INTO_BELLS = `INSERT INTO Bells(Name, SoundPath)
                                         VALUES ((?), (?))
                                         RETURNING id;`

    static readonly INSERT_INTO_ADVERTISING = `INSERT INTO Advertising(Content, ImagePath)
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

    static readonly UPDATE_DATE_FROM_ID = ` UPDATE Dates
                                            SET Date = (?)
                                            WHERE id = (?);`
    static readonly UPDATE_ISHOLIDAY_FROM_ID = `UPDATE Dates
                                                SET IsHoliday = (?)
                                                WHERE id = (?);`

    static readonly UPDATE_TEACHER_FIRST_NAME = `UPDATE Teachers
                                                 SET FirstName = (?)
                                                 WHERE id = (?);`
    static readonly UPDATE_TEACHER_LAST_NAME = `UPDATE Teachers
                                                SET LastName = (?)
                                                WHERE id = (?);
    `
    static readonly UPDATE_TIME_START = `UPDATE Times
                                         SET Start = (?)
                                         WHERE id = (?);`

    static readonly UPDATE_TIME_END = `UPDATE
                                           Times
                                       SET End = (?)
                                       WHERE id = (?);`
    static readonly UPDATE_ROOM_NAME = `UPDATE Rooms
                                        SET Name = (?)
                                        WHERE id = (?);`

    static readonly UPDATE_ROOM_FLOOR = `UPDATE Rooms
                                         SET Floor = (?)
                                         WHERE id = (?);`

    static readonly UPDATE_ADVERTISING_CONTENT = `UPDATE Advertising
                                                  SET Content = (?)
                                                  WHERE id = (?);`
    static readonly UPDATE_ADVERTISING_IMAGE_PATH = `    UPDATE Advertising
                                                         SET ImagePath = (?)
                                                         WHERE id = (?);`

    static readonly UPDATE_BELL_NAME = `UPDATE Bells
                                        SET Name = (?)
                                        WHERE id = (?);`
    static readonly UPDATE_BELL_SOUND_PATH = `UPDATE Bells
                                              SET SoundPath = (?)
                                              WHERE id = (?);`

    static readonly UPDATE_CLASS_NAME = `UPDATE Classes
                                         SET Name = (?)
                                         WHERE id = (?);`
    static readonly UPDATE_CLASS_DESCRIPTION = `UPDATE Classes
                                                SET Description = (?)
                                                WHERE id = (?);`
    static readonly UPDATE_SCHEDULE_COURSE = `UPDATE Schedule
                                              SET Course = (?)
                                              WHERE (Course, Class, T_id) = ((?), (?), (?));`
    static readonly UPDATE_SCHEDULE_CLASS = `UPDATE Schedule
                                             SET Class = (?)
                                             WHERE (Course, Class, T_id) = ((?), (?), (?));`
    static readonly UPDATE_SCHEDULE_TIME_ID = `UPDATE Schedule
                                               SET T_id = (?)
                                               WHERE (Course, Class, T_id) = ((?), (?), (?));`

    static readonly UPDATE_SCHEDULE_DATE_ID = `UPDATE Schedule
                                               SET D_id = (?)
                                               WHERE (Course, Class, T_id) = ((?), (?), (?));
    `

}

export default SqliteConstants;