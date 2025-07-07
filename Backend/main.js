import express from "express";
import manager from "./sqlite_services.js" ;
import moment from "moment";

const app = express(); // Initializing Express App
let port = 6969;

app.get("/schedulesByDate", async (req, res) => {
    let {date} = req.query;
    date = moment(date, 'YYYY-MM-DD');
    let result = await manager.getAllSchedulesForDate(date).catch(err => {
        res.status(500);
    })
    res.send(result);

});
app.get("/schedulesByDateTime", async (req, res) => {
    let {date, time} = req.query;
    date = moment(date, 'YYYY-MM-DD').format("YYYY-MM-DD");
    res.send(await manager.getAllSchedulesForDateTime(date, time));

});

app.get("/schedulesByClassIdForDate", async (req, res) => {
    let {classId, date} = req.query;
    if (date == null || classId == null) {
        res.status(406);
        res.send("Malformed parameters");
    }
    try{
        date = moment(date).format("YYYY-MM-DD");
    }
    catch (e) {
        res.status(406);
        res.send("Malformed date");
    }

    let classIdParsed = parseInt(classId);
    if (isNaN(classIdParsed)) {
        res.status(406);
        res.send("Malformed classId");
    }

    res.send(await manager.getSchedulesByClassIdForDate(classIdParsed, date));
})


app.get("/runningTime", async (req, res) => {
    let result = await manager.getRunningTime();
    res.status(200).send({currentHour: result});
})

// app.post("/delete")

manager.initializeConnection();
app.listen(port, () => console.log(`App Listening on port ${port}`));
