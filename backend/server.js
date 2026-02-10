const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. CONNECT TO YOUR NEW DATABASE
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',      // Leave empty if you don't have a password
    database: 'football_dbms_project' // Matches the DB you just created
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database (football_dbms_project).');
});

// 2. API ENDPOINTS

// READ (View Players)
app.get('/players', (req, res) => {
    const sql = `
        SELECT p.Player_ID, p.F_Name, p.L_Name, p.Position, c.Club_Name 
        FROM Player p
        LEFT JOIN Club c ON p.Club_ID = c.Club_ID
        ORDER BY p.Player_ID ASC`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// CREATE (Add Player)
app.post('/players', (req, res) => {
    const sql = "INSERT INTO Player (F_Name, L_Name, Position, Club_ID) VALUES (?)";
    const values = [req.body.f_name, req.body.l_name, req.body.position, req.body.club_id];
    db.query(sql, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Player added successfully!");
    });
});

// UPDATE (Change Position)
app.put('/players/:id', (req, res) => {
    const sql = "UPDATE Player SET Position = ? WHERE Player_ID = ?";
    db.query(sql, [req.body.position, req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Player updated successfully!");
    });
});

// DELETE (Remove Player)
app.delete('/players/:id', (req, res) => {
    const sql = "DELETE FROM Player WHERE Player_ID = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Player deleted successfully!");
    });
});

// REPORT (Count Players per Club)
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