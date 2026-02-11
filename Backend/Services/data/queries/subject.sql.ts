export default class SubjectSql {
    static readonly SELECT_SUBJECTS_BY_SCHOOL = `SELECT id, name, description
                                                 FROM Subjects
                                                 WHERE school_id = (?);`

    static readonly SELECT_SUBJECT_BY_ID = `SELECT id, name, description
                                            FROM Subjects
                                            WHERE id = (?)
                                              AND school_id = (?);`

    static readonly INSERT_SUBJECT = `INSERT INTO Subjects(school_id, name, description)
                                      VALUES ((?), (?), (?))
                                      RETURNING id;`


    static readonly UPDATE_SUBJECT = `UPDATE Subjects
                                      SET name        = COALESCE((?), name),
                                          description = COALESCE((?), description)
                                      WHERE id = (?)
                                        AND school_id = (?);`;

    static readonly DELETE_SUBJECT = `DELETE
                                      FROM Subjects
                                      WHERE id = (?)
                                        AND school_id = (?);`
}