const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];


function Initialize() {
    return new Promise((resolve, reject) => {
        if (sets.length === 0) {
            sets = setData.map((set) => {
                const theme = themeData.find((theme) => theme.id === set.theme_id);
                return { ...set, theme: theme.name };
            });
            resolve();
        } else {
            reject("Set already been initialized");
        }
    });
}
function getAllSets() {
    return new Promise((resolve, reject) => {
        if (sets.length > 0) {
            resolve(sets);
        } else {
            reject("No set found");
        }
    });
}

function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        const set = sets.find((set) => set.set_num === setNum);
        if (set) {
            resolve(set);
        } else {
            reject("No set found");
        }
    });
}

function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        const set = sets.filter((set) => set.theme.toLowerCase() === theme.toLowerCase());
        if (set.length > 0) {
            resolve(set);
        } else {
            reject("No set found");
        }
    });
}

module.exports = {
    Initialize,
    getAllSets,
    getSetByNum,
    getSetsByTheme
};

