import express from "express";
import moment from "moment";
import helmet from "helmet";
import cors from "cors";
import rateLimit from 'express-rate-limit';
import authenticatorMaster from "./Services/auth_services.ts";
import cookieParser from "cookie-parser";
import {ScheduleService as scheduleService} from "./Services/data/ScheduleService.ts";
import {ClassService as classService} from "./Services/data/ClassService.ts";
import {PeriodService as periodService} from "./Services/data/PeriodService.ts";
import {RoomService as roomService} from "./Services/data/RoomService.ts";
import {TeacherService as teacherService} from "./Services/data/TeacherService.ts";

// Initializing Express App

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 1000,
    max: 20,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
});

//app.use(limiter)
app.use(cookieParser())
app.use(express.json({limit: '10kb'}));
//app.use(lusca.csrf());
app.use(helmet()) // Enhances security


app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

//
app.set('trust proxy', 1);

let port = 1343;

async function checkUserAuthenticationMiddleware(req, res, next) {
    let {AUTHENTICATION_ADMIN_TOKEN} = req.cookies;
    if (AUTHENTICATION_ADMIN_TOKEN) {
        let decoded = await authenticatorMaster.decodeJWT(AUTHENTICATION_ADMIN_TOKEN);
        if (!decoded){
            return res.status(401).send("Authentication failure.")
        }
        else{
            req.username = decoded.username;
            next();
        }

    }
    return res.status(401).send("Authentication failure.")
}

/*
 * GET /schedulesByDate
 * Retrieves all schedules for a given date
 * Query params:
 *   -
 * : string (YYYY-MM-DD format)
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
    return await scheduleService.getAllSchedulesForDate(date)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })

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
    return await scheduleService.getSchedulesByClassIdForDate(classId, date)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
})

/*
 * GET /runningTime
 * Gets the current running time from the database
 * Returns:
 *   - 200: {currentHour: string} Current hour value
 *   - 500: Database error message
 */
app.get("/currentPeriod", async (req, res) => {
    let {schoolId} = req.query;
    let result = await schoolManager.Periods.getRunningPeriodForSchool(schoolId).catch(err => {
        return res.status(500).send({"error": err});
    });
    if (result === null) return res.status(204).send({label: null, startTime: null, endTime: null});
    return res.status(200).send(result);
})


app.get("/nextPeriod", async (req, res) => {
    let {schoolId} = req.query;
    let result = await periodService.getNextRunningPeriodForSchool(schoolId).catch(err => {
        return res.status(500).send({"error": err});
    });
    return res.status(200).send( result);
})


app.get("/schedulesByDateTimeAndSchool", async (req, res) => {
    let {schoolId} = req.query;
    let {date, time} = req.body;
    return await scheduleService.getSchoolSchedulesByDateAndTime(schoolId, date, time)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            if (err === "No schedules found") {
                return res.status(404).send({"error": err});
            }
            return res.status(500).send({"error": err});
        })
})

app.get("/teacher", async (req, res) => {
    let {schoolId} = req.query;
    return await teacherService.getAllTeachersForSchool(schoolId)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            if (err === "No rooms found") {
                return res.status(404).send({"error": err});
            }
            return res.status(500).send({"error": err});
        })
})

app.get("/room", async (req, res) => {
    let {schoolId} = req.query;
    return await roomService.getAllRoomsForSchool(schoolId)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            if (err === "No rooms found") {
                return res.status(404).send({"error": err});
            }
            return res.status(500).send({"error": err});
        })
})

app.get("/class", async (req, res) => {
    let {schoolId} = req.query;
    return await classService.getAllClassesForSchool(schoolId)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            if (err === "No classes found") {
                return res.status(404).send({"error": err});
            }
            return res.status(500).send({"error": err});
        })
})

app.get("/time", async (req, res) => {
    let {schoolId} = req.query;
    return await periodService.getAllPeriodsForSchool(schoolId)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            if (err === "No breaks found") {
                return res.status(404).send({"error": err});
            }
            return res.status(500).send({"error": err});
        })
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
 *   - 500: A database error message
 */

