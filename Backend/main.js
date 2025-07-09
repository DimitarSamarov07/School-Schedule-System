import express from "express";
import manager from "./sqlite_services.js";
import moment from "moment";
import helmet from "helmet";
import cors from "cors";

// Initializing Express App

const app = express();
app.use(helmet()) // Enhances security
app.use(express.json())
app.use(cors())

let port = 6969;

/*
 * GET /schedulesByDate
 * Retrieves all schedules for a given date
 * Query params:
 *   - date: string (YYYY-MM-DD format)
 * Returns:
 *   - 200: Array of Schedule objects
 *   - 406: "Malformed parameter" if the date is missing or invalid
 *   - 500: Database error message
 */
app.get("/schedulesByDate", async (req, res) => {
    let {date} = req.query;
    if (!date) {
        return res.status(406).send("Malformed parameter");
    }
    try {
        date = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
    } catch (e) {
        return res.status(406).send("Malformed date. The correct format is YYYY-MM-DD");
    }
    let result = await manager.getAllSchedulesForDate(date).catch(err => {
        return res.status(500).send(err);
    })
    return res.send(result);

});

/*
 * GET /schedulesByDateTime
 * Retrieves all schedules for a given date and time
 * Query params:
 *   - date: string (YYYY-MM-DD format)
 *   - time: string (HH:MM format)
 * Returns:
 *   - 200: Array of Schedule objects
 *   - 406: "Malformed parameter" if date or time missing
 *   - 500: Database error message
 */
app.get("/schedulesByDateTime", async (req, res) => {
    let {date, time} = req.query;
    if (!date || !time) {
        return res.status(406).send("Malformed parameter");
    }

    date = moment(date, 'YYYY-MM-DD').format("YYYY-MM-DD");

    let result = await manager.getAllSchedulesForDateTime(date, time).catch(err => {
        return res.status(500).send(err);
    })
    return res.send(result);
});

/*
 * GET /schedulesByClassIdForDate
 * Retrieves schedules for a specific class on a given date
 * Query params:
 *   - classId: number
 *   - date: string (YYYY-MM-DD format)
 * Returns:
 *   - 200: Array of Schedule objects
 *   - 406: "Malformed parameters" if classId/date missing or invalid
 *   - 500: Database error message
 */
app.get("/schedulesByClassIdForDate", async (req, res) => {
    let {classId, date} = req.query;
    if (!date || !classId) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        date = moment(date).format("YYYY-MM-DD");
    } catch (e) {
        return res.status(406).send("Malformed date. The correct format is YYYY-MM-DD");
    }

    let classIdParsed = parseInt(classId);
    if (isNaN(classIdParsed)) {
        return res.status(406).send("Malformed classId");
    }
    let result = await manager.getSchedulesByClassIdForDate(classIdParsed, date).catch(err => {
        return res.status(500).send(err);
    });
    return res.send(result);
})

/*
 * GET /runningTime
 * Gets the current running time from the database
 * Returns:
 *   - 200: {currentHour: string} Current hour value
 *   - 500: Database error message
 */
app.get("/runningTime", async (req, res) => {
    let result = await manager.getRunningTime().catch(err => {
        return res.status(500).send(err);
    });
    return res.status(200).send({currentHour: result});
})

/*
 * GET /date
 * Retrieves date info from the database
 * Query params:
 *   - date: string (YYYY-MM-DD format)
 * Returns:
 *   - 200: Date object
 *   - 404: "No date found"
 *   - 406: "Malformed parameter" if date missing
 *   - 500: Database error message
 */
app.get("/date", async (req, res) => {
    let {date} = req.query;
    if (!date) {
        return res.status(406).send("Malformed parameter");
    }

    let result = await manager.getDateFromDBByDate(req.query.date).catch(err => {
        if (err === "No date found") {
            return res.status(404).send(err);
        }
        return res.status(500).send(err);
    })

    return res.send(result);
})


// Create endpoints

/*
 * POST /teacher
 * Creates a new teacher record
 * Body params:
 *   - firstName: string
 *   - lastName: string
 * Returns:
 *   - 200: Created the teacher object with ID
 *   - 406: "Malformed parameters" if firstName/lastName missing
 *   - 500: Database error message
 */
app.post("/teacher", async (req, res) => {
    let {firstName, lastName} = req.body;
    if (!firstName || !lastName) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.createTeacher(firstName, lastName).catch(err => {
        return res.status(500).send(err);
    })
    return res.send(result);
});

/*
 * POST /class
 * Creates a new class record
 * Body params:
 *   - name: string
 *   - description: string
 * Returns:
 *   - 200: Created the Class object with ID
 *   - 406: "Malformed parameters" if name/description missing
 *   - 500: Database error message
 */
app.post("/class", async (req, res) => {
    let {name, description} = req.body;
    if (!name || !description) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.createClass(name, description).catch(err => {
        return res.status(500).send(err);
    })

    return res.send(result);
})

/*
 * POST /room
 * Creates a new room record
 * Body params:
 *   - name: string
 *   - floor: number
 * Returns:
 *   - 200: Created the Room object with ID
 *   - 406: "Malformed parameters" if name/floor missing
 *   - 500: Database error message
 */
