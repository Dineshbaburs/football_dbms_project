require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'football_user',
    password: process.env.DB_PASSWORD || 'football_pass',
    database: process.env.DB_NAME || 'football_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

// Authentication
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.query('SELECT role FROM users WHERE username = ? AND password = ?', [username, password]);
        if (users.length > 0) {
            res.json({ role: users[0].role });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* --- CLUBS MODULE --- */
app.get('/clubs', async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM club");
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* --- PLAYERS MODULE --- */
app.get('/players', async (req, res) => {
    try {
        // Querying the VIEW directly fixes UI "undefined" issues
        const [data] = await db.query("SELECT * FROM player_details_view");
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/players', async (req, res) => {
    try {
        const { first_name, last_name, dob, nationality, position, market_value, club_id } = req.body;
        const sql = `INSERT INTO player (first_name, last_name, dob, nationality, position, market_value, club_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [first_name, last_name, dob, nationality, position, market_value || 0, club_id || null]);
        res.json({ message: "Player registered successfully!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/players/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM player WHERE player_id = ?", [req.params.id]);
        res.json({ message: "Player deleted!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* --- REPORTS MODULE --- */
app.get('/reports/stats', async (req, res) => {
    try {
        // Required Aggregate Query (COUNT, SUM, AVG)
        const [data] = await db.query(`
            SELECT c.club_name, COUNT(p.player_id) as total_players, SUM(p.market_value) as total_market_value, AVG(p.market_value) as avg_market_value
            FROM club c LEFT JOIN player p ON c.club_id = p.club_id GROUP BY c.club_id HAVING total_players > 0 ORDER BY total_market_value DESC
        `);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/reports/increase-salaries', async (req, res) => {
    try {
        await db.query("CALL increase_salaries_cursor(10)");
        res.json({ message: "Salaries successfully increased by 10% using Cursor procedure!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));