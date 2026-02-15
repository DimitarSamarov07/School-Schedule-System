export default class SchoolSql {
    static SELECT_ALL_SCHOOLS = "SELECT * FROM Schools";
    static SELECT_SCHOOL_BY_ID = "SELECT * FROM Schools WHERE id = (?)";
    static SELECT_SCHOOL_WORK_CONFIG_BY_ID = "SELECT work_week_config FROM Schools WHERE id = (?)"
}