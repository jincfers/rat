const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer')
const path = require('path');

const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        const id = req.params.id;
        cb(null, `${id}.jpg`);
    }
});
const upload = multer({storage: storage})

const PORT = 22

const db = new sqlite3.Database('./connection.db')

// view engine setup
app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.json())

app.get('/', (req, res) => {
    console.log(Date.now()+': / path recieved via get. Sending index.html to ' + req.connection.remoteAddress)
    res.render('index')
})

app.get('/connect', (req, res) => {
    console.log(Date.now()+': /connect path recieved via get. Sending connect.html to ' + req.connection.remoteAddress)
    res.render('connect')
})

app.get('/connected', (req, res) => {
    console.log(Date.now()+': /connected path recieved via get. Sending connected.html & '+req.body+' to ' + req.connection.remoteAddress)
    let id = req.query.id;
    /*for (let i in sqlId) {
        if (ID == sqlId[i]) {
            sqlRowId = i;
            window.location.replace('http://localhost:3000/connect' + ID)
        }
    }*/
    let sql = `SELECT * FROM userData0 WHERE ID like ` + id;
    db.all(sql, [], (err, rows) => {
        if (err) return console.log(err.message);
        //console.log(rows[0].mouseX)
        try {
            res.render("connected", { ID: rows[0].ID })
        }
        catch (err) {
            res.render('404', {error: err})
        }
    })
})

app.get('/api/connectDataStream/:id', (req, res) => {
    console.log(Date.now()+': /api/connectedDataStream/' + req.params.id + ' path recieved via get. Sending '+req.body+' to ' + req.connection.remoteAddress)
    let id = req.params.id;
    let sql = `SELECT * FROM userData0 WHERE ID like ` + id;
    db.all(sql, [], (err, rows) => {
        if (err) return console.log(err.message);
        // console.log('Data sent to the client: ' + rows[0])
        res.json({ sqlData: rows[0] })
    })
});

app.post('/api/connectDataStream/:id', (req, res) => {
    console.log(Date.now()+': /api/connectedDataStream/' + req.params.id + ' path recieved via post. Updating database with '+req.body+' from ' + req.connection.remoteAddress)
    const data = req.body
    // console.log('Recieved the data:    '/* + data.ID*/ + data.mouseX + ' ' + data.mouseY + ' ' + data.mouseL + ' ' + data.mouseR + ' ' + data.mouseS +
    // ' ' + JSON.stringify(data.activeKeys) + ' ' + data.reciveScreenX + ' ' + data.reciveScreenY) //sucsess! returns the id  

    let sql = `
    UPDATE userData0 
    SET mouseX = ?, mouseY = ?, mouseS = ?, activeKeys = ?, reciveScreenX = ?, reciveScreenY = ?, mouseLD = ?, MouseLU = ?, mouseRD = ?, MouseRU = ? 
    WHERE ID = ?`
    // console.log(sql)
    db.run(sql, [
        data.mouseX, data.mouseY, data.mouseS,
        JSON.stringify(data.activeKeys), data.reciveScreenX, data.reciveScreenY, data.mouseLD, data.MouseLU, data.mouseRD, data.MouseRU, data.ID
    ], function (err) {
        if (err) {
            console.error("DB update error:", err.message);
        } else {
            // console.log("User updated!");
        }
    });
    res.send(data)
});

app.get('/download', (req, res) => {
    console.log(Date.now()+': /download path recieved via get. Sending download.html to ' + req.connection.remoteAddress)
    res.render('download')
})

app.get('/cApi/sqlData/:id', (req, res) => {
    console.log(Date.now()+': /cApi/sqlData/' + req.params.id + ' path recieved via get. Sending '+req.body+' to ' + req.connection.remoteAddress)
    let id = req.params.id;
    let sql = `SELECT * FROM userData0 WHERE ID like ` + id;
    db.all(sql, [], (err, rows) => {
        if (err) return console.log(err.message);
        // console.log(JSON.stringify({sqlData: rows}))
        res.json({ sqlData: rows })
    })
})

app.post('/cApi/sqlData/:id', (req, res) => {
    console.log(Date.now()+': /cApi/sqlData/' + req.params.id + ' path recieved via post. Updating database with '+req.body+' from ' + req.connection.remoteAddress)
    const data = req.body
    // console.log(data)
    // console.log('Recieved the data:    '/* + data.ID*/ + data.mouseX + ' ' + data.mouseY + ' ' + data.mouseL + ' ' + data.mouseR + ' ' + data.mouseS +
    // ' ' + JSON.stringify(data.activeKeys) + ' ' + data.reciveScreenX + ' ' + data.reciveScreenY) //sucsess! returns the id  

    let sql = `
    UPDATE userData0 
    SET sendScreenX = ?, sendScreenY = ?, mouseLD = ?, MouseLU = ?, mouseRD = ?, MouseRU = ?, mouseS = ?, activeKeys = ? 
    WHERE ID = ?`
    // console.log(sql)
    db.run(sql, [
        data.sendScreenX, data.sendScreenY, data.MouseLD, data.mouseLU, data.MouseRD, data.mouseRU, data.mouseS, data.activeKeys, data.ID
    ], function (err) {
        if (err) {
            console.error("DB update error:", err.message);
        } else {
            // console.log("User updated!");
        }
    });
    res.send(data)
});

app.post('/cApi/img/:id', upload.single('test'), (req, res) => {
    console.log(Date.now()+': /cApi/img/' + req.params.id + ' path recieved via post. Updating ' + req.params.id + '.jpg with image from ' + req.connection.remoteAddress)
    // console.log('File recieved')
    res.send('ok')
})

app.listen(PORT, '0.0.0.0');
console.log('Server running. Listening on port: ' + PORT)