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
const path = require('path');
const authData = require("./modules/auth-service");
const clientSessions = require("client-sessions");
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));

app.use(clientSessions({
    cookieName: "session",
    secret: "web322_assignment_2",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
function ensureLogin(req, res, next) {
    return (req, res, next) => {
        if (!req.session.user) {
            res.redirect("/login");
        } else {
            next();
        }
    };
}
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});
app.get("/lego/addSet", ensureLogin(), (req, res) => {
    legoData.getAllThemes()
    .then((data) => { res.render("addSet", { themes: data }) }).catch((err) => {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
    
});
app.post("/lego/addSet", ensureLogin() ,(req, res) => {
    const addSet = legoData.addSet(req.body).then((data) => {
        res.redirect("/lego/sets");
    }).catch((err) => {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
});
app.get("/lego/sets", ensureLogin(), (req, res) => {
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
app.get("/lego/deleteSet/:num", ensureLogin(), (req, res) => {
    legoData.deleteSet(req.params.num)
        .then((data) => {
            res.redirect("/lego/sets");
        })
        .catch((err) => {
            res.render("500", {message: `I'm sorry, but we have encountered the following error: ${err}`});
        });

}
);
app.get("/lego/editSet/:num", ensureLogin(),(req, res) => {
    const num = req.params.num;
    const set = legoData.getSetByNum(num);
    const themes = legoData.getAllThemes();

    Promise.all([set, themes])
        .then((data) => {
            res.render("editSet", {set: data[0], themes: data[1]});
        })
        .catch((err) => {
            res.status(404).render("404", {message: err});
        });
}
);

app.post("/lego/editSet",ensureLogin(), (req, res) => {
    console.log(req.body);
    legoData.editSet(req.body.set_num, req.body)
        .then((data) => {
            res.redirect("/lego/sets");
        })
        .catch((err) => {
            res.render("500", {message: `I'm sorry, but we have encountered the following error: ${err}`});
        });
}
);

app.get("/lego/sets/:num", ensureLogin() ,(req, res) => {
    const param = req.params.num;

    legoData.getSetByNum(param)
        .then((data) => res.render("set", {set: data}))
        .catch((err) => {
            res.send(err);
            res.status(404).render("404", {message: "Set not found for set number: " + param});
        });
});

app.get("/login", (req, res) => {
    res.render("login" , {errorMessage: ""});
}
);
app.get("/register", (req, res) => {
    res.render("register" , {errorMessage: "" , successMessage: ""});
}
);

app.post("/register", (req, res) => {
    authData.registerUser(req.body)
        .then((data) => {
            res.redirect("/login");
            //res.render("register", {successMessage: "User created" , errorMessage: ""});
        })
        .catch((err) => {
            res.render("register", {errorMessage: err, userName: req.body.userName});
        });
}
);

app.post("/login", (req, res) => {
    req.body.userAgent = req.get('User-Agent');
    authData.checkUser(req.body)
        .then((user) => {
            req.session.user = {
                userName: user.userName,
                email: user.email,
                loginHistory: user.loginHistory
            };
            res.redirect('/lego/sets');
        })
        .catch((err) => {
            res.render("login", {errorMessage: err, userName: req.body.userName});
        });
}
);
app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect('/');
}
);
app.get("/userHistory", ensureLogin(), (req, res) => {
    res.render("userHistory");
}
);
app.use((req, res, next) => {
    res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});

app.listen(5555);
