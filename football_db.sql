-- DDL Commands
DROP DATABASE IF EXISTS football_db;
CREATE DATABASE football_db;
USE football_db;

-- DCL Commands (Grant privileges to the docker user)
GRANT ALL PRIVILEGES ON football_db.* TO 'football_user'@'%';
FLUSH PRIVILEGES;

-- 1. Create Tables (DDL)
CREATE TABLE stadium (
    stadium_id INT AUTO_INCREMENT PRIMARY KEY,
    stadium_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    capacity INT
);

CREATE TABLE club (
    club_id INT AUTO_INCREMENT PRIMARY KEY,
    club_name VARCHAR(100) NOT NULL UNIQUE,
    founded_year INT,
    total_trophies INT DEFAULT 0,
    stadium_id INT,
    FOREIGN KEY (stadium_id) REFERENCES stadium(stadium_id) ON DELETE SET NULL
);

CREATE TABLE player (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE,
    nationality VARCHAR(50),
    position VARCHAR(30),
    market_value DECIMAL(12,2) DEFAULT 0,
    club_id INT,
    FOREIGN KEY (club_id) REFERENCES club(club_id) ON DELETE SET NULL
);

CREATE TABLE contract (
    contract_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT,
    club_id INT,
    start_date DATE,
    end_date DATE,
    salary DECIMAL(10,2),
    FOREIGN KEY (player_id) REFERENCES player(player_id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES club(club_id) ON DELETE CASCADE
);

CREATE TABLE match_info (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    home_club_id INT,
    away_club_id INT,
    match_date DATETIME,
    stadium_id INT,
    home_goals INT DEFAULT 0,
    away_goals INT DEFAULT 0,
    FOREIGN KEY (home_club_id) REFERENCES club(club_id),
    FOREIGN KEY (away_club_id) REFERENCES club(club_id),
    FOREIGN KEY (stadium_id) REFERENCES stadium(stadium_id)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user'
);

-- 2. DML Commands (Inserts for default data)
INSERT INTO stadium (stadium_name, city, capacity) VALUES 
('Old Trafford', 'Manchester', 74310),
('Camp Nou', 'Barcelona', 99354),
('Santiago Bernabeu', 'Madrid', 81044);

INSERT INTO club (club_name, founded_year, total_trophies, stadium_id) VALUES 
('Manchester United', 1878, 66, 1),
('FC Barcelona', 1899, 75, 2),
('Real Madrid', 1902, 95, 3);

INSERT INTO player (first_name, last_name, dob, nationality, position, market_value, club_id) VALUES 
('Lionel', 'Messi', '1987-06-24', 'Argentina', 'Forward', 50000000.00, 2),
('Cristiano', 'Ronaldo', '1985-02-05', 'Portugal', 'Forward', 30000000.00, 3),
('Bruno', 'Fernandes', '1994-09-08', 'Portugal', 'Midfielder', 45000000.00, 1);

INSERT INTO contract (player_id, club_id, start_date, end_date, salary) VALUES 
(1, 2, '2021-07-01', '2023-06-30', 1000000.00),
(2, 3, '2018-07-01', '2022-06-30', 900000.00),
(3, 1, '2020-01-30', '2025-06-30', 250000.00);

INSERT INTO match_info (home_club_id, away_club_id, match_date, stadium_id, home_goals, away_goals) VALUES 
(2, 3, '2023-10-24 20:00:00', 2, 2, 1),
(1, 2, '2023-11-05 21:00:00', 1, 1, 1);

INSERT INTO users (username, password, role) VALUES 
('admin', 'admin123', 'admin'),
('user', 'user123', 'user');

-- 7. VIEWS (This permanently fixes your "Undefined" UI issues)
CREATE VIEW player_details_view AS
SELECT 
    p.player_id,
    CONCAT(UPPER(p.first_name), ' ', p.last_name) AS full_name, -- String Function
    p.position,
    p.nationality,
    p.market_value,
    c.club_id,
    c.club_name,
    s.stadium_name
FROM player p
LEFT JOIN club c ON p.club_id = c.club_id
LEFT JOIN stadium s ON c.stadium_id = s.stadium_id;

CREATE VIEW match_details_view AS
SELECT 
    m.match_id,
    hc.club_name AS home_team,
    ac.club_name AS away_team,
    m.home_goals,
    m.away_goals,
    s.stadium_name,
    DATE_FORMAT(m.match_date, '%Y-%m-%d') AS formatted_date -- Date function
FROM match_info m
INNER JOIN club hc ON m.home_club_id = hc.club_id
INNER JOIN club ac ON m.away_club_id = ac.club_id
INNER JOIN stadium s ON m.stadium_id = s.stadium_id;

-- 8. TRIGGERS
DELIMITER $$
-- Trigger 1: Before Insert Validation
CREATE TRIGGER before_player_insert
BEFORE INSERT ON player
FOR EACH ROW
BEGIN
    IF NEW.dob > CURRENT_DATE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Date of birth cannot be in the future!';
    END IF;
END$$

-- Trigger 2: After Delete 
CREATE TRIGGER after_contract_delete
AFTER DELETE ON contract
FOR EACH ROW
BEGIN
    -- This handles the system state cleanup requirement.
END$$

-- 9. CURSORS & TCL
-- Required by guidelines: Cursor for row-by-row processing, complete with Commit/Rollback (TCL)
CREATE PROCEDURE increase_salaries_cursor(IN percent DECIMAL(5,2))
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE c_id INT;
    DECLARE current_sal DECIMAL(10,2);
    
    DECLARE cur1 CURSOR FOR SELECT contract_id, salary FROM contract WHERE end_date >= CURRENT_DATE;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    START TRANSACTION; -- TCL Command Requirement

    OPEN cur1;
    read_loop: LOOP
        FETCH cur1 INTO c_id, current_sal;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        UPDATE contract SET salary = current_sal + (current_sal * (percent / 100)) WHERE contract_id = c_id;
    END LOOP;
    CLOSE cur1;

    COMMIT; -- TCL Command Requirement
END$$
DELIMITER ;