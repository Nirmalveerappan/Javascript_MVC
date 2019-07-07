const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');

let app = express();

let PORT = "1234";
app.use(bodyParser.json({ type: 'application/json' }));
app.get("/users", function (req, res) {
    console.log("data");
    //read the data from file or DB
    fs.readFile('./users.json', (err, data) => {
        if (err) {
            throw err;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        res.status(200).send(data.toString('utf8').replace("/n", ''));
    })

});

app.listen(PORT, () => {
    console.log("simple server started", PORT);
})