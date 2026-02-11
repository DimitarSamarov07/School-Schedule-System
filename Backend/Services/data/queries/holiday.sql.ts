export default class HolidaySql {
    static readonly SELECT_HOLIDAYS = `SELECT id, name, start_date, end_date
                                       FROM school_system.SchoolHolidays
                                       WHERE SCHOOL_ID = (?);`

    static readonly SELECT_HOLIDAY_BY_ID = `SELECT id, name, start_date, end_date
                                            FROM school_system.SchoolHolidays
                                            WHERE id = (?)
                                              AND school_id = (?);`

    static readonly INSERT_HOLIDAY = `INSERT INTO school_system.SchoolHolidays (school_id, name, start_date, end_date)
                                      VALUES (?, ?, ?, ?);`

    static readonly UPDATE_HOLIDAY = `UPDATE school_system.SchoolHolidays
                                      SET name       = COALESCE((?), name),
                                          start_date = COALESCE((?), start_date),
                                          end_date   = COALESCE((?), end_date)
                                      WHERE id = (?)
                                        AND school_id = (?);`

    static readonly DELETE_HOLIDAY = `DELETE
                                      FROM school_system.SchoolHolidays
                                      WHERE id = (?)
                                        AND school_id = (?);`

}