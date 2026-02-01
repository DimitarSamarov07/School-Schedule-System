export default class RoomSql {
    static readonly SELECT_ROOMS_BY_SCHOOL = `SELECT id, name, floor, capacity
                                              FROM Rooms
                                              WHERE school_id = (?);`

    static readonly INSERT_ROOM = `INSERT INTO Rooms(school_id, name, floor, capacity)
                                   VALUES ((?), (?), (?), (?))
                                   RETURNING id;`

    static readonly UPDATE_ROOM = `UPDATE Rooms
                                   SET name     = COALESCE((?), name),
                                       floor    = COALESCE((?), floor),
                                       capacity = COALESCE((?), capacity)
                                   WHERE id = (?)`;

    static readonly DELETE_ROOM = `DELETE
                                   FROM Rooms
                                   WHERE id = (?)
                                   RETURNING id;`

}