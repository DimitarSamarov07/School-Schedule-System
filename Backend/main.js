import express from "express";
import manager from "./sqlite_services.js";
import moment from "moment";

// Initializing Express App
import helmet from "helmet";

const app = express();
app.use(helmet()) // Enhances security

let port = 6969;

app.get("/schedulesByDate", async (req, res) => {
    let {date} = req.query;
    if (date == null) {
        res.status(406).send("Malformed parameter");
    }
    try {
        date = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
    } catch (e) {
        res.status(406).send("Malformed date. The correct format is YYYY-MM-DD");
    }
    let result = await manager.getAllSchedulesForDate(date).catch(err => {
        res.status(500).send(err);
    })
    res.send(result);

});
app.get("/schedulesByDateTime", async (req, res) => {
    let {date, time} = req.query;
    date = moment(date, 'YYYY-MM-DD').format("YYYY-MM-DD");
    let result = await manager.getAllSchedulesForDateTime(date, time).catch(err => {
        res.status(500).send(err);
    })
    res.send(result);
});

app.get("/schedulesByClassIdForDate", async (req, res) => {
    let {classId, date} = req.query;
    if (date == null || classId == null) {
        res.status(406);
        res.send("Malformed parameters");
    }
    try {
        date = moment(date).format("YYYY-MM-DD");
    } catch (e) {
        res.status(406);
        res.send("Malformed date. The correct format is YYYY-MM-DD");
    }

    let classIdParsed = parseInt(classId);
    if (isNaN(classIdParsed)) {
        res.status(406);
        res.send("Malformed classId");
    }
    let result = await manager.getSchedulesByClassIdForDate(classIdParsed, date).catch(err => {
        res.status(500).send(err);
    });
    res.send(result);
})


app.get("/runningTime", async (req, res) => {
    let result = await manager.getRunningTime().catch(err => {
        res.status(500).send(err);
    });
    res.status(200).send({currentHour: result});
})

app.get("/date", async (req, res) => {
    let {date} = req.query;
    if (date == null) {
        res.status(406);
        res.send("Malformed parameter");
    }

    let result = await manager.getDateFromDBByDate(req.query.date).catch(err => {
        if (err === "No date found") {
            res.status(404).send(err);
        }
        res.status(500).send(err);
    })

    res.send(result);
})


// Create

app.post("/teacher", async (req, res) => {
    let {firstName, lastName} = req.body;
    if (firstName == null || lastName == null) {
        res.status(406);
        res.send("Malformed parameters");
    }
    let result = await manager.createTeacher(firstName, lastName).catch(err => {
        res.status(500).send(err);
    })
    res.send(result);
});

app.post("/class", async (req, res) => {
    let {name, description} = req.body;
    if (name == null || description == null) {
        res.status(406);
        res.send("Malformed parameters");
    }
    let result = await manager.createClass(name, description).catch(err => {
        res.status(500).send(err);
    })

    res.status(200)
})

app.post("/room", async (req, res) => {
    let {name, floor} = req.body;
    if (name == null || floor == null) {
        res.status(406);
        res.send("Malformed parameters");
    }
    let result = await manager.createRoom(name, floor).catch(err => {
        res.status(500).send(err);
    })

    res.send(result);
})

app.post("/time", async (req, res) => {
    let {start, end} = req.body;
    if (start == null || end == null) {
        res.status(406);
        res.send("Malformed parameters");
    }
    let result = await manager.createTime(start, end).catch(err => {
        res.status(500).send(err);
    })

    res.send(result);
})

app.post("/advertising", async (req, res) => {
    let {text, imagePath} = req.body;
    if (text == null || link == null) {
        res.status(406);
        res.send("Malformed parameters");
    }
    let result = await manager.createAdvertising(text, imagePath).catch(err => {
        res.status(500).send(err);
    })

    res.send(result);
})

app.post("/bell", async (req, res) => {
    let {name, soundPath} = req.body;
    if (name == null || soundPath == null) {
        res.status(406);
        res.send("Malformed parameters");
    }
    let result = await manager.createBell(name, soundPath).catch(err => {
        res.status(500).send(err);
    })

    res.send(result);
})

app.post("/schedule", async (req, res) => {
    let {courseId, classId, timeId, dateId} = req.body;
    if (courseId == null || classId == null || timeId == null || dateId == null) {
        res.status(406);
        res.send("Malformed parameters");
    }
    let result = await manager.createSchedule(courseId, classId, timeId, dateId).catch(err => {
        res.status(500).send(err);
    })

    res.send(result);
})

app.post("/course", async (req, res) => {
    let {name, teacherId, roomId} = req.body;
    if (name == null || teacherId == null || roomId == null) {
        res.status(406);
        res.send("Malformed parameters");
    }
    let result = await manager.createCourse(name, teacherId, roomId).catch(err => {
        res.status(500).send(err);
    })

    res.send(result);
})

app.post("/date", async (req, res) => {
    let {date, isHoliday} = req.body;

    if (date == null || isHoliday == null || typeof isHoliday !== "boolean" || moment(date, 'YYYY-MM-DD').isValid() === false) {
        res.status(406);
        res.send("Malformed parameters");
    }
    let result = await manager.createDate(date, isHoliday).catch(err => {
        res.status(500).send(err);
    })

    res.send(result);
})

manager.initializeConnection();
app.listen(port, () => console.log(`App Listening on port ${port}`));
