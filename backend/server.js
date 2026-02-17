const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'football_system'
});

db.connect(err => {
    if (err) console.log(err);
    else console.log('connected to mysql database');
});

/* VIEW PLAYERS */
app.get('/players', (req, res) => {
    const sql = `
        select p.player_id, p.f_name, p.l_name, p.position, c.club_name
        from player p
        left join club c on p.club_id = c.club_id
    `;
    db.query(sql, (err, data) => res.json(data));
});

/* CLUBS */
app.get('/clubs', (req, res) => {
    db.query("select club_id, club_name from club", (err, data) => res.json(data));
});

/* INSERT */
app.post('/players', (req, res) => {
    const sql = "insert into player (f_name, l_name, position, club_id) values (?)";
    const values = [req.body.f_name, req.body.l_name, req.body.position, req.body.club_id];
    db.query(sql, [values], () => res.json("added"));
});

/* UPDATE */
app.put('/players/:id', (req, res) => {
    db.query("update player set position=? where player_id=?", [req.body.position, req.params.id], () => res.json("updated"));
});

/* DELETE */
app.delete('/players/:id', (req, res) => {
    db.query("delete from player where player_id=?", [req.params.id], () => res.json("deleted"));
});

/* REPORT */
app.get('/reports', (req, res) => {
    const sql = `
        select c.club_name, count(p.player_id) as player_count
        from club c
        left join player p on c.club_id = p.club_id
        group by c.club_name
    `;
    db.query(sql, (err, data) => res.json(data));
});

app.listen(8081, () => console.log("server running on port 8081"));
