export default class PeriodSql {
    static readonly SELECT_BREAKS = `SELECT id, end_time as 'Start', LEAD(start_time) over (ORDER BY id) as 'End'
                                     from Periods
                                     WHERE school_id = (?);`


    static readonly SELECT_PERIODS_BY_SCHOOL = `SELECT id,name, start_time, end_time
                                                FROM Periods
                                                WHERE school_id = (?);`

    static readonly INSERT_INTO_PERIODS = `INSERT INTO Periods(school_id, name, start_time, end_time)
                                           VALUES ((?), (?), (?), (?))
                                           RETURNING id;`

    static readonly UPDATE_PERIOD = `UPDATE Periods
                                     SET name       = COALESCE((?), name),
                                         start_time = COALESCE((?), start_time),
                                         end_time   = COALESCE((?), end_time)

                                     WHERE id = (?)`;

    static readonly DELETE_PERIOD = `DELETE
                                     FROM Periods
                                     WHERE id = (?)
                                     RETURNING id;`
}