export default class ScheduleSql {
    static readonly BASE_SCHEDULE_QUERY = `
        SELECT school.id AS 'schoolId', school.name AS 'schoolName', school.address AS 'schoolAddress', school.work_week_config AS 'workWeekConfig',
               sub.name             AS 'subjectName',
               sub.description      AS 'description',
               t.name               AS 'teacherName',
               t.email              AS 'teacherEmail',
               c.name               AS 'className',
               c.home_room_id       AS 'homeRoomId',
               r.name               AS 'roomName',
               r.floor              AS 'floor',
               r.capacity           AS 'capacity',
               p.name               AS 'periodName',
               p.start_time         AS 'startTime',
               p.end_time           AS 'endTime',
               s.date               AS 'date'
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
    static readonly SELECT_SCHOOL_SCHEDULES_FOR_DATE_INTERVAL = `${this.BASE_SCHEDULE_QUERY} AND s.date BETWEEN (?) AND (?)`;
    static readonly SELECT_SCHEDULES_FOR_DATE_AND_SUBJECT_ID = `${this.BASE_SCHEDULE_QUERY} AND s.date = (?) AND sub.id = (?) `
    static readonly SELECT_SCHEDULES_BY_DATE_AND_TIME_FOR_SCHOOL = `${this.BASE_SCHEDULE_QUERY} AND s.date = (?) AND (?) BETWEEN p.start_time AND p.end_time`


    static readonly INSERT_INTO_SCHEDULE = `INSERT INTO Schedule(school_id, date, period_id, class_id, teacher_id, subject_id, room_id)
                                            VALUES ((?), (?), (?), (?), (?), (?), (?));`

    static readonly UPDATE_SCHEDULE = `UPDATE Schedule
                                       SET subject_id = COALESCE((?), subject_id),
                                           class_id   = COALESCE((?), class_id),
                                           teacher_id = COALESCE((?), teacher_id),
                                           period_id  = COALESCE((?), period_id)
                                       WHERE id = (?)`;

    static readonly DELETE_FROM_SCHEDULES = `DELETE
                                             FROM Schedule
                                             WHERE id = (?);`


}