app.post("/room", async (req, res) => {
    let {name, floor} = req.body;
    if (!name || !floor) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.createRoom(name, floor).catch(err => {
        return res.status(500).send(err);
    })

    return res.send(result);
})

/*
 * POST /time
 * Creates a new time record
 * Body params:
 *   - start: string (HH:MM format)
 *   - end: string (HH:MM format)
 * Returns:
 *   - 200: Created the Time object with ID
 *   - 406: "Malformed parameters" if start/end missing
 *   - 500: Database error message
 */
app.post("/time", async (req, res) => {
    let {start, end} = req.body;
    if (!start || !end) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.createTime(start, end).catch(err => {
        return res.status(500).send(err);
    })

    return res.send(result);
})

/*
 * POST /advertising
 * Creates a new advertising record
 * Body params:
 *   - text: string
 *   - imagePath: string
 * Returns:
 *   - 200: Created the Advertising object with ID
 *   - 406: "Malformed parameters" if text/imagePath missing
 *   - 500: Database error message
 */
app.post("/advertising", async (req, res) => {
    let {text, imagePath} = req.body;
    if (!text || !imagePath) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.createAdvertising(text, imagePath).catch(err => {
        return res.status(500).send(err);
    })

    return res.send(result);
})

/*
 * POST /bell
 * Creates a new bell record
 * Body params:
 *   - name: string
 *   - soundPath: string
 * Returns:
 *   - 200: Created the Bell object with ID
 *   - 406: "Malformed parameters" if name/soundPath missing
 *   - 500: Database error message
 */
app.post("/bell", async (req, res) => {
    let {name, soundPath} = req.body;
    if (!name || !soundPath) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.createBell(name, soundPath).catch(err => {
        return res.status(500).send(err);
    })

    return res.send(result);
})

/*
 * POST /schedule
 * Creates a new schedule record
 * Body params:
 *   - courseId: number
 *   - classId: number
 *   - timeId: number
 *   - dateId: number
 * Returns:
 *   - 200: Created the Schedule object
 *   - 406: "Malformed parameters" if any ID missing
 *   - 500: Database error message
 */
app.post("/schedule", async (req, res) => {
    let {courseId, classId, timeId, dateId} = req.body;
    if (!courseId || !classId || !timeId || !dateId) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.createSchedule(courseId, classId, timeId, dateId).catch(err => {
        return res.status(500).send(err);
    })

    return res.send(result);
})

/*
 * POST /course
 * Creates a new course record
 * Body params:
 *   - name: string
 *   - teacherId: number
 *   - roomId: number
 * Returns:
 *   - 200: Created the Course object with ID
 *   - 406: "Malformed parameters" if name/teacherId/roomId missing
 *   - 500: Database error message
 */
app.post("/course", async (req, res) => {
    let {name, teacherId, roomId} = req.body;
    if (!name || !teacherId || !roomId) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.createCourse(name, teacherId, roomId).catch(err => {
        return res.status(500).send(err);
    })

    return res.send(result);
})

// HTTP PUT

app.put("/teacher", async (req, res) => {
    let {firstName, lastName, id} = req.body;
    if ((!firstName && !lastName) || !id) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.updateTeacher(firstName, lastName, id).catch(err => {
        return res.status(500).send(err);
    })
    if (!result) {
        return res.status(422).send(false);
    }
    return res.send(result);
})

app.put("/class", async (req, res) => {
    let {name, description, id} = req.body;
    if ((!name && !description) || !id) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.updateClass(id, name, description).catch(err => {
        return res.status(500).send(err);
    })
    if (!result) {
        return res.status(422).send(false);
    }
    return res.send(result);
})

app.put("/course", async (req, res) => {
    let {name, teacherId, roomId, id} = req.body;
    if ((!name && !teacherId && !roomId) || !id) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.updateCourse(id, name, teacherId, roomId).catch(err => {
        return res.status(500).send(err);
    })
    if (!result) {
        return res.status(422).send(false);
    }
    return res.send(result);
})

app.put("/time", async (req, res) => {
    let {start, end, id} = req.body;
    if ((!start && !end) || !id) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.updateTime(id, start, end).catch(err => {
        return res.status(500).send(err);
    })
    if (!result) {
        return res.status(422).send(false);
    }
    return res.send(result);
})

app.put("/room", async (req, res) => {
    let {name, floor, id} = req.body;
    if ((!name && !floor) || !id) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.updateRoom(id, name, floor).catch(err => {
        return res.status(500).send(err);
    })
    if (!result) {
        return res.status(422).send(false);
    }
    return res.send(result);
})

app.put("/advertising", async (req, res) => {
    let {content, imagePath, id} = req.body;
    if ((!content && !imagePath) || !id) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.updateAdvertising(id, content, imagePath).catch(err => {
        return res.status(500).send(err);
    })
    if (!result) {
        return res.status(422).send(false);
    }
    return res.send(result);
})

app.put("/bell", async (req, res) => {
    let {name, soundPath, id} = req.body;
    if ((!name && !soundPath) || !id) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.updateBell(id, name, soundPath).catch(err => {
        return res.status(500).send(err);
    })
    if (!result) {
        return res.status(422).send(false);
    }
    return res.send(result);
})

app.put("/schedule", async (req, res) => {
    let {newCourseId, oldCourseId, newClassId, oldClassId, newTimeId, newDateId, oldDateId} = req.body;
    if ((!newCourseId && !newClassId && !newTimeId && !newDateId) || !oldCourseId || !oldClassId || !oldDateId) {
        return res.status(406).send("Malformed parameters");
    }
    let result = await manager.updateCourse(id, name, teacherId, roomId).catch(err => {
        return res.status(500).send(err);
    })
    if (!result) {
        return res.status(422).send(false);
    }
    return res.send(result);
})

/*
 * DELETE /class
 * Deletes a class record by ID
 * Query params:
 *   - id: number
 * Returns:
 *   - 200: Created the Date object with ID
 *   - 406: "Malformed parameters" if date invalid/missing or isHoliday not boolean
 *   - 500: Database error message
 */
app.delete("/class", async (req, res) => {
    let {id} = req.query;

    let result = await manager.deleteClass(id).catch(err => {
        return res.status(500).send(err);
    })

    if (result) {
        return res.send(result);
    } else {
        return res.status(422).send(false);
    }

})

/*
 * DELETE /course 
 * Deletes a course record by ID
 * Query params:
 *   - id: number
 * Returns:
 *   - 200: true if deleted successfully
 *   - 422: false if deletion failed
 *   - 500: Database error message
 */
app.delete("/course", async (req, res) => {
    let {id} = req.query;

    let result = await manager.deleteCourse(id).catch(err => {
        return res.status(500).send(err);
    })

    if (result) {
        return res.send(result);
    } else {
        return res.status(422).send(false);
    }
})

/*
 * DELETE /date
 * Deletes a date record by ID 
 * Query params:
 *   - id: number
 * Returns:
 *   - 200: true if deleted successfully
 *   - 422: false if deletion failed
 *   - 500: Database error message
 */
app.delete("/date", async (req, res) => {
    let {id} = req.query;

    let result = await manager.deleteDate(id).catch(err => {
        return res.status(500).send(err);
    })

    if (result) {
        return res.send(result);
    } else {
        return res.status(422).send(false);
    }
})

/*
 * DELETE /time
 * Deletes a time record by ID
 * Query params:
 *   - id: number
 * Returns:
 *   - 200: true if deleted successfully
 *   - 422: false if deletion failed
 *   - 500: Database error message
 */
app.delete("/time", async (req, res) => {
    let {id} = req.query;

    let result = await manager.deleteClass(id).catch(err => {
        return res.status(500).send(err);
    })

    if (result) {
        return res.send(result);
    } else {
        return res.status(422).send(false);
    }

})

/*
 * DELETE /bell
 * Deletes a bell record by ID
 * Query params:
 *   - id: number
 * Returns:
 *   - 200: true if deleted successfully
 *   - 422: false if deletion failed
 *   - 500: Database error message
 */
app.delete("/bell", async (req, res) => {
    let {id} = req.query;

    let result = await manager.deleteBell(id).catch(err => {
        return res.status(500).send(err);
    })

    if (result) {
        return res.send(result);
    } else {
        return res.status(422).send(false);
    }
})

/*
 * DELETE /teacher
 * Deletes a teacher record by ID
 * Query params:
 *   - id: number
 * Returns:
 *   - 200: true if deleted successfully
 *   - 422: false if deletion failed
 *   - 500: Database error message
 */
app.delete("/teacher", async (req, res) => {
    let {id} = req.query;

    let result = await manager.deleteTeacher(id).catch(err => {
        return res.status(500).send(err);
    })

    if (result) {
        return res.send(result);
    } else {
        return res.status(422).send(false);
    }
})

/*
 * DELETE /room
 * Deletes a room record by ID
 * Query params:
 *   - id: number
 * Returns:
 *   - 200: true if deleted successfully
 *   - 422: false if deletion failed
 *   - 500: Database error message
 */
app.delete("/room", async (req, res) => {
    let {id} = req.query;

    let result = await manager.deleteRoom(id).catch(err => {
        return res.status(500).send(err);
    })

    if (result) {
        return res.send(result);
    } else {
        return res.status(422).send(false);
    }
})

/*
 * DELETE /schedule
 * Deletes a schedule record by courseId, classId and timeId
 * Query params:
 *   - courseId: number
 *   - classId: number 
 *   - timeId: number
 * Returns:
 *   - 200: true if deleted successfully
 *   - 422: false if deletion failed
 *   - 500: Database error message
 */
app.delete("/schedule", async (req, res) => {
    let {courseId, classId, timeId} = req.query;

    let result = await manager.deleteSchedule(courseId, classId, timeId).catch(err => {
        return res.status(500).send(err);
    })

    if (result) {
        return res.send(result);
    } else {
        return res.status(422).send(false);
    }

})

manager.initializeConnection();
app.listen(port, () => console.log(`App Listening on port ${port}`));