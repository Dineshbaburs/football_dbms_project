require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Using exactly what we defined in Phase 1
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10
});

/* --- AUTHENTICATION --- */
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Hardcoded roles as per requirements
    if (username === 'admin' && password === 'admin') {
        res.json({ role: 'admin' });
    } else if (username === 'user' && password === 'user') {
        res.json({ role: 'user' });
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});

/* --- PLAYERS (View & Procedure) --- */
app.get('/players', async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM player_club_view");
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/players', async (req, res) => {
    try {
        const { f_name, l_name, age, position, market_value, club_id } = req.body;
        const sql = `INSERT INTO player (f_name, l_name, age, position, market_value, club_id) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [f_name, l_name, age, position, market_value || 0, club_id]);
        res.json({ message: "Player added! Trigger verified constraints." });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/players/undo', async (req, res) => {
    try {
        await db.query("CALL undo_last_player_insert()");
        res.json({ message: "Last entry undone successfully via Stored Procedure" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/players/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM player WHERE player_id=?", [req.params.id]);
        res.json({ message: "Player deleted (Logged in Audit Table)" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* --- REPORTS (Aggregate Functions) --- */
app.get('/dashboard-summary', async (req, res) => {
    try {
        const [p] = await db.query("SELECT COUNT(*) as totalPlayers FROM player");
        const [c] = await db.query("SELECT COUNT(*) as totalClubs FROM club");
        const [stats] = await db.query("SELECT SUM(market_value) as totalVal, AVG(market_value) as avgVal FROM player");
        res.json({
            totalPlayers: p[0].totalPlayers,
            totalClubs: c[0].totalClubs,
            totalValue: stats[0].totalVal || 0,
            avgSalary: stats[0].avgVal || 0
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* --- OTHER MODULES --- */
app.get('/clubs', async (req, res) => {
    try { const [data] = await db.query("SELECT * FROM club"); res.json(data); } catch (e) { res.status(500).send(e); }
});

app.get('/contracts', async (req, res) => {
    try {
        const [data] = await db.query("SELECT c.*, p.f_name, p.l_name FROM contract c JOIN player p ON c.player_id = p.player_id");
        res.json(data);
    } catch (e) { res.status(500).send(e); }
});

app.post('/contracts/increase-salaries', async (req, res) => {
    try {
        await db.query("CALL increase_salary()");
        res.json({ message: "Salary hike processed for all players via Cursor" });
    } catch (e) { res.status(500).send(e); }
});

app.get('/matches', async (req, res) => {
    try {
        const sql = `SELECT m.*, c.club_name, s.stadium_name FROM match_info m JOIN club c ON m.club_id = c.club_id JOIN stadium s ON m.stadium_id = s.stadium_id`;
        const [data] = await db.query(sql);
        res.json(data);
    } catch (e) { res.status(500).send(e); }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 System Online: Port ${PORT}`));