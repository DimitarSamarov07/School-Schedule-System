
export const BASE_URL = '/api';

export const ENDPOINTS = {
    ASSETS: {
        BELL: `/assets/bell`,
    },
    PERIOD: {
        CURRENT: `/period/current`,
        NEXT: `/period/next`,
        PRIMARY: `/period`,
        ALL: `/period/all`,
    },
    SUBJECT: {
        PRIMARY: `/subject`,
        ALL: `/subject/all`,
    },
    TEACHER: {
        PRIMARY: `/teacher`,
        ALL: `/teacher/all`,
    },
    CLASS: {
        PRIMARY: `/class`,
        ALL: `/class/all`,
    },
    ROOM: {
        PRIMARY: `/room`,
        ALL: `/room/all`,
    },
    HOLIDAY: {
        PRIMARY: `/holiday`,
        ALL: `/holiday/all`,
    },
    AUTH: {
        REGISTER: `/auth/register`,
        LOGIN: `/auth/login`,
        LOGOUT: `/auth/logout`,
        REFRESH: `/auth/refresh`,
        LOGOUT_ALL: `/auth/logoutEverywhere`,
        CHANGE_PASSWORD: `/auth/changePassword`,
    },
    USER: {
        PROMOTE: `/user/promote`,
        DEMOTE: `/user/demote`,
        INVITE: `/user/addToSchool`,
        REMOVE: `/user/removeFromSchool`,
        REVOKE_ACCESS: `/user/revokeUserTokens`,
    },
    SCHEDULE: {
        BETWEEN_DATES: `/schedule/betweenDates`,
        BY_DATE: `/schedule/byDate`,
        BY_CLASS_ID_FOR_DATE: `/schedule/byClassIdForDate`,
        PRIMARY: `/schedule`,
        BY_DATE_TIME_SCHOOL: `/schedule/byDateTimeAndSchool`,
        BULK: `/schedule/bulk`,
    },
    SCHOOL: {
        LIST_ALL_SCHOOL_USERS: `/school/allUsers`,
        ALL: `/school/all`,
        WORKWEEK_CONFIG: `/school/workWeek`,
        PRIMARY: `/school`,
    }
}
