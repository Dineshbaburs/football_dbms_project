const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'football_db'
});

db.connect(err => {
    if (err) console.log("DB ERROR:", err);
    else console.log("Connected to MySQL");
});

/* ===================================================
   PLAYERS APIs
=================================================== */

// Get all players
app.get('/players', (req, res) => {
    const sql = `
        select p.*, c.club_name
        from player p
        left join club c on p.club_id = c.club_id
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// Get players by club
app.get('/players/byclub/:id', (req, res) => {
    db.query(
        "select * from player where club_id=?",
        [req.params.id],
        (err, data) => res.json(data)
    );
});

// Add player
app.post('/players', (req, res) => {
    const sql = `
        insert into player 
        (f_name, l_name, position, club_id, market_value)
        values (?,?,?,?,?)
    `;
    const values = [
        req.body.f_name,
        req.body.l_name,
        req.body.position,
        req.body.club_id,
        req.body.market_value
    ];
    db.query(sql, values, (err) => {
        if (err) return res.status(500).json(err);
        res.json({message:"Player added"});
    });
});

// Update player
app.put('/players/:id', (req, res) => {
    const sql = `
        update player
        set position=?, club_id=?, market_value=?, status=?
        where player_id=?
    `;
    db.query(sql, [
        req.body.position,
        req.body.club_id,
        req.body.market_value,
        req.body.status,
        req.params.id
    ], () => res.json({message:"Player updated"}));
});

// Delete player
app.delete('/players/:id', (req, res) => {
    db.query("delete from player where player_id=?", [req.params.id],
        () => res.json({message:"Player deleted"})
    );
});

/* ===================================================
   CLUB APIs
=================================================== */

app.get('/clubs', (req, res) => {
    db.query("select * from club", (err, data) => res.json(data));
});

app.post('/clubs', (req, res) => {
    const sql = `
        insert into club 
        (club_name, founded_year, country, budget, manager_name)
        values (?,?,?,?,?)
    `;
    db.query(sql, [
        req.body.club_name,
        req.body.founded_year,
        req.body.country,
        req.body.budget,
        req.body.manager_name
    ], () => res.json({message:"Club added"}));
});

app.put('/clubs/:id', (req, res) => {
    db.query(
        "update club set club_name=?, budget=? where club_id=?",
        [req.body.club_name, req.body.budget, req.params.id],
        () => res.json({message:"Club updated"})
    );
});

app.delete('/clubs/:id', (req, res) => {
    db.query("delete from club where club_id=?", [req.params.id],
        () => res.json({message:"Club deleted"})
    );
});

/* ===================================================
   STADIUM APIs
=================================================== */

app.get('/stadiums', (req, res) => {
    db.query("select * from stadium", (err, data) => res.json(data));
});

app.post('/stadiums', (req, res) => {
    db.query(
        "insert into stadium (stadium_name, city, capacity) values (?,?,?)",
        [req.body.stadium_name, req.body.city, req.body.capacity],
        () => res.json({message:"Stadium added"})
    );
});

/* ===================================================
   MATCH APIs
=================================================== */

app.get('/matches', (req, res) => {
    const sql = `
        select m.*, 
        c1.club_name as home_team,
        c2.club_name as away_team
        from match_info m
        left join club c1 on m.home_club = c1.club_id
        left join club c2 on m.away_club = c2.club_id
    `;
    db.query(sql, (err, data) => res.json(data));
});

app.post('/matches', (req, res) => {
    const sql = `
        insert into match_info
        (match_type, match_date, home_club, away_club, stadium_id)
        values (?,?,?,?,?)
    `;
    db.query(sql, [
        req.body.match_type,
        req.body.match_date,
        req.body.home_club,
        req.body.away_club,
        req.body.stadium_id
    ], () => res.json({message:"Match added"}));
});

/* ===================================================
   DASHBOARD SUMMARY
=================================================== */

app.get('/dashboard-summary', (req, res) => {
    const summary = {};

    db.query("select count(*) as totalPlayers from player", (e,d)=>{
        summary.totalPlayers = d[0].totalPlayers;

        db.query("select count(*) as totalClubs from club", (e2,d2)=>{
            summary.totalClubs = d2[0].totalClubs;

            db.query("select sum(market_value) as totalValue from player", (e3,d3)=>{
                summary.totalValue = d3[0].totalValue || 0;

                db.query(`
                    select concat(f_name,' ',l_name) as name, market_value
                    from player
                    order by market_value desc
                    limit 1
                `,(e4,d4)=>{
                    summary.highestPaid = d4[0] || null;
                    res.json(summary);
                });
            });
        });
    });
});

/* ===================================================
   REPORTS
=================================================== */

app.get('/reports', (req, res) => {
    const sql = `
        select c.club_name, count(p.player_id) as total
        from club c
        left join player p on c.club_id = p.club_id
        group by c.club_name
    `;
    db.query(sql, (err, data) => res.json(data));
});

/* =================================================== */

app.listen(8081, () => console.log("Server running on port 8081"));
