const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
mongoose.connect(process.env.MONGO_CONNECTION_STRING);
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    loginHistory: [{
        dateTime: Date,
        userAgent: String
    }],
});
let User; 
function initialize() {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(process.env.MONGO_CONNECTION_STRING);
        db.on('error', (err) => {
            reject(err);
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
}
function registerUser(userData) {
    return new Promise(function (resolve, reject) {
        if (userData.password !== userData.password2) {
            reject("Passwords do not match");
        } else {
            let newUser = new User(userData);

            bcrypt.hash(userData.password, 10)
            .then((hash) => {
                newUser.password = hash;
                newUser.save().then(() => {
                    resolve();
                }
                )
                    .catch((err) => {
                        if (err.code === 11000) {
                            reject("User Name already taken");
                        } else {
                            reject(`There was an error creating the user: ${err}`);
                        }
                    }
                    );
            }
            )
            .catch((err) => {
                    reject("There was an error encrypting the password");
                }
                );

       
        }
    });
}
function checkUser(userData) {
    return new Promise(function (resolve, reject) {
        User.find({ userName: userData.userName })
            .then((users) => {
                if (users.length === 0) {
                    reject(`Unable to find user: ${userData.userName}`);
                } else if (!bcrypt.compareSync(userData.password, users[0].password)) {
                    reject(`Incorrect Password for user: ${userData.userName}`);
                } else {
                    if (users[0].loginHistory.length == 8) {
                        users[0].loginHistory.pop();
                    }
                    users[0].loginHistory.unshift({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });
                    User.updateOne({ userName: users[0].userName }, { $set: { loginHistory: users[0].loginHistory } })
                        .then(() => {
                            resolve(users[0]);
                        })
                        .catch((err) => {
                            reject(`There was an error verifying the user: ${err}`);
                        });
                }
            })
            .catch((err) => {
                reject(`Unable to find user: ${userData.userName}`);
            });
    });
}

module.exports = {
    initialize,
    registerUser,
    checkUser
};
