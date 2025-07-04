import express from "express";
import manager from "./sqlite_services.js" ;
import moment from "moment";

const app = express(); // Initializing Express App
let port = 6969;

app.get("/schedulesByDate", async (req, res) => {
    let {date} = req.query;
    date = moment(date, 'YYYY-MM-DD').format("YYYY-MM-DD");

    res.send(await manager.getAllSchedulesForDateTime(date));

});

app.get("/schedulesByClassIdForDate", async (req, res) => {
    let {classId, date} = req.query;
    date = moment(date).format("YYYY-MM-DD");
    res.send(await manager.getSchedulesByClassIdForDate(parseInt(classId), date));
})


app.get("/runningTime", async (req, res) => {
    let result = await manager.getRunningTime();
    res.status(200).send({currentHour: result});
})

app.get("/test-page", (req, res) => {

    res.send('Hello WORLD. ');
});

app.get("/random", (req, res) => {
        res.send(Math.random(0, 100));
    }
);

manager.initializeConnection();
app.listen(port, () => console.log(`App Listening on port ${port}`));
