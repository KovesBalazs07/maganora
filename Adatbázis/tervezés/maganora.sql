DROP DATABASE IF EXISTS maganora;
CREATE DATABASE maganora CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE maganora;

CREATE TABLE diak (
    id INT NOT NULL AUTO_INCREMENT,
    nev VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO diak (id, nev, email) VALUES
(1, 'Kiss Miklós', 'kiss.miklos@gmail.com'),
(2, 'Tóth Ákos', 'toth.akos@gmail.com'),
(3, 'Nagy Ágnes', 'nagy.agnes@gmail.com'),
(4, 'Varga László', 'varga.laszlo@gmail.com'),
(5, 'Balogh Júlia', 'balogh.julia@gmail.com');

CREATE TABLE ertekeles (
    id INT NOT NULL AUTO_INCREMENT,
    diak_id INT NOT NULL,
    pontszam INT NOT NULL,
    velemeny VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (diak_id) REFERENCES diak(id)
) ENGINE=InnoDB;

INSERT INTO ertekeles (id, diak_id, pontszam, velemeny) VALUES
(1, 5, 5, 'tökéletes'),
(2, 2, 2, 'nem megfelelő'),
(3, 1, 3, 'jó'),
(4, 3, 4, 'tökéletes'),
(5, 4, 3, 'jó');

CREATE TABLE tanar (
    id INT NOT NULL AUTO_INCREMENT,
    ertekeles_id INT NOT NULL,
    nev VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ertekeles_id) REFERENCES ertekeles(id)
) ENGINE=InnoDB;

INSERT INTO tanar (id, ertekeles_id, nev, email) VALUES
(1, 4, 'Kovács Márton', 'marton.kovacs@gmail.com'),
(2, 2, 'Szabó János', 'janos.szabo@gmail.com'),
(3, 5, 'Havasi Zoltán', 'zoltan.havasi@gmail.com'),
(4, 1, 'Németh Mihály', 'mihaly.nemeth@gmail.com'),
(5, 3, 'Kis Pál', 'pal.kis@gmail.com');

CREATE TABLE idopont (
    id INT NOT NULL AUTO_INCREMENT,
    tanar_id INT NOT NULL,
    diak_id INT NOT NULL,
    kezdete VARCHAR(100) NOT NULL,
    vege VARCHAR(100) NOT NULL,
    datum DATE NOT NULL,
    tipus VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (tanar_id) REFERENCES tanar(id),
    FOREIGN KEY (diak_id) REFERENCES diak(id)
) ENGINE=InnoDB;

INSERT INTO idopont (id, tanar_id, diak_id, kezdete, vege, datum, tipus) VALUES
(1, 5, 2, '14:00', '15:30', '2026-10-15', 'online'),
(2, 1, 4, '13:20', '14:05', '2026-09-28', 'jelenléti'),
(3, 2, 3, '16:00', '17:00', '2026-10-01', 'jelenléti'),
(4, 3, 3, '18:00', '18:50', '2026-10-05', 'feladatmegoldás'),
(5, 5, 1, '10:00', '11:00', '2026-10-12', 'online');
