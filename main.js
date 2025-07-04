import express from "express";
import manager from "./sqlite_services.js" ;
import {getRawAsset} from "node:sea";

const app = express(); // Initializing Express App
let port = 6969;

app.get("schedule", (req, res) => {
    let {classId, date} = req.query;
    res.send(manager.getScheduleByClassIdForDate(classId, date));
});

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
//manager.getAllSchedulesForDateTime('2025-01-01 15:30')
app.listen(port, ()=> console.log(`App Listening on port ${port}`));
