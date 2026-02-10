export default class UserSql {
    static readonly CREATE_USER =
        `INSERT INTO Users(username, email, password_hash)
         VALUES ((?), (?), (?)) RETURNING id;`

    static readonly UPDATE_USER_PASS =
        `UPDATE Users
         SET password_hash = COALESCE((?), password_hash)
         WHERE username = (?)
           AND password_hash = (?);`

    static readonly UPDATE_USER_EMAIL =
        `UPDATE Users
         SET email = COALESCE((?), email)
         WHERE username = (?)
           AND password_hash = (?);
        `

    static readonly DELETE_USER =
        `DELETE
         FROM Users
         WHERE username = (?)
           AND password_hash = (?)
        ;`

    static readonly GET_USER_BY_USERNAME =
        `SELECT *
         FROM Users
         WHERE username = (?)
        `;

    static readonly CHECK_USER_CREDENTIALS =
        `SELECT password_hash
         FROM Users
         WHERE username = (?)
         LIMIT 1; `

    static readonly GET_USER_PERMISSIONS =
        ` SELECT *
          FROM SchoolMembers
          WHERE user_id = (?);
        `;

    static readonly CREATE_USER_PERMISSION =
        `INSERT INTO SchoolMembers(user_id, school_id, is_admin)
         VALUES ((?), (?), (?));`
}