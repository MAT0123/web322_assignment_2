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
* Published URL: https://web322-assignment-2-etoe.vercel.app/
********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require("express");
const app = express();
legoData.Initialize();
legoData.getAllSets();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.render("home");

});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/lego/sets", (req, res) => {
    const query = req.query.theme;
    const decodedQuery = decodeURIComponent(query);
    if (query) {
        legoData.getSetsByTheme(decodedQuery)
            .then((data) => res.render("sets", {sets: data}))
            .catch((err) => {
                res.status(404).render("404", {message: "Query not found"});
            });
    } else {
        legoData.getAllSets()
            .then((data) => res.render("sets", {sets: data}))
            .catch((err) => {
                res.status(404).render("404", {message: "Query not found"});
            });
    }
});

app.get("/lego/sets/:num", (req, res) => {
    const param = req.params.num;

    legoData.getSetByNum(param)
        .then((data) => res.render("set", {set: data}))
        .catch((err) => {
            res.send(err);
            res.status(404).render("404", {message: "Set not found for set number: " + param});
        });
});

app.use((req, res, next) => {
    res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});

app.listen(8888);
