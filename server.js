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
legoData.getAllSets();
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    //res.send("Assignment 2: Matthew Tjoa - 166179226");
    res.sendFile(__dirname + "/views/home.html");

});

app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/views/about.html");
});

app.get("/lego/sets", (req, res) => {
    const query = req.query.theme;
    const decodedQuery = decodeURIComponent(query);

    if (query) {
        legoData.getSetsByTheme(decodedQuery)
            .then((data) => res.json(data))
            .catch((err) => {
                res.status(404);
                res.send(err);
            });
    } else {
        legoData.getAllSets()
            .then((data) => res.json(data))
            .catch((err) => {
                res.status(404);
                res.send(err);
            });
    }
});

app.get("/lego/sets/:num", (req, res) => {
    const param = req.params.num;

    legoData.getSetByNum(param)
        .then((data) => res.json(data))
        .catch((err) => {
            res.status(404);
            res.send(err);
        });
});

app.use((req, res, next) => {
    res.status(404);
    res.sendFile(__dirname + "/views/404.html");
});

app.listen(8888);
