const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. DATABASE CONNECTION
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',      // Leave empty if you don't have a password
    database: 'football_dbms_project'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database (football_dbms_project).');
});

// ==========================
// API MODULES
// ==========================

// 1. VIEW MODULE: Get all players with Club Names (Joins)
app.get('/players', (req, res) => {
    const sql = `
        SELECT p.Player_ID, p.F_Name, p.L_Name, p.Position, c.Club_Name 
        FROM Player p
        LEFT JOIN Club c ON p.Club_ID = c.Club_ID
        ORDER BY p.Player_ID DESC`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// 2. INSERT MODULE: Add a new player
app.post('/players', (req, res) => {
    const sql = "INSERT INTO Player (F_Name, L_Name, Position, Club_ID) VALUES (?)";
    const values = [
        req.body.f_name,
        req.body.l_name,
        req.body.position,
        req.body.club_id
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Player added successfully!");
    });
});

// 3. DELETE MODULE: Remove a player
app.delete('/players/:id', (req, res) => {
    const sql = "DELETE FROM Player WHERE Player_ID = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Player deleted successfully!");
    });
});

// 4. UPDATE MODULE: Update player position
app.put('/players/:id', (req, res) => {
    const sql = "UPDATE Player SET Position = ? WHERE Player_ID = ?";
    db.query(sql, [req.body.position, req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Player updated successfully!");
    });
});

// 5. REPORTS MODULE: Aggregate Query (Count players per club)
app.get('/reports', (req, res) => {
    const sql = `
        SELECT c.Club_Name, COUNT(p.Player_ID) as Total_Players 
        FROM Club c 
        LEFT JOIN Player p ON c.Club_ID = p.Club_ID 
        GROUP BY c.Club_Name`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("Backend server running on port 8081...");
});