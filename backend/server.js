// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Allow frontend to talk to backend
app.use(bodyParser.json());

// 1. DATABASE CONNECTION
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Your MySQL username (usually root)
    password: '',      // Your MySQL password
    database: 'football_club_db' // Make sure you created this DB in MySQL
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// 2. API ENDPOINTS (The "Functions" your frontend calls)

// GET: Fetch all players
app.get('/players', (req, res) => {
    const sql = "SELECT * FROM Player";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// POST: Add a new player
app.post('/players', (req, res) => {
    const sql = "INSERT INTO Player (F_Name, L_Name, Position, Club_ID) VALUES (?)";
    const values = [
        req.body.f_name,
        req.body.l_name,
        req.body.position,
        req.body.club_id
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("Player added successfully!");
    });
});

// START SERVER
app.listen(8081, () => {
    console.log("Listening on port 8081...");
});