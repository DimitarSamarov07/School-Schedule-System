export default class SchoolSql {
    static SELECT_ALL_SCHOOLS = "SELECT * FROM Schools";
    static SELECT_SCHOOL_BY_ID = "SELECT * FROM Schools WHERE id = (?)";
    static SELECT_SCHOOL_WORK_CONFIG_BY_ID = "SELECT work_week_config FROM Schools WHERE id = (?)"
    static INSERT_INTO_SCHOOLS = `INSERT INTO Schools (name, address, work_week_config)
                                  VALUES ((?), (?), (?))
                                  RETURNING id;`;
    static UPDATE_SCHOOL = `UPDATE Schools
                            SET name             = COALESCE((?), name),
                                address          = COALESCE((?), address),
                                work_week_config = COALESCE((?), work_week_config)
                            WHERE id = (?)`;
}