import express from "express";
import manager from "./sqlite_services.js";
import moment from "moment";
import helmet from "helmet";
import cors from "cors";
import rateLimit from 'express-rate-limit';
import authenticatorMaster from "./auth_services.ts";
import cookieParser from "cookie-parser";

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

app.use(limiter)
app.use(cookieParser())
app.use(express.json({limit: '10kb'}));
app.use(helmet()) // Enhances security


app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

//
app.set('trust proxy', 1);

let port = 3000;

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
    return await manager.getAllSchedulesForDate(date)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })

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

    return await manager.getAllSchedulesForDateTime(date, time)
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
    return await manager.getSchedulesByClassIdForDate(classId, date)
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
app.get("/runningTime", async (req, res) => {
    let result = await manager.getRunningTime().catch(err => {
        return res.status(500).send({"error": err});
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

    return await manager.getDateFromDBByDate(req.query.date)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            if (err === "No date found") {
                return res.status(404).send({"error": err});
            }
            return res.status(500).send({"error": err});
        })
})
app.get("/room", async (req, res) => {

    return await manager.getAllRooms()
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            if (err === "No advertisements found") {
                return res.status(404).send({"error": err});
            }
            return res.status(500).send({"error": err});
        })
})

app.get("/class", async (req, res) => {

    return await manager.getAllClasses()
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            if (err === "No advertisements found") {
                return res.status(404).send({"error": err});
            }
            return res.status(500).send({"error": err});
        })
})

app.get("/allAdvertisements", async (req, res) => {

    return await manager.getAllAds()
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            if (err === "No advertisements found") {
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

    return await manager.createTeacher(firstName, lastName)
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

    return await manager.registerNewAdmin(username, email, password)
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
    let isAdmin = await manager.checkAdminCredentials(username, password);
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

    return await manager.createClass(name, description)
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

    return await manager.createRoom(name, floor)
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
 *   - 200: Created the Time object with ID
 *   - 406: "Malformed parameters" if start/end missing
 *   - 500: Database error message
 */
app.post("/time", async (req, res) => {
    let {start, end} = req.body;
    if (!start || !end) {
        return res.status(406).send("Malformed parameters");
    }

    return await manager.createTime(start, end)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
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

    return await manager.createAdvertising(text, imagePath)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
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

    return await manager.createBell(name, soundPath)
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

    return await manager.createSchedule(courseId, classId, timeId, dateId)
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
app.post("/course", async (req, res) => {
    let {name, teacherId, roomId} = req.body;
    if (!name || !teacherId || !roomId) {
        return res.status(406).send("Malformed parameters");
    }

    return await manager.createCourse(name, teacherId, roomId)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })

})

/*
 * POST /date
 * Creates a new date entry in the database
 * Body params:
 *   - date: string (required) - The date in YYYY-MM-DD format
 *   - isHoliday: boolean (required) - Flag indicating if the date is a holiday
 * Returns:
 *   - 200: Created date object with generated ID
 *   - 406: "Malformed parameters" if date or isHoliday is missing
 *   - 500: Database error message
 */

app.post("/date", async (req, res) => {
    let {date, isHoliday} = req.body;
    if (!date || !isHoliday) {
        return res.status(406).send("Malformed parameters");
    }

    return await manager.createDate(date, isHoliday)
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
    let {firstName, lastName, id} = req.body;
    if ((!firstName && !lastName) || !id) {
        return res.status(406).send("Malformed parameters");
    }

    return await manager.updateTeacher(id, firstName, lastName)
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
    let {name, description, id} = req.body;
    if ((!name && !description) || !id) {
        return res.status(406).send("Malformed parameters");
    }

    return await manager.updateClass(id, name, description)
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

    return await manager.updateCourse(id, name, teacherId, roomId)
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

    return await manager.updateTime(id, start, end)
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

    return await manager.updateRoom(id, name, floor)
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
 * PUT /advertising
 * Updates an existing advertising content
 * Body params:
 *   - id: number (required)
 *   - content: string (optional)
 *   - imagePath: string (optional)
 * Returns:
 *   - 200: Updated advertising object if successful
 *   - 406: "Malformed parameters" if id missing or both content and imagePath missing
 *   - 422: false if update failed
 *   - 500: Database error message
 */
app.put("/advertising", async (req, res) => {
    let {content, imagePath, id} = req.body;
    if ((!content && !imagePath) || !id) {
        return res.status(406).send("Malformed parameters");
    }

    return await manager.updateAdvertising(id, content, imagePath)
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
 * PUT /bell
 * Updates existing bell information
 * Body params:
 *   - id: number (required)
 *   - name: string (optional)
 *   - soundPath: string (optional)
 * Returns:
 *   - 200: Updated bell object if successful
 *   - 406: "Malformed parameters" if id missing or both name and soundPath missing
 *   - 422: false if update failed
 *   - 500: Database error message
 */
app.put("/bell", async (req, res) => {
    let {name, soundPath, id} = req.body;
    if ((!name && !soundPath) || !id) {
        return res.status(406).send("Malformed parameters");
    }

    return await manager.updateBell(id, name, soundPath)
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
 * PUT /date
 * Updates an existing date entry in theAdd an authentication service with the ability to create JWT database
 * Body params:
 *   - id: number (required) - The ID of the date entry to update
 *   - date: string (optional) - The new date in YYYY-MM-DD format
 *   - isHoliday: boolean (optional) - Flag indicating if the date is a holiday
 * Returns:
 *   - 200: Updated date object if successful
 *   - 406: "Malformed parameters" if id is missing or both date and isHoliday are missing
 *   - 422: false if update failed (e.g., date not found)
 *   - 500: Database error message
 */

app.put("/date", async (req, res) => {
    let {id, date, isHoliday} = req.body;
    if ((!date && !isHoliday) || !id) {
        return res.status(406).send("Malformed parameters");
    }

    return await manager.updateDate(id, date, isHoliday)
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

    return await manager
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

    return await manager.deleteClass(id)
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
app.delete("/course", async (req, res) => {
    let {id} = req.query;

    return await manager.deleteCourse(id)
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

    return await manager.deleteDate(id)
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
app.delete("/time", async (req, res) => {
    let {id} = req.query;

    return await manager.deleteTime(id)
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

    return await manager.deleteBell(id)
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

    return await manager.deleteTeacher(id)
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

    return await manager.deleteRoom(id)
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

    return await manager.deleteSchedule(courseId, classId, timeId)
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
 * DELETE /advertising
 * Deletes an advertising entry from the database
 * Query params:
 *   - id: number (required) - The ID of the advertising entry to delete
 * Returns:
 *   - 200: true if deletion was successful
 *   - 422: false if deletion failed (e.g., advertising not found)
 *   - 500: Database error message if operation fails
 */
app.delete("/advertising", async (req, res) => {
    let {id} = req.query;

    return await manager.deleteAdvertising(id)
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
manager.initializeConnection();
app.listen(port, () => console.log(`App Listening on port ${port}`));