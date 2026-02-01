export default class TeacherSql {
    static readonly SELECT_TEACHERS_BY_SCHOOL = `SELECT id, name, email
                                                 FROM Teachers
                                                 WHERE school_id = (?);`

    static readonly INSERT_INTO_TEACHERS = `INSERT INTO Teachers(school_id, name, email)
                                            VALUES ((?), (?), (?))
                                            RETURNING id;`

    static readonly UPDATE_TEACHER = `UPDATE Teachers
                                      SET name  = COALESCE((?), name),
                                          email = COALESCE((?), email)
                                      WHERE id = (?)`

    static readonly DELETE_TEACHER = `DELETE
                                      FROM Teachers
                                      WHERE id = (?)
                                      RETURNING id;`
}