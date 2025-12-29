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

    static readonly SELECT_SCHEDULES_FOR_DATE = `${this.BASE_SCHEDULE_QUERY} WHERE d.Date = (?) `;

    static readonly SELECT_SCHEDULES_FOR_DATE_AND_CLASS_ID = `${this.BASE_SCHEDULE_QUERY} WHERE d.date = (?) AND cl.id = (?) `

    static readonly SELECT_BREAKS = `SELECT id, END as 'Start', LEAD(Start) over (ORDER BY id) as 'End'
                                     from Times `
    static readonly SELECT_SCHEDULES_BY_DATE_AND_TIME = `${this.BASE_SCHEDULE_QUERY} WHERE d.date = (?) and (?) BETWEEN ti.Start AND ti.End`
    static readonly SELECT_BELL_BY_NAME =
        `SELECT Id, Name, SoundPath
         FROM Bells
         WHERE Name = (?)
         LIMIT 1;`

    static readonly SELECT_ALL_TIMES = `
        SELECT id, Start, End
        FROM Times
    `

    static readonly SELECT_DATE_BY_DATE = `
        SELECT id, Date, IsHoliday
        FROM Dates
        WHERE Date = (?)
        LIMIT 1;
    `
    static readonly SELECT_ALL_ADVERTISEMENTS = `SELECT *FROM Advertising`
    static readonly SELECT_ALL_TEACHERS = `SELECT *FROM Teachers`
    static readonly SELECT_ALL_CLASSES = `SELECT *FROM Classes`

    static readonly SELECT_ALL_ROOMS = `SELECT *FROM Rooms`
    static readonly SELECT_ALL_DATES = `SELECT *FROM Dates`

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
                                           WHERE id = (?)
                                           RETURNING id;`

    static readonly DELETE_FROM_DATES = `DELETE
                                         FROM Dates
                                         WHERE id = (?)
                                         RETURNING id;`

    static readonly DELETE_FROM_TEACHERS = `DELETE
                                            FROM Teachers
                                            WHERE id = (?)
                                            RETURNING id;`

    static readonly DELETE_FROM_COURSES = `DELETE
                                           FROM Courses
                                           WHERE id = (?)
                                           RETURNING id;`

    static readonly DELETE_FROM_ROOMS = `DELETE
                                         FROM Rooms
                                         WHERE id = (?)
                                         RETURNING id;`

    static readonly DELETE_FROM_ADVERTISING = `DELETE
                                               FROM Advertising
                                               WHERE id = (?)
                                               RETURNING id;`

    static readonly DELETE_FROM_BELLS = `DELETE
                                         FROM Bells
                                         WHERE id = (?)
                                         RETURNING id;`

    static readonly DELETE_FROM_SCHEDULE = `DELETE
                                            FROM Schedule
                                            WHERE (Course, Class, T_id) = ((?), (?), (?))
                                            RETURNING Class;`

    static readonly DELETE_FROM_TIMES = `DELETE
                                         FROM Times
                                         WHERE id = (?)
                                         RETURNING id;`

    //UPDATE queries

    static readonly UPDATE_DATE = `UPDATE Dates
                                   SET Date      = COALESCE((?), Date),
                                       IsHoliday = COALESCE((?), IsHoliday)
                                   WHERE id = (?)
                                   RETURNING *;`
    static readonly UPDATE_COURSE = `UPDATE Courses
                                     SET Name    = COALESCE((?), Name),
                                         Teacher = COALESCE((?), Teacher),
                                         Room    = COALESCE((?), Room)
                                     WHERE id = (?)
                                     RETURNING *;`

    static readonly UPDATE_TEACHER = `UPDATE Teachers
                                      SET FirstName = COALESCE((?), FirstName),
                                          LastName  = COALESCE((?), LastName)
                                      WHERE id = (?)
                                      RETURNING *;`
    static readonly UPDATE_TIME = `UPDATE Times
                                   SET Start = COALESCE((?), Start),
                                       End   = COALESCE((?), END)
                                   WHERE id = (?)
                                   RETURNING *;`
    static readonly UPDATE_ROOM = `UPDATE Rooms
                                   SET Name  = COALESCE((?), Name),
                                       Floor = COALESCE((?), Floor)
                                   WHERE id = (?)
                                   RETURNING *;`

    static readonly UPDATE_ADVERTISING = `UPDATE Advertising
                                          SET Content   = COALESCE((?), Content),
                                              ImagePath = COALESCE((?), ImagePath)
                                          WHERE id = (?)
                                          RETURNING *;`

    static readonly UPDATE_BELL = `UPDATE Bells
                                   SET Name      = COALESCE((?), Name),
                                       SoundPath = COALESCE((?), SoundPath)
                                   WHERE id = (?)
                                   RETURNING *;`

    static readonly UPDATE_CLASS = `UPDATE Classes
                                    SET Name        = COALESCE((?), Name),
                                        Description = COALESCE((?), Description)
                                    WHERE id = (?)
                                    RETURNING *;`
    static readonly UPDATE_SCHEDULE = `UPDATE Schedule
                                       SET Course = COALESCE((?), Course),
                                           Class  = COALESCE((?), Class),
                                           T_id   = COALESCE((?), T_id),
                                           D_id   = COALESCE((?), D_id)
                                       WHERE (Course, Class, T_id) = ((?), (?), (?))
                                       RETURNING *;`


    static readonly CREATE_ADMIN =
        `INSERT INTO Admins(User, Email, Pass)
         VALUES ((?), (?), (?));`

    static readonly UPDATE_ADMIN_PASS =
        `UPDATE Admins
         SET Pass = COALESCE((?), Pass)
         WHERE User = (?)
           AND Pass = (?);`

    static readonly UPDATE_ADMIN_EMAIL =
        `UPDATE Admins
         SET Email = COALESCE((?), Email)
         WHERE User = (?)
           AND Pass = (?);
        `

    static readonly DELETE_ADMIN =
        `DELETE
         FROM Admins
         WHERE User = (?)
           AND Pass = (?)
;`

    static readonly CHECK_ADMIN_CREDENTIALS =
        `SELECT Pass
         FROM Admins
         WHERE User = (?)
         LIMIT 1; `

}

export default SqliteConstants;