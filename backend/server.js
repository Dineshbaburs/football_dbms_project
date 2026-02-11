const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'football_dbms_project'
});

db.connect(err => {
    if (err) console.error('DB Connection Failed:', err.stack);
    else console.log('Connected to MySQL Database.');
});

// --- API ENDPOINTS ---

// 1. GET PLAYERS (View)
app.get('/players', (req, res) => {
    const sql = `
        SELECT p.Player_ID, p.F_Name, p.L_Name, p.Position, c.Club_Name 
        FROM Player p
        LEFT JOIN Club c ON p.Club_ID = c.Club_ID
        ORDER BY p.Player_ID DESC`;
    db.query(sql, (err, data) => res.json(err || data));
});

// 2. GET CLUBS (For Dropdowns) -- NEW FEATURE
app.get('/clubs', (req, res) => {
    const sql = "SELECT Club_ID, Club_Name FROM Club";
    db.query(sql, (err, data) => res.json(err || data));
});

// 3. ADD PLAYER
app.post('/players', (req, res) => {
    const sql = "INSERT INTO Player (F_Name, L_Name, Position, Club_ID) VALUES (?)";
    const values = [req.body.f_name, req.body.l_name, req.body.position, req.body.club_id];
    db.query(sql, [values], (err, data) => res.json(err || "Player added!"));
});

// 4. DELETE PLAYER
app.delete('/players/:id', (req, res) => {
    const sql = "DELETE FROM Player WHERE Player_ID = ?";
    db.query(sql, [req.params.id], (err, data) => res.json(err || "Player deleted!"));
});

// 5. UPDATE PLAYER
app.put('/players/:id', (req, res) => {
    const sql = "UPDATE Player SET Position = ? WHERE Player_ID = ?";
    db.query(sql, [req.body.position, req.params.id], (err, data) => res.json(err || "Player updated!"));
});

// 6. REPORTS (Stats)
app.get('/reports', (req, res) => {
    const sql = `
        SELECT c.Club_Name, COUNT(p.Player_ID) as Total 
        FROM Club c 
        LEFT JOIN Player p ON c.Club_ID = p.Club_ID 
        GROUP BY c.Club_Name`;
    db.query(sql, (err, data) => res.json(err || data));
});

app.listen(8081, () => {
    console.log("Server running on port 8081...");
});