export default class UserSql {
    static readonly CREATE_USER =
        `INSERT INTO Users(username, email, password_hash)
         VALUES ((?), (?), (?));`

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

    static readonly CHECK_ADMIN_CREDENTIALS =
        `SELECT password_hash
         FROM Users
         WHERE username = (?)
         LIMIT 1; `
}