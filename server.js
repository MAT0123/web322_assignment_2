/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Matthew Tjoa Student ID: 166179226 Date: 28 May 2024
*
* Published URL: https://web322-assignment-2-etoe-iy4lpwis9-mat0123s-projects.vercel.app/
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require("express");
const app = express();
legoData.Initialize();
app.listen(2222);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


app.get("/", (req, res) => {
    res.send("Assignment 2: Matthew Tjoa - 166179226");
}
);

app.get("/lego/sets", (req, res) => {
    legoData.getAllSets()
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
});

app.get("/lego/sets/num-demo", (req, res) => {
    legoData.getSetByNum("001-1")
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
});

app.get("/lego/sets/theme-demo", (req, res) => {
    legoData.getSetsByTheme("199")
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
}
);

