const sqlite3= require('sqlite3').verbose();
const db = new sqlite3.Database('./connection.db')

// let sql = 'ADD TABLE "userData0" ("ID"	INTEGER NOT NULL,"mouseX"	REAL NOT NULL,"mouseY"	REAL NOT NULL,"mouseL"	INTEGER NOT NULL,"mouseR"	INTEGER NOT NULL,"mouseS"	INTEGER NOT NULL,"activeKeys"	NUMERIC,"reciveScreenX"	INTEGER NOT NULL,"reciveScreenY"	NUMERIC NOT NULL,"sendScreenX"	INTEGER NOT NULL,"sendScreenY"	INTEGER NOT NULL,PRIMARY KEY("ID"))'
// db.run(sql)

// let sql = 'INSERT INTO userData0 (ID, mouseX, mouseY, mouseS, activeKeys, reciveScreenX, reciveScreenY, sendScreenX, sendScreenY, mouseLD, MouseLU, mouseRD, MouseRU, Username, Password) VALUES (901235, 0, 0, 0, "w", 90, 90, 90, 90, 0, 0, 0, 0, "Jincfer", "tempTest");'
// db.run(sql)

// let sql = `
// UPDATE userData0 
// SET mouseX = 99, mouseY = 99, mouseL = 0, mouseR = 0, mouseS = 0, activeKeys = '["h", "e", "l", "l", "o", " ", "t", "h", "e", "r", "e"]' 
// WHERE ID = 905678`
// // console.log(sql)
// db.run(sql)

// let sql = `
// CREATE TABLE "userData0" (
// 	"ID"	INTEGER NOT NULL,
// 	"mouseX"	REAL NOT NULL,
// 	"mouseY"	REAL NOT NULL,
// 	"mouseS"	INTEGER NOT NULL,
// 	"activeKeys"	NUMERIC,
// 	"reciveScreenX"	INTEGER NOT NULL,
// 	"reciveScreenY"	NUMERIC NOT NULL,
// 	"sendScreenX"	INTEGER NOT NULL,
// 	"sendScreenY"	INTEGER NOT NULL, mouseLD INTEGER, MouseLU INTEGER, mouseRD INTEGER, MouseRU INTEGER, Username TEXT, Password TEXT,
// 	PRIMARY KEY("ID")
// )`
// db.run(sql)

let sql0 = `SELECT * FROM userData0`;
db.all(sql0, [], (err, rows) => {
    console.log(rows)
})

