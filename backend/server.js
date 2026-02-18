require('dotenv').config(); // Loads credentials from your .env file
const express = require('express');
const mysql = require('mysql2/promise'); // Modernized for better performance
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/* ===================================================
   DATABASE CONNECTION POOL
   (Required for deployment and cross-platform stability)
=================================================== */
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'football_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection on server start
db.getConnection()
    .then(conn => {
        console.log("✅ Database Connected Successfully (Pool Initialized)");
        conn.release();
    })
    .catch(err => {
        console.error("❌ DB CONNECTION ERROR:", err.message);
        console.log("Check your .env file and ensure MariaDB/MySQL is running.");
    });

/* ===================================================
   PLAYERS APIs
=================================================== */

// Get all players with club names
app.get('/players', async (req, res) => {
    try {
        const sql = `
            SELECT p.*, c.club_name
            FROM player p
            LEFT JOIN club c ON p.club_id = c.club_id
        `;
        const [data] = await db.query(sql);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get players by specific club
app.get('/players/byclub/:id', async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM player WHERE club_id=?", [req.params.id]);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add a new player
app.post('/players', async (req, res) => {
    try {
        const { f_name, l_name, position, club_id, market_value } = req.body;
        const sql = `
            INSERT INTO player (f_name, l_name, position, club_id, market_value)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.query(sql, [f_name, l_name, position, club_id, market_value]);
        res.json({ message: "Player added successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update an existing player
app.put('/players/:id', async (req, res) => {
    try {
        const { position, club_id, market_value, status } = req.body;
        const sql = `
            UPDATE player
            SET position=?, club_id=?, market_value=?, status=?
            WHERE player_id=?
        `;
        await db.query(sql, [position, club_id, market_value, status, req.params.id]);
        res.json({ message: "Player updated successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete a player
app.delete('/players/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM player WHERE player_id=?", [req.params.id]);
        res.json({ message: "Player deleted successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ===================================================
   CLUB APIs
=================================================== */

// Get all clubs
app.get('/clubs', async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM club");
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add a new club
app.post('/clubs', async (req, res) => {
    try {
        const { club_name, founded_year, country, budget, manager_name } = req.body;
        const sql = `
            INSERT INTO club (club_name, founded_year, country, budget, manager_name)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.query(sql, [club_name, founded_year, country, budget, manager_name]);
        res.json({ message: "Club added successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update a club
app.put('/clubs/:id', async (req, res) => {
    try {
        const { club_name, budget } = req.body;
        await db.query("UPDATE club SET club_name=?, budget=? WHERE club_id=?", [club_name, budget, req.params.id]);
        res.json({ message: "Club updated successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete a club
app.delete('/clubs/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM club WHERE club_id=?", [req.params.id]);
        res.json({ message: "Club deleted successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ===================================================
   STADIUM APIs
=================================================== */

app.get('/stadiums', async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM stadium");
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/stadiums', async (req, res) => {
    try {
        const { stadium_name, city, capacity } = req.body;
        await db.query("INSERT INTO stadium (stadium_name, city, capacity) VALUES (?,?,?)", [stadium_name, city, capacity]);
        res.json({ message: "Stadium added successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/stadiums/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM stadium WHERE stadium_id=?", [req.params.id]);
        res.json({ message: "Stadium deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ===================================================
   MATCH APIs
=================================================== */

app.get('/matches', async (req, res) => {
    try {
        const sql = `
            SELECT m.*, 
            c1.club_name AS home_team,
            c2.club_name AS away_team
            FROM match_info m
            LEFT JOIN club c1 ON m.home_club = c1.club_id
            LEFT JOIN club c2 ON m.away_club = c2.club_id
        `;
        const [data] = await db.query(sql);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/matches', async (req, res) => {
    try {
        const { match_type, match_date, home_club, away_club, stadium_id } = req.body;
        const sql = `
            INSERT INTO match_info (match_type, match_date, home_club, away_club, stadium_id)
            VALUES (?,?,?,?,?)
        `;
        await db.query(sql, [match_type, match_date, home_club, away_club, stadium_id]);
        res.json({ message: "Match added successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/matches/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM match_info WHERE match_id=?", [req.params.id]);
        res.json({ message: "Match deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ===================================================
   ANALYTICS & REPORTS
=================================================== */

// Dashboard Stats (Calculated in parallel for speed)
app.get('/dashboard-summary', async (req, res) => {
    try {
        const [pCount] = await db.query("SELECT COUNT(*) AS totalPlayers FROM player");
        const [cCount] = await db.query("SELECT COUNT(*) AS totalClubs FROM club");
        const [vSum] = await db.query("SELECT SUM(market_value) AS totalValue FROM player");
        const [highest] = await db.query(`
            SELECT CONCAT(f_name,' ',l_name) AS name, market_value
            FROM player
            ORDER BY market_value DESC
            LIMIT 1
        `);

        res.json({
            totalPlayers: pCount[0].totalPlayers,
            totalClubs: cCount[0].totalClubs,
            totalValue: vSum[0].totalValue || 0,
            highestPaid: highest[0] || null
        });
    } catch (err) { res.status(500).json({ error: "Summary failed", details: err.message }); }
});

// Club Report: Player count per club
app.get('/reports', async (req, res) => {
    try {
        const sql = `
            SELECT c.club_name, COUNT(p.player_id) AS total
            FROM club c
            LEFT JOIN player p ON c.club_id = p.club_id
            GROUP BY c.club_name
        `;
        const [data] = await db.query(sql);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ===================================================
   SERVER START
=================================================== */
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});