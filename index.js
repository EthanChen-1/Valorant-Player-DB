const express = require('express');
const path = require('path');
const myParser = require('body-parser');
const val_db = express();

const PORT = process.env.PORT || 8080;

val_db.use(myParser.urlencoded({extended: true}));

val_db.get('/', function (req, res) {
    console.log(`connected from ` + req.socket.remoteAddress);
    res.sendFile(path.join(__dirname,'html','mainpage.html'));
});

val_db.get('/css/:file', function(req, res){
    let css_file = req.params;
    console.log(css_file);
    res.sendFile(path.join(__dirname, 'css', `${css_file.file}`));
    console.log(path.join(__dirname, 'css', `${css_file.file}`));
});

val_db.get('/search', function(req, res){
    console.log( req.socket.remoteAddress + " went to " + req.query.playername + " page");
    let get_player_stats = `SELECT * FROM player WHERE ign REGEXP '${req.query.playername}'`;
    let player_stats = "";
    valorant_player_db.query(get_player_stats, function(err, result){
        if(err) throw err;
        console.log(result);
        res.send(`<h1>Player searched for ${req.query.playername}</h1>
                 <h1>${result[0].first_name} "${result[0].ign}" ${result[0].last_name}  </h1> 
                 <h1>Team: ${result[0].team_name}</h1>
                 <h1>Start Date: ${result[0].start_date}</h1>
                    <form id='back-to-search' action="/" method="get">
                        <input type="submit" value="Back to Search">
                    </form>`);
    });
    
});

val_db.post('/add', function (req, res) {
    console.log(req.body);
    res.send(`<h1>${req.body.first_name} "${req.body.ign}" ${req.body.last_name} was added to the Valorant Player Database</h1>`);
  })



//MYSQL
const mysql = require('mysql');
let {host, user, password, database} = require("./auth/auth.json");
const valorant_player_db = mysql.createConnection({
    host: `${host}`,
    user: `${user}`,
    password: `${password}`,
    database: `${database}`
});

valorant_player_db.connect(function(err){
    if(err){
        return console.error('error: ' + err.message);
    }
    console.log(`Connected to the MySQL server on ${database}`);
})

val_db.listen(PORT, () => console.log(`Server started on port:${PORT}`));