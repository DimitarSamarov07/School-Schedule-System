import express from "express";

const app = express(); // Initializing Express App
let port = 6969;


app.get("/test-page", (req, res)=>{
    res.send('Hello WORLD. ');
});

app.get("/random", (req, res)=>
{
    res.send(Math.random(0,100));
}
);

app.listen(port, ()=> console.log(`App Listening on port ${port}`));
