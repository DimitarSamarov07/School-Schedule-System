export default class ClassSql {
    static readonly SELECT_CLASSES_BY_SCHOOL = `SELECT Classes.id as 'class_id',
                                                       Classes.name        as 'class_name',
                                                       Classes.description as 'class_description',
                                                       r.id                as 'room_id',
                                                       r.name              as 'room_name',
                                                       r.floor             as 'room_floor',
                                                       r.capacity          as 'room_capacity'
                                                FROM Classes
                                                         JOIN school_system.Rooms r on r.id = Classes.home_room_id
                                                WHERE Classes.school_id = (?);`

    static readonly INSERT_INTO_CLASSES = `INSERT INTO Classes(school_id, name, description, home_room_id)
                                           VALUES ((?), (?), (?), (?))
                                           RETURNING id;`

    static readonly UPDATE_CLASS = `UPDATE Classes
                                    SET name         = COALESCE((?), name),
                                        description  = COALESCE((?), description),
                                        home_room_id = COALESCE((?), home_room_id)
                                    WHERE id = (?)`;

    static readonly DELETE_CLASS = `DELETE
                                    FROM Classes
                                    WHERE id = (?);`
}