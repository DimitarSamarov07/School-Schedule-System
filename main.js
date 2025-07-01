import express from "express";

const app = express(); // Initializing Express App
let port = 6968;


app.get("/test-page", (req, res)=>{
    res.send('Hello World');
});

app.listen(port, ()=> console.log(`App Listening on port ${port}`));
