import express from "express";
import manager from "./sqlite_services.js" ;
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
        date = moment(date, 'YYYY-MM-DD');
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

// Teachers

// Create
app.post("/teacher", async (req, res) => {

})

manager.initializeConnection();
app.listen(port, () => console.log(`App Listening on port ${port}`));