app.post("/teacher", checkUserAuthenticationMiddleware, async (req, res) => {

    let {firstName, lastName} = req.body;
    if (!firstName || !lastName) {
        return res.status(406).send("Malformed parameters");
    }

    return await teacherService.createTeacher(firstName, lastName)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
});
app.post("/register", async (req, res) => {

    let {username, email, password} = req.body;
    if (!username || !password || !email) {
        return res.status(406).send("Malformed parameters");
    }

    return await schoolManager.registerNewAdmin(username, email, password)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
});
app.post("/login", async (req, res) => {

    let {username, password} = req.body;
    if (!username || !password) {
        return res.status(406).send("Malformed parameters");
    }
    let isAdmin = await schoolManager.checkAdminCredentials(username, password);
    if (!isAdmin) {
        return res.status(403).send({"error": "Invalid credentials."})
    }
    let token = authenticatorMaster.createJWT(username);
    return res.cookie("AUTH_TOKEN", token).status(201).send();
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

    return await schoolManager.createClass(name, description)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
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

    return await schoolManager.createRoom(name, floor)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })

})

/*
 * POST /time
 * Creates a new time record
 * Body params:
 *   - start: string (HH:MM format)
 *   - end: string (HH:MM format)
 * Returns:
 *   - 200: Created the Period object with ID
 *   - 406: "Malformed parameters" if start/end missing
 *   - 500: Database error message
 */
app.post("/time", async (req, res) => {
    let {start, end} = req.body;
    if (!start || !end) {
        return res.status(406).send("Malformed parameters");
    }

    return await schoolManager.createTime(start, end)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
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

    return await schoolManager.createSchedule(courseId, classId, timeId, dateId)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
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
app.post("/subject", async (req, res) => {
    let {name, schoolId, description} = req.body;
    if (!name || !description || !schoolId) {
        return res.status(406).send("Malformed parameters");
    }

    return await schoolManager.Subjects.createSubject(schoolId, name, description)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })

})

// HTTP PUT

/*
 * PUT /teacher
 * Updates an existing teacher's information
 * Body params:
 *   - id: number (required)
 *   - firstName: string (optional)
 *   - lastName: string (optional)
 * Returns:
 *   - 200: Updated teacher object if successful
 *   - 406: "Malformed parameters" if id missing or both firstName and lastName missing
 *   - 422: false if update failed
 *   - 500: Database error message
 */
app.put("/teacher", async (req, res) => {
    let {name, email, id} = req.body;
    if ((!name && !email) || !id) {
        return res.status(406).send("Malformed parameters");
    }

    return await schoolManager.Teachers.updateTeacher(id, name, email)
        .then(result => {
            if (result) {
                return res.send(result);
            } else {
                return res.status(422).send(false);
            }
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
})

/*
 * PUT /class
 * Updates existing class information
 * Body params:
 *   - id: number (required)
 *   - name: string (optional)
 *   - description: string (optional)
 * Returns:
 *   - 200: Updated class object if successful
 *   - 406: "Malformed parameters" if id missing or both name and description missing
 *   - 422: false if update failed
 *   - 500: Database error message
 */
app.put("/class", async (req, res) => {
    let {name, homeRoomId, id} = req.body;
    if ((!name && !homeRoomId) || !id) {
        return res.status(406).send("Malformed parameters");
    }

    return await schoolManager.Classes.updateClass(id, name, homeRoomId)
        .then(result => {
            if (result) {
                return res.send(result);
            } else {
                return res.status(422).send(false);
            }
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
})

/*
 * PUT /course
 * Updates existing course information
 * Body params:
 *   - id: number (required)
 *   - name: string (optional)
 *   - teacherId: number (optional)
 *   - roomId: number (optional)
 * Returns:
 *   - 200: Updated course object if successful
 *   - 406: "Malformed parameters" if id missing or all optional fields missing
 *   - 422: false if update failed
 *   - 500: Database error message
 */
app.put("/course", async (req, res) => {
    let {name, teacherId, roomId, id} = req.body;
    if ((!name && !teacherId && !roomId) || !id) {
        return res.status(406).send("Malformed parameters");
    }

    return await schoolManager.updateCourse(id, name, teacherId, roomId)
        .then(result => {
            if (result) {
                return res.send(result);
            } else {
                return res.status(422).send(false);
            }
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
})

/*
 * PUT /time
 * Updates an existing time slot
 * Body params:
 *   - id: number (required)
 *   - start: string (optional, HH:MM format)
 *   - end: string (optional, HH:MM format)
 * Returns:
 *   - 200: Updated time object if successful
 *   - 406: "Malformed parameters" if id missing or both start and end missing
 *   - 422: false if update failed
 *   - 500: Database error message
 */
app.put("/time", async (req, res) => {
    let {start, end, id} = req.body;
    if ((!start && !end) || !id) {
        return res.status(406).send("Malformed parameters");
    }

    return await schoolManager.updateTime(id, start, end)
        .then(result => {
            if (result) {
                return res.send(result);
            } else {
                return res.status(422).send(false);
            }
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
})

/*
 * PUT /room
 * Updates existing room information
 * Body params:
 *   - id: number (required)
 *   - name: string (optional)
 *   - floor: number (optional)
 * Returns:
 *   - 200: Updated room object if successful
 *   - 406: "Malformed parameters" if id missing or both name and floor missing
 *   - 422: false if update failed
 *   - 500: Database error message
 */
app.put("/room", async (req, res) => {
    let {name, floor, id} = req.body;
    if ((!name && !floor) || !id) {
        return res.status(406).send("Malformed parameters");
    }

    return await schoolManager.updateRoom(id, name, floor)
        .then(result => {
            if (result) {
                return res.send(result);
            } else {
                return res.status(422).send(false);
            }
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
})


/*
 * PUT /schedule
 * Updates an existing schedule entry
 * Body params:
 *   - oldCourseId: number (required)
 *   - oldClassId: number (required)
 *   - oldDateId: number (required)
 *   - newCourseId: number (optional)
 *   - newClassId: number (optional)
 *   - newTimeId: number (optional)
 *   - newDateId: number (optional)
 * Returns:
 *   - 200: Updated schedule object if successful
 *   - 406: "Malformed parameters" if any required ID missing or all new IDs missing
 *   - 422: false if update failed
 *   - 500: Database error message
 */
app.put("/schedule", async (req, res) => {
    let {newCourseId, oldCourseId, newClassId, oldClassId, newTimeId, newDateId, oldDateId} = req.body;
    if ((!newCourseId && !newClassId && !newTimeId && !newDateId) || !oldCourseId || !oldClassId || !oldDateId) {
        return res.status(406).send("Malformed parameters");
    }

    return await schoolManager
        .updateSchedule(oldClassId, oldCourseId, oldDateId, newClassId, newCourseId, newTimeId, newDateId)
        .then(result => {
            if (result) {
                return res.send(result);
            } else {
                return res.status(422).send(false);
            }
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
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

    return await schoolManager.Classes.deleteClass(id)
        .then(result => {
            if (result) {
                return res.send(result);
            } else {
                return res.status(422).send(false);
            }
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
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
app.delete("/subject", async (req, res) => {
    let {id} = req.query;

    return await schoolManager.Subjects.deleteSubject(id)
        .then(result => {
            if (result) {
                return res.send(result);
            } else {
                return res.status(422).send(false);
            }
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
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
app.delete("/period", async (req, res) => {
    let {id} = req.query;

    return await schoolManager.Periods.deletePeriod(id)
        .then(result => {
            if (result) {
                return res.send(result);
            } else {
                return res.status(422).send(false);
            }
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })

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

    return await schoolManager.Teachers.deleteTeacher(id)
        .then(result => {
            if (result) {
                return res.send(result);
            } else {
                return res.status(422).send(false);
            }
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
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

    return await schoolManager.Rooms.deleteRoom(id)
        .then(result => {
            if (result) {
                return res.send(result);
            } else {
                return res.status(422).send(false);
            }
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
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

    return await schoolManager.deleteSchedule(courseId, classId, timeId)
        .then(result => {
            if (result) {
                return res.send(result);
            } else {
                return res.status(422).send(false);
            }
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
})


//await authenticatorMaster.initializeAuthenticator();
app.listen(port, () => console.log(`App Listening on port ${port}`));