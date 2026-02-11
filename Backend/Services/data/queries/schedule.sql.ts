export default class ScheduleSql {
    static readonly BASE_SCHEDULE_QUERY = `
        SELECT school.id               AS 'schoolId',
               school.name             AS 'schoolName',
               school.address          AS 'schoolAddress',
               school.work_week_config AS 'workWeekConfig',

               sub.id                  AS 'subjectId',
               sub.name                AS 'subjectName',
               sub.description         AS 'description',

               t.id                    AS 'teacherId',
               t.name                  AS 'teacherName',
               t.email                 AS 'teacherEmail',

               c.id                    AS 'classId',
               c.name                  AS 'className',
               c.home_room_id          AS 'homeRoomId',
               c.description           AS 'classDescription',

               r.id                    AS 'roomId',
               r.name                  AS 'roomName',
               r.floor                 AS 'floor',
               r.capacity              AS 'capacity',

               p.id                    AS 'periodId',
               p.name                  AS 'periodName',
               p.start_time            AS 'startTime',
               p.end_time              AS 'endTime',

               s.id                    AS 'scheduleId',
               s.date                  AS 'scheduleDate'
        FROM Schedule s
                 JOIN Schools school ON s.school_id = school.id
                 JOIN Subjects sub ON s.subject_id = sub.id
                 JOIN Teachers t ON s.teacher_id = t.id
                 JOIN Classes c ON s.class_id = c.id
                 JOIN Rooms r ON s.room_id = r.id
                 JOIN Periods p ON s.period_id = p.id
        WHERE s.school_id = (?)
    `;

    static readonly SELECT_SCHEDULES_FOR_DATE = `${this.BASE_SCHEDULE_QUERY} AND s.date = (?) `;
    static readonly SELECT_SCHEDULES_FOR_DATE_FOR_CLASS = `${this.BASE_SCHEDULE_QUERY} AND s.date = (?) AND c.id = (?)`;
    static readonly SELECT_SCHOOL_SCHEDULES_FOR_DATE_INTERVAL = `${this.BASE_SCHEDULE_QUERY} AND s.date BETWEEN (?) AND (?)`;
    static readonly SELECT_SCHEDULES_FOR_DATE_AND_SUBJECT_ID = `${this.BASE_SCHEDULE_QUERY} AND s.date = (?) AND sub.id = (?) `
    static readonly SELECT_SCHEDULES_BY_DATE_AND_TIME_FOR_SCHOOL = `${this.BASE_SCHEDULE_QUERY} AND s.date = (?) AND (?) BETWEEN p.start_time AND p.end_time`


    static readonly INSERT_INTO_SCHEDULE = `INSERT INTO Schedule(school_id, date, period_id, class_id, teacher_id, subject_id, room_id)
                                            VALUES ((?), (?), (?), (?), (?), (?), (?));`

    static readonly UPDATE_SCHEDULE = `UPDATE Schedule
                                       SET date       = COALESCE((?), date),
                                           period_id  = COALESCE((?), period_id),
                                           class_id   = COALESCE((?), class_id),
                                           teacher_id = COALESCE((?), teacher_id),
                                           subject_id = COALESCE((?), subject_id),
                                           room_id    = COALESCE((?), room_id)
                                       WHERE id = (?)
                                         AND school_id = (?);`;

    static readonly DELETE_FROM_SCHEDULES = `DELETE
                                             FROM Schedule
                                             WHERE id = (?)
                                               AND school_id = (?);`


}