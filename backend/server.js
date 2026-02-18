require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/* ===================================================
   DATABASE CONNECTION POOL
   (Configured for Docker/Linux/Windows via .env)
=================================================== */
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'football_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

/* ===================================================
   AUTH MODULE (Admin vs User Roles)
=================================================== */
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Standard academic roles
    if (username === 'admin' && password === 'admin') {
        res.json({ role: 'admin' });
    } else if (username === 'user' && password === 'user') {
        res.json({ role: 'user' });
    } else {
        res.status(401).json({ error: "Invalid Credentials. Use admin/admin or user/user" });
    }
});

/* ===================================================
   DASHBOARD (Aggregate & Date Functions)
=================================================== */
app.get('/dashboard-summary', async (req, res) => {
    try {
        const [pCount] = await db.query("SELECT COUNT(*) AS total FROM player");
        const [cCount] = await db.query("SELECT COUNT(*) AS total FROM club");
        // Using SUM and AVG (Aggregate functions) from the contract table
        const [stats] = await db.query("SELECT SUM(salary) AS totalBudget, AVG(salary) AS avgSalary FROM contract");

        res.json({
            totalPlayers: pCount[0].total,
            totalClubs: cCount[0].total,
            totalBudget: stats[0].totalBudget || 0,
            avgSalary: stats[0].avgSalary || 0
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ===================================================
   PLAYERS MODULE (Using the SQL VIEW)
=================================================== */
// This satisfies the "VIEW" requirement of your project
app.get('/players', async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM player_club_view");
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/players', async (req, res) => {
    const { f_name, l_name, age, position, nationality, market_value, club_id } = req.body;
    try {
        // Trigger Check: The 'before_player_insert' trigger in your SQL 
        // will throw an error if age < 15. We catch that here.
        const sql = "INSERT INTO player (f_name, l_name, age, position, nationality, market_value, club_id) VALUES (?,?,?,?,?,?,?)";
        await db.query(sql, [f_name, l_name, age, position, nationality, market_value, club_id]);
        res.json({ message: "Player added successfully" });
    } catch (err) {
        res.status(400).json({ error: "DB Error: " + err.message });
    }
});

app.delete('/players/:id', async (req, res) => {
    try {
        // The 'after_player_delete' trigger will automatically log this in player_log
        await db.query("DELETE FROM player WHERE player_id = ?", [req.params.id]);
        res.json({ message: "Player deleted. Action logged in audit table via Trigger." });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ===================================================
   CONTRACTS MODULE (Using the CURSOR / PROCEDURE)
=================================================== */
app.get('/contracts', async (req, res) => {
    try {
        const sql = `
            SELECT c.*, p.f_name, p.l_name 
            FROM contract c 
            JOIN player p ON c.player_id = p.player_id
        `;
        const [data] = await db.query(sql);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// This route calls the row-by-row CURSOR procedure
app.post('/contracts/increase-salaries', async (req, res) => {
    try {
        await db.query("CALL increase_salary()");
        res.json({ message: "Success: All salaries increased by 10% using row-by-row Cursor processing." });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ===================================================
   CLUBS & STADIUMS
=================================================== */
app.get('/clubs', async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM club");
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/stadiums', async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM stadium");
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ===================================================
   MATCHES MODULE (Joins & String Functions)
=================================================== */
app.get('/matches', async (req, res) => {
    try {
        const sql = `
            SELECT m.match_id, m.match_date, UPPER(m.match_type) as type, 
                   c.club_name, s.stadium_name
            FROM match_info m
            JOIN club c ON m.club_id = c.club_id
            JOIN stadium s ON m.stadium_id = s.stadium_id
            ORDER BY m.match_date DESC
        `;
        const [data] = await db.query(sql);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ===================================================
   START SERVER
=================================================== */
const PORT = process.env.PORT || 8081;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server fully operational on port ${PORT}`);
    console.log(`🔗 Connected to database: ${process.env.DB_NAME || 'football_db'}`);
});