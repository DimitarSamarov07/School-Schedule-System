
export const BASE_URL = '/api';

export const ENDPOINTS = {
    SCHEDULES_BY_DATE_TIME_SCHOOL: `/schedule/byDateTimeAndSchool`,
    SCHOOL: `/school`,
    RUNNING_PERIOD: `/period/current`,
    NEXT_PERIOD: `/period/next`,
    SUBJECTS: `/subject`,
    TEACHER: `/teacher`,
    CLASS: `/class`,
    ROOM: `/room`,
    PERIOD: `/period`,
    SCHEDULE: `/schedule`,
    COURSE: `/course`,
    HOLIDAY: `/holiday`,
    REGISTER: `/auth/register`,
    LOGIN: `/auth/login`,
    LOGOUT: `/auth/logout`,
    PROMOTE: `/user/promote`,
    DEMOTE: `/user/demote`,
    SCHEDULE_BETWEEN_DATES: `/schedule/betweenDates`,
    LIST_ALL_SCHOOL_USERS: `/school/allUsers`,
    INVITE_USER: `/user/addToSchool`,
    REMOVE_USER: `/user/removeFromSchool`,
    SCHEDULE_BY_DATE: `/schedule/byDate`,
}
