// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. DATABASE CONNECTION (FIXED NAME)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',      // ENTER YOUR PASSWORD HERE IF YOU HAVE ONE
    database: 'football_dbms_project' // Fixed: Matches your setup.sql
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database (football_dbms_project).');
});

// ==========================
// ROUTES (API ENDPOINTS)
// ==========================

// 1. GET: Fetch all players (View)
app.get('/players', (req, res) => {
    const sql = `
        SELECT p.Player_ID, p.F_Name, p.L_Name, p.Position, c.Club_Name 
        FROM Player p
        LEFT JOIN Club c ON p.Club_ID = c.Club_ID
    `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// 2. POST: Add a new player (Insert)
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

// 3. DELETE: Remove a player (Delete) -- REQUIRED FOR GUIDELINES
app.delete('/players/:id', (req, res) => {
    const sql = "DELETE FROM Player WHERE Player_ID = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        return res.json("Player deleted successfully!");
    });
});

// 4. PUT: Update a player's position (Update) -- REQUIRED FOR GUIDELINES
app.put('/players/:id', (req, res) => {
    const sql = "UPDATE Player SET Position = ? WHERE Player_ID = ?";
    db.query(sql, [req.body.position, req.params.id], (err, data) => {
        if (err) return res.json(err);
        return res.json("Player updated successfully!");
    });
});

// 5. GET: Report (Aggregation) -- REQUIRED FOR REPORTS MODULE
// Counts how many players are in each club
app.get('/stats', (req, res) => {
    const sql = `
        SELECT c.Club_Name, COUNT(p.Player_ID) as Player_Count 
        FROM Club c 
        LEFT JOIN Player p ON c.Club_ID = p.Club_ID 
        GROUP BY c.Club_Name`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Start Server
app.listen(8081, () => {
    console.log("Server running on port 8081...");
});