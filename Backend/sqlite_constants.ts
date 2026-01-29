class SqliteConstants {
    static readonly BASE_SCHEDULE_QUERY = `
        SELECT sub.id                                                   AS 'subjectId',
               sub.name                                                 AS 'subjectName',

               t.id                                                     AS 'teacherId',
               t.name                                                   AS 'teacherName',

               c.id                                                     AS 'classId',
               c.name                                                   AS 'className',

               sch.id                                                   AS 'scheduleId',
               sch.date                                                 AS 'date',
               (SELECT COUNT(*)
                FROM SchoolHolidays h
                WHERE h.school_id = sch.school_id
                  AND sch.date BETWEEN h.start_date AND h.end_date) > 0 AS 'isHoliday',

               r.id                                                     AS 'roomId',
               r.name                                                   AS 'roomName',
               r.floor                                                  AS 'floor',

               p.id                                                     AS 'timeId',
               p.name                                                   AS 'periodName',
               p.start_time                                             AS 'startTime',
               p.end_time                                               AS 'endTime'

        FROM Schedule sch
                 JOIN Subjects sub ON sch.subject_id = sub.id
                 JOIN Teachers t ON sch.teacher_id = t.id
                 JOIN Classes c ON sch.class_id = c.id
                 JOIN Rooms r ON sch.room_id = r.id
                 JOIN Periods p ON sch.period_id = p.id

        WHERE sch.school_id = (?)
    `;

    static readonly SELECT_SCHEDULES_FOR_DATE = `${this.BASE_SCHEDULE_QUERY} AND sch.Date = (?) `;

    static readonly SELECT_SCHEDULES_FOR_DATE_AND_SUBJECT_ID = `${this.BASE_SCHEDULE_QUERY} AND sch.date = (?) AND sub.id = (?) `

    static readonly SELECT_BREAKS = `SELECT id, end_time as 'Start', LEAD(start_time) over (ORDER BY id) as 'End'
                                     from Periods `
    static readonly SELECT_SCHEDULES_BY_DATE_AND_TIME = `${this.BASE_SCHEDULE_QUERY} WHERE sch.date = (?) and (?) BETWEEN p.start_time AND p.end_time`

    static readonly SELECT_PERIODS_BY_SCHOOL = `SELECT name,start_time,end_time FROM Periods WHERE school_id = (?);`
    static readonly SELECT_ROOMS_BY_SCHOOL = `SELECT id,name,floor,capacity FROM Rooms WHERE school_id = (?);`

    static readonly SELECT_ALL_TEACHERS = `SELECT *FROM Teachers`
    static readonly SELECT_ALL_CLASSES = `SELECT *FROM Classes`

    //INSERT queries

    static readonly INSERT_INTO_TEACHERS = `INSERT INTO Teachers(school_id, name, email)
                                            VALUES ((?), (?), (?))
                                            RETURNING id;`

    static readonly INSERT_INTO_CLASSES = `INSERT INTO Classes(school_id, name, home_room_id)
                                           VALUES ((?), (?), (?))
                                           RETURNING id;`

    static readonly INSERT_INTO_PERIODS = `INSERT INTO Periods(school_id, name, start_time, end_time)
                                           VALUES ((?), (?), (?), (?))
                                           RETURNING id;`

    static readonly INSERT_INTO_SUBJECTS = `INSERT INTO Subjects(school_id, name, description)
                                            VALUES ((?), (?), (?))
                                            RETURNING id;`

    static readonly INSERT_INTO_SCHEDULE = `INSERT INTO Schedule(school_id, date, period_id, class_id, teacher_id, subject_id, room_id)
                                            VALUES ((?), (?), (?), (?), (?), (?), (?));`

    static readonly INSERT_INTO_ROOMS = `INSERT INTO Rooms(school_id, name, floor, capacity)
                                         VALUES ((?), (?), (?), (?))
                                         RETURNING id;`

    //DELETE queries

    static readonly DELETE_FROM_CLASSES = `DELETE
                                           FROM Classes
                                           WHERE id = (?)
                                           RETURNING id;`

    static readonly DELETE_FROM_TEACHERS = `DELETE
                                            FROM Teachers
                                            WHERE id = (?)
                                            RETURNING id;`

    static readonly DELETE_FROM_SUBJECTS = `DELETE
                                            FROM Subjects
                                            WHERE id = (?)
                                            RETURNING id;`

    static readonly DELETE_FROM_ROOMS = `DELETE
                                         FROM Rooms
                                         WHERE id = (?)
                                         RETURNING id;`

    static readonly DELETE_FROM_SCHEDULES = `DELETE
                                             FROM Schedule
                                             WHERE id = (?)
                                             RETURNING id;`

    static readonly DELETE_FROM_PERIODS = `DELETE
                                           FROM Periods
                                           WHERE id = (?)
                                           RETURNING id;`

    //UPDATE queries

    static readonly UPDATE_COURSE = `UPDATE Subjects
                                     SET name        = COALESCE((?), name),
                                         description = COALESCE((?), description)
                                     WHERE id = (?)`;

    static readonly UPDATE_TEACHER = `UPDATE Teachers
                                      SET name  = COALESCE((?), name),
                                          email = COALESCE((?), email)
                                      WHERE id = (?)`

    static readonly UPDATE_PERIOD = `UPDATE Periods
                                     SET name       = COALESCE((?), name),
                                         start_time = COALESCE((?), start_time),
                                         end_time   = COALESCE((?), end_time)

                                     WHERE id = (?)`;

    static readonly UPDATE_ROOM = `UPDATE Rooms
                                   SET name     = COALESCE((?), name),
                                       floor    = COALESCE((?), floor),
                                       capacity = COALESCE((?), capacity)
                                   WHERE id = (?)`;


    static readonly UPDATE_CLASS = `UPDATE Classes
                                    SET name         = COALESCE((?), Name),
                                        home_room_id = COALESCE((?), home_room_id)
                                    WHERE id = (?)`;

    static readonly UPDATE_SCHEDULE = `UPDATE Schedule
                                       SET subject_id = COALESCE((?), subject_id),
                                           class_id   = COALESCE((?), class_id),
                                           teacher_id = COALESCE((?), teacher_id),
                                           period_id  = COALESCE((?), period_id)
                                       WHERE id = (?)`;


    static readonly CREATE_USER =
        `INSERT INTO Users(username, email, password_hash)
         VALUES ((?), (?), (?));`

    static readonly UPDATE_USER_PASS =
        `UPDATE Users
         SET password_hash = COALESCE((?), password_hash)
         WHERE username = (?)
           AND password_hash = (?);`

    static readonly UPDATE_USER_EMAIL =
        `UPDATE Users
         SET email = COALESCE((?), email)
         WHERE username = (?)
           AND password_hash = (?);
        `

    static readonly DELETE_USER =
        `DELETE
         FROM Users
         WHERE username = (?)
           AND password_hash = (?)
;`

    static readonly CHECK_ADMIN_CREDENTIALS =
        `SELECT password_hash
         FROM Users
         WHERE username = (?)
         LIMIT 1; `

}

export default SqliteConstants;