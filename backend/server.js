const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* ---------------- DATABASE CONNECTION ---------------- */

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',            // default for xampp
    database: 'football_system'
});

db.connect(err => {
    if (err) {
        console.log('database error:', err);
    } else {
        console.log('connected to mysql database');
    }
});

/* ---------------- GET ALL PLAYERS ---------------- */

app.get('/players', (req, res) => {
    const sql = `
        select p.player_id, p.f_name, p.l_name, p.position, 
               p.salary, p.email, c.club_name
        from player p
        left join club c on p.club_id = c.club_id
    `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        res.json(data);
    });
});

/* ---------------- INSERT PLAYER ---------------- */

app.post('/players', (req, res) => {
    const sql = `
        insert into player (f_name, l_name, dob, position, salary, club_id, email)
        values (?)
    `;
    const values = [
        req.body.f_name,
        req.body.l_name,
        req.body.dob,
        req.body.position,
        req.body.salary,
        req.body.club_id,
        req.body.email
    ];

    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        res.json("player added successfully");
    });
});

/* ---------------- UPDATE PLAYER SALARY ---------------- */

app.put('/players/:id', (req, res) => {
    const sql = "update player set salary=? where player_id=?";
    db.query(sql, [req.body.salary, req.params.id], (err, data) => {
        if (err) return res.json(err);
        res.json("player updated successfully");
    });
});

/* ---------------- DELETE PLAYER ---------------- */

app.delete('/players/:id', (req, res) => {
    const sql = "delete from player where player_id=?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        res.json("player deleted successfully");
    });
});

/* ---------------- REPORT API (AGGREGATE) ---------------- */

app.get('/reports', (req, res) => {
    const sql = `
        select c.club_name, count(p.player_id) as player_count
        from club c
        left join player p on c.club_id = p.club_id
        group by c.club_name
    `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        res.json(data);
    });
});

/* ---------------- SERVER ---------------- */

app.listen(8081, () => {
    console.log("server running on port 8081");
});
