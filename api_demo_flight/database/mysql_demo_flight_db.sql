-- ------------------------------------
-- SCRIPT MYSQL - demo_flight DATABASE
-- ------------------------------------

-- Criacao do banco de dados se nao existir
CREATE DATABASE IF NOT EXISTS demo_flight;

-- Selecionando o banco de dados
USE demo_flight;

-- Tabela de usuarios
CREATE TABLE sys_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    login_email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'regular') NOT NULL
);

-- Tabela de passageiros
CREATE TABLE passenger (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    passport_number VARCHAR(20) UNIQUE NOT NULL
);

-- Tabela de aeronaves
CREATE TABLE aircraft (
    aircraft_id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(50) NOT NULL,
    capacity INT NOT NULL
);

-- Tabela de voos
CREATE TABLE flight (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(10) UNIQUE NOT NULL,
    departure_airport VARCHAR(5) NOT NULL,
    arrival_airport VARCHAR(5) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    aircraft_id INT NOT NULL,
    FOREIGN KEY (aircraft_id) REFERENCES aircraft(aircraft_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Tabela de cartoes de embarque
CREATE TABLE boarding_pass (
    boarding_pass_id INT AUTO_INCREMENT PRIMARY KEY,
    seat_number VARCHAR(5) NOT NULL,
    passenger_id INT NOT NULL,
    flight_id INT NOT NULL,
    issue_time DATETIME NOT NULL,
    FOREIGN KEY (passenger_id) REFERENCES passenger(passenger_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ---------------------
-- Populando as tabelas
-- ---------------------

-- Tabela de usuarios (Insert otimizado em lote)
INSERT INTO sys_user (name, login_email, password, user_type) VALUES 
('Alice Johnson', 'a@a.com', '12345', 'admin'),
('Bob Smith', 'b@b.com', '12345', 'admin'),
('Charlie Brown', 'c@c.com', '12345', 'regular'),
('Diana Prince', 'd@d.com', '12345', 'regular');

-- Tabela de aeronaves (Insert otimizado em lote e com relacoes fabricante/modelo ajustadas)
INSERT INTO aircraft (model, manufacturer, capacity) VALUES 
('E190', 'Embraer', 114),
('CRJ900', 'Bombardier', 90),
('A320neo', 'Airbus', 180),
('737 MAX', 'Boeing', 189),
('Citation X', 'Cessna', 12);

-- Tabela de passageiros (Insert otimizado em lote - trecho corrigido e fechado)
INSERT INTO passenger (first_name, last_name, birth_date, passport_number) VALUES 
('James', 'Williams', '1996-12-06', 'P-00000001'),
('Linda', 'Martinez', '1976-07-29', 'P-00000002'),
('Jennifer', 'Davis', '1999-02-11', 'P-00000003'),
('Mary', 'Miller', '1972-10-21', 'P-00000004'),
('John', 'Martinez', '1973-09-17', 'P-00000006'),
('Michael', 'Martinez', '1968-11-24', 'P-00000007'),
('William', 'Hernandez', '1983-12-18', 'P-00000008'),
('Patricia', 'Brown', '1997-02-17', 'P-00000010'),
('Robert', 'Hernandez', '1970-08-15', 'P-00002342'),
('Patricia', 'Williams', '1974-03-27', 'P-00002343'),
('Elizabeth', 'Williams', '1976-10-31', 'P-00002344'),
('Linda', 'Garcia', '1977-04-19', 'P-00002345'),
('Michael', 'Miller', '1976-06-19', 'P-00002346'),
('Robert', 'Jones', '1966-11-01', 'P-00002347'),
('Patricia', 'Williams', '1989-08-16', 'P-00002348'),
('Patricia', 'Hernandez', '2002-12-02', 'P-00002349'),
('John', 'Hernandez', '1981-06-12', 'P-00002350'),
('James', 'Hernandez', '2003-09-15', 'P-00002351'),
('John', 'Brown', '1988-01-15', 'P-00002352'),
('Linda', 'Brown', '1993-04-02', 'P-00002353');

-- Tabela de voos (Exemplo de povoamento)
INSERT INTO flight (flight_number, departure_airport, arrival_airport, departure_time, arrival_time, aircraft_id) VALUES 
('AD1001', 'GRU', 'SDU', '2026-11-01 08:00:00', '2026-11-01 09:00:00', 1),
('G32002', 'BSB', 'CGH', '2026-11-01 10:30:00', '2026-11-01 12:15:00', 4),
('LA3003', 'GIG', 'SSA', '2026-11-01 14:00:00', '2026-11-01 16:00:00', 3);

-- Tabela de cartoes de embarque (Exemplo de povoamento)
INSERT INTO boarding_pass (seat_number, passenger_id, flight_id, issue_time) VALUES 
('12A', 1, 1, '2026-10-31 18:00:00'),
('14C', 2, 1, '2026-10-31 18:05:00'),
('01F', 3, 2, '2026-10-31 19:20:00');