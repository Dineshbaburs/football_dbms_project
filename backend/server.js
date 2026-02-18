require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'football_user',
    password: process.env.DB_PASSWORD || 'football_pass',
    database: process.env.DB_NAME || 'football_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

/* --- AUTHENTICATION MODULE --- */
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        res.json({ role: 'admin' });
    } else if (username === 'user' && password === 'user') {
        res.json({ role: 'user' });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

/* --- PLAYERS MODULE (SQL View & Stored Procedure) --- */
app.get('/players', async (req, res) => {
    try {
        // Now selecting from the updated View that includes market_value
        const [data] = await db.query("SELECT * FROM player_club_view");
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/players', async (req, res) => {
    try {
        const { f_name, l_name, age, position, market_value, club_id } = req.body;
        const sql = `INSERT INTO player (f_name, l_name, age, position, market_value, club_id) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [f_name, l_name, age, position, market_value || 0, club_id]);
        res.json({ message: "Player registered! Trigger checked age constraints." });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Implementation of the "Undo" requirement
app.post('/players/undo', async (req, res) => {
    try {
        await db.query("CALL undo_last_player_insert()");
        res.json({ message: "Last registration undone via Stored Procedure" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/players/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM player WHERE player_id=?", [req.params.id]);
        res.json({ message: "Player removed and logged via Trigger" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* --- DASHBOARD & REPORTS (Aggregate Functions) --- */
app.get('/dashboard-summary', async (req, res) => {
    try {
        const [p] = await db.query("SELECT COUNT(*) AS count FROM player");
        const [c] = await db.query("SELECT COUNT(*) AS count FROM club");
        const [val] = await db.query("SELECT SUM(market_value) AS total, AVG(market_value) as avg FROM player");
        res.json({
            totalPlayers: p[0].count,
            totalClubs: c[0].count,
            totalValue: val[0].total || 0,
            avgSalary: val[0].avg || 0
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* --- OTHER ENTITIES --- */
app.get('/clubs', async (req, res) => {
    try { const [data] = await db.query("SELECT * FROM club"); res.json(data); } catch (err) { res.status(500).json(err); }
});

app.get('/contracts', async (req, res) => {
    try {
        const [data] = await db.query("SELECT c.*, p.f_name, p.l_name FROM contract c JOIN player p ON c.player_id = p.player_id");
        res.json(data);
    } catch (err) { res.status(500).json(err); }
});

app.post('/contracts/increase-salaries', async (req, res) => {
    try {
        await db.query("CALL increase_salary()");
        res.json({ message: "Success: Cursor processed all rows to hike salaries by 10%." });
    } catch (err) { res.status(500).json(err); }
});

app.get('/matches', async (req, res) => {
    try {
        const sql = `SELECT m.*, c.club_name, s.stadium_name FROM match_info m JOIN club c ON m.club_id = c.club_id JOIN stadium s ON m.stadium_id = s.stadium_id`;
        const [data] = await db.query(sql);
        res.json(data);
    } catch (err) { res.status(500).json(err); }
});

app.listen(8081, '0.0.0.0', () => console.log("🚀 Server running on port 8081"));