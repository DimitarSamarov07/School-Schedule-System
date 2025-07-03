import express from "express";
import {SqliteMaster as manager} from "./sqlite_services.js" ;

const app = express(); // Initializing Express App
let port = 6969;

app.get("schedule", (req, res) => {
    let {classId, date} = req.query;
    res.send(manager.getScheduleByClassIdForDate(classId, date));
})

app.get("/test-page", (req, res) => {
    res.send('Hello WORLD. ');
});

app.get("/random", (req, res) => {
        res.send(Math.random(0, 100));
    }
);

app.listen(port, () => console.log(`App Listening on port ${port}`));
