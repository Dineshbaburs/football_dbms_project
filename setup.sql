-- ==========================================
-- 1. DATABASE CREATION & SETUP
-- ==========================================
DROP DATABASE IF EXISTS football_dbms_project;
CREATE DATABASE football_dbms_project;
USE football_dbms_project;

-- ==========================================
-- 2. DDL COMMANDS (Create Tables based on ER Diagram)
-- ==========================================

-- Table 1: STADIUM (Independent Entity)
CREATE TABLE Stadium (
    Stadium_ID INT PRIMARY KEY AUTO_INCREMENT,
    Stadium_Name VARCHAR(100) NOT NULL,
    Capacity INT,
    City VARCHAR(50)
);

-- Table 2: CLUB (Linked to Stadium)
CREATE TABLE Club (
    Club_ID INT PRIMARY KEY AUTO_INCREMENT,
    Club_Name VARCHAR(100) NOT NULL,
    Founded_Year INT,
    Owner_Name VARCHAR(100),
    Total_Trophies INT DEFAULT 0,
    Stadium_ID INT,
    FOREIGN KEY (Stadium_ID) REFERENCES Stadium(Stadium_ID) ON DELETE SET NULL
);

-- Table 3: PLAYER (Linked to Club)
-- Matches ER Attributes: Name (split), DOB, Position, Address (split)
CREATE TABLE Player (
    Player_ID INT PRIMARY KEY AUTO_INCREMENT,
    F_Name VARCHAR(50),
    L_Name VARCHAR(50),
    DOB DATE,
    Position VARCHAR(50),
    City VARCHAR(50),
    State VARCHAR(50),
    Pincode VARCHAR(10),
    Club_ID INT,
    Captain_ID INT, -- For SELF JOIN requirement
    FOREIGN KEY (Club_ID) REFERENCES Club(Club_ID) ON DELETE SET NULL,
    FOREIGN KEY (Captain_ID) REFERENCES Player(Player_ID)
);

-- Table 4: PLAYER_PHONE (Multivalued Attribute in ER Diagram)
CREATE TABLE Player_Phone (
    Player_ID INT,
    Phone_Number VARCHAR(15),
    PRIMARY KEY (Player_ID, Phone_Number),
    FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID) ON DELETE CASCADE
);

-- Table 5: CONTRACT (Relationship "Signs")
CREATE TABLE Contract (
    Contract_ID INT PRIMARY KEY AUTO_INCREMENT,
    Start_Date DATE,
    End_Date DATE,
    Salary DECIMAL(10, 2),
    Player_ID INT,
    Club_ID INT,
    FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID) ON DELETE CASCADE,
    FOREIGN KEY (Club_ID) REFERENCES Club(Club_ID)
);

-- Table 6: MATCHES (Relationship "Plays" & "Held_In")
CREATE TABLE Matches (
    Match_ID INT PRIMARY KEY AUTO_INCREMENT,
    Match_Date DATE,
    Match_Type VARCHAR(50), -- League, Friendly
    Duration INT, -- Minutes
    Stadium_ID INT,
    Winner_Club_ID INT,
    FOREIGN KEY (Stadium_ID) REFERENCES Stadium(Stadium_ID),
    FOREIGN KEY (Winner_Club_ID) REFERENCES Club(Club_ID)
);

-- Table 7: AUDIT_LOG (For Triggers)
CREATE TABLE Player_Audit (
    Audit_ID INT PRIMARY KEY AUTO_INCREMENT,
    Player_ID INT,
    Deleted_At DATETIME,
    Deleted_By VARCHAR(50)
);

-- ==========================================
-- 3. DML COMMANDS (Insert Dummy Data)
-- ==========================================

-- Insert Stadiums
INSERT INTO Stadium (Stadium_Name, Capacity, City) VALUES 
('Old Trafford', 74000, 'Manchester'),
('Santiago Bernabeu', 81000, 'Madrid'),
('Camp Nou', 99000, 'Barcelona');

-- Insert Clubs
INSERT INTO Club (Club_Name, Founded_Year, Owner_Name, Total_Trophies, Stadium_ID) VALUES 
('Manchester United', 1878, 'Glazers', 66, 1),
('Real Madrid', 1902, 'Florentino Perez', 95, 2),
('FC Barcelona', 1899, 'Joan Laporta', 92, 3);

-- Insert Players
INSERT INTO Player (F_Name, L_Name, DOB, Position, City, Club_ID) VALUES 
('Bruno', 'Fernandes', '1994-09-08', 'Midfielder', 'Manchester', 1),
('Marcus', 'Rashford', '1997-10-31', 'Forward', 'Manchester', 1),
('Luka', 'Modric', '1985-09-09', 'Midfielder', 'Madrid', 2),
('Vinicius', 'Jr', '2000-07-12', 'Forward', 'Madrid', 2);

-- Set Captains (Self Join Data)
UPDATE Player SET Captain_ID = 1 WHERE Player_ID = 2; -- Bruno captains Rashford
UPDATE Player SET Captain_ID = 3 WHERE Player_ID = 4; -- Modric captains Vini

-- Insert Contracts
INSERT INTO Contract (Start_Date, End_Date, Salary, Player_ID, Club_ID) VALUES 
('2023-01-01', '2026-06-30', 200000.00, 1, 1),
('2022-05-01', '2025-06-30', 180000.00, 2, 1),
('2021-08-01', '2024-06-30', 300000.00, 3, 2);

-- ==========================================
-- 4. TRIGGERS (Requirement: Min 2)
-- ==========================================

DELIMITER //

-- Trigger 1: BEFORE INSERT (Validation)
-- Prevents adding a contract where End Date is before Start Date
CREATE TRIGGER Check_Contract_Dates
BEFORE INSERT ON Contract
FOR EACH ROW
BEGIN
    IF NEW.End_Date <= NEW.Start_Date THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Contract End Date must be after Start Date.';
    END IF;
END;
//

-- Trigger 2: AFTER DELETE (Audit)
-- Saves deleted player info into Audit table
CREATE TRIGGER Log_Player_Deletion
AFTER DELETE ON Player
FOR EACH ROW
BEGIN
    INSERT INTO Player_Audit (Player_ID, Deleted_At, Deleted_By)
    VALUES (OLD.Player_ID, NOW(), USER());
END;
//

-- ==========================================
-- 5. CURSORS (Requirement: Row-by-row processing)
-- ==========================================

-- Procedure to give a 10% bonus to players with salary < 200,000
CREATE PROCEDURE Process_Salary_Bonus()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE p_id INT;
    DECLARE curr_salary DECIMAL(10,2);
    
    -- Declare Cursor
    DECLARE cur CURSOR FOR SELECT Player_ID, Salary FROM Contract;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO p_id, curr_salary;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Logic: Update salary if low
        IF curr_salary < 200000 THEN
            UPDATE Contract SET Salary = Salary * 1.10 WHERE Player_ID = p_id;
        END IF;
    END LOOP;
    CLOSE cur;
END;
//
DELIMITER ;

-- ==========================================
-- 6. VIEWS & JOINS
-- ==========================================

-- View to see Player Details with Club and Stadium (Using Joins)
CREATE VIEW Player_Full_Details AS
SELECT 
    p.F_Name, 
    p.L_Name, 
    c.Club_Name, 
    s.Stadium_Name 
FROM Player p
JOIN Club c ON p.Club_ID = c.Club_ID
LEFT JOIN Stadium s ON c.Stadium_ID = s.Stadium_ID;

-- View calculating AGE (Date Functions)
CREATE VIEW Player_Ages AS
SELECT 
    F_Name, 
    L_Name, 
    FLOOR(DATEDIFF(CURRENT_DATE, DOB) / 365) AS Age 
FROM Player;

-- ==========================================
-- END OF SETUP
-- ==========================================