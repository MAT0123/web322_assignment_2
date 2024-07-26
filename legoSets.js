require('dotenv').config();
//  const setData = require("../data/setData");
//  const themeData = require("../data/themeData");
const { Sequelize } = require('sequelize');

let sequelize = new Sequelize("neondb", "neondb_owner", "QjTAugf2Fi4U", {
    host: "ep-green-bird-a57k9tt5-pooler.us-east-2.aws.neon.tech",
    dialect: 'postgres',
    port: 5432,
    dialectModule: require('pg'),
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });

//let sets = [];
const Theme = sequelize.define('Theme', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING
});

const Set = sequelize.define('Set', {
    set_num: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING
});

Set.belongsTo(Theme, { foreignKey: 'theme_id' });

function deleteSet(set_num) {
    return new Promise((resolve, reject) => {
        Set.destroy({
            where: {
                set_num: set_num
            }
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err.errors[0].message);
        });
    });
}


function Initialize() {
    return new Promise((resolve, reject) => {
        // if (sets.length === 0) {
        //     sets = setData.map((set) => {
        //         const theme = themeData.find((theme) => theme.id === set.theme_id);
        //         return { ...set, theme: theme.name };
        //     });
        //     resolve();
        // } else {
        //     reject("Set already been initialized");
        // }
        sequelize.sync().then(() => {
            resolve();
        }).catch((err) => {
            reject("Unable to sync the database");
        })
    });
}
function addSet(setData) {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            Set.create({
                set_num: setData.set_num,
                name: setData.name,
                year: setData.year,
                num_parts: setData.num_parts,
                theme_id: setData.theme_id,
                img_url: setData.img_url
            }).then(() => {
                resolve();
            })
        }).catch((err) => {
            reject(err.errors[0].message);
        })
       
    }); 

}

function getAllSets() {
    return new Promise((resolve, reject) => {
        // if (sets.length > 0) {
        //     resolve(sets);
        // } else {
        //     reject("No set found");
        // }

        Set.findAll({
            include: Theme
        }).then((sets) => {
            resolve(sets);
        }).catch((err) => {
            reject("No set found");
        });

    });
}
function getAllThemes() {
    return new Promise((resolve, reject) => {
        Theme.findAll().then((themes) => {
            resolve(themes);
        }).catch((err) => {
            reject("No theme found");
        });
    });
}
function editSet(set_num, setData) {
    return new Promise((resolve, reject) => {
        Set.update({
            name: setData.name,
            year: setData.year,
            num_parts: setData.num_parts,
            theme_id: setData.theme_id,
            img_url: setData.img_url
        }, {
            where: {
                set_num: set_num
            }
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err.errors[0].message);
        });
    });
}

function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        // const set = sets.find((set) => set.set_num === setNum);
        // if (set) {
        //     resolve(set);
        // } else {
        //     reject("No set found");
        // }
 
        Set.findAll({
            include: [Theme],
            where: {
                set_num: setNum
            }
        }).then((set) => {
            if (set.length > 0) {
                resolve(set[0]);
            } else {
                reject("Unable to find requested set");
            }
        }).catch((err) => {
            reject("Unable to find requested set");
        });
});
}

function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        // const set = sets.filter((set) => set.theme.toLowerCase() === theme.toLowerCase());
        // if (set.length > 0) {
        //     resolve(set);
        // } else {
        //     reject("No set found");
        // }

        Set.findAll({
            include: [Theme],
            where: {
                '$Theme.name$': {
                    [Sequelize.Op.iLike]: `%${theme}%`
                }
            }
        }).then((sets) => {
            if (sets.length > 0) {
                resolve(sets);
            } else {
                reject("Unable to find requested sets");
            }
        }).catch((err) => {
            reject("Unable to find requested sets");
        }
    );
    });
}

module.exports = {
    Initialize,
    getAllSets,
    getAllThemes,
    getSetByNum,
    getSetsByTheme,
    editSet,
    deleteSet,
};

// sequelize
//   .sync()
//   .then(async () => {
//     try {
//       await Theme.bulkCreate(themeData);
//       await Set.bulkCreate(setData);
//       console.log("-----");
//       console.log("Data inserted successfully");
//     } catch (err) {
//       console.log("-----");
//       console.log(err.message);

//       // NOTE: If you receive the error:
//       // "insert or update on table 'Sets' violates foreign key constraint 'Sets_theme_id_fkey'"
//       // it is because you have a "set" in your collection that has a "theme_id" that does not exist in the "themeData".   
//       // To fix this, use PgAdmin to delete the newly created "Themes" and "Sets" tables, fix the error in your .json files and re-run this code
//     }

//     process.exit();
//   })
//   .catch((err) => {
//     console.log('Unable to connect to the database:', err);
//   });
