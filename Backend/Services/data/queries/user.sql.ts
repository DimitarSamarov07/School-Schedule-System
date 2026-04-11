export default class UserSql {
    static readonly CREATE_USER =
        `INSERT INTO Users(username, email, password_hash)
         VALUES ((?), (?), (?))
         RETURNING id;`

    static readonly UPDATE_USER_PASS =
        `UPDATE Users
         SET password_hash = COALESCE((?), password_hash)
         WHERE id = (?);`

    static readonly UPDATE_USER_EMAIL =
        `UPDATE Users
         SET email = COALESCE((?), email)
         WHERE id = (?);
        `

    static readonly DELETE_USER =
        `DELETE
         FROM Users
         WHERE id = (?)
           AND password_hash = (?)
        ;`

    static readonly GET_USER_BY_USERNAME =
        `SELECT *
         FROM Users
         WHERE username = (?)
        `;

    static readonly GET_USER_PERMISSIONS =
        ` SELECT *
          FROM SchoolMembers
          WHERE user_id = (?);
        `;

    static readonly CREATE_USER_PERMISSION =
        `INSERT INTO SchoolMembers(user_id, school_id, is_admin)
         VALUES ((?), (?), (?));`

    static readonly GET_USERS_BY_SCHOOL_ID =
        `SELECT u.id                   as 'userId',
                SchoolMembers.is_admin as 'isAdmin',
                u.username             as 'username',
                u.email                as 'email'
         FROM SchoolMembers
                  JOIN Users u ON SchoolMembers.user_id = u.id
         WHERE school_id = (?);`

    static readonly UPDATE_USER_PERMISSION =
        `UPDATE SchoolMembers
         SET is_admin = COALESCE((?), is_admin)
         WHERE user_id = (?)
           AND school_id = (?);`

    static readonly DELETE_USER_PERMISSIONS_FOR_SCHOOL =
        `DELETE
         FROM SchoolMembers
         WHERE user_id = (?)
           AND school_id = (?);`

    static readonly GET_USER_BY_ID: `SELECT *
                                     FROM users
                                     WHERE id = ?`;

    static readonly INSERT_REFRESH_TOKEN = `
        INSERT INTO RefreshTokens (token, user_id, device_name, expires_at)
        VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 6 MONTH))
    `;

    static readonly GET_REFRESH_TOKEN = `
        SELECT user_id
        FROM RefreshTokens
        WHERE token = ?
          AND expires_at > NOW()
    `;

    static readonly DELETE_REFRESH_TOKEN = `
        DELETE
        FROM RefreshTokens
        WHERE token = ?
    `

    static readonly DELETE_ALL_REFRESH_TOKENS_FOR_USER_ID = `
        DELETE
        FROM RefreshTokens
        WHERE user_id = ?;
    `
}