USE maganora;

CREATE TABLE IF NOT EXISTS regisztracios_adatok (
    fiok_id INT NOT NULL PRIMARY KEY,
    szerepkor ENUM('diak', 'tanar') NOT NULL,
    tantargy VARCHAR(100) NOT NULL,
    tanulasi_cel VARCHAR(100) DEFAULT NULL,
    vegzettseg VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (fiok_id) REFERENCES fiok(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS regisztracios_valasztas (
    fiok_id INT NOT NULL,
    tipus ENUM('tantargy', 'tanulasi_cel', 'vegzettseg') NOT NULL,
    ertek VARCHAR(100) NOT NULL,
    PRIMARY KEY (fiok_id, tipus, ertek),
    FOREIGN KEY (fiok_id) REFERENCES regisztracios_adatok(fiok_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO regisztracios_valasztas (fiok_id, tipus, ertek)
SELECT fiok_id, 'tantargy', tantargy FROM regisztracios_adatok;
INSERT IGNORE INTO regisztracios_valasztas (fiok_id, tipus, ertek)
SELECT fiok_id, 'tanulasi_cel', tanulasi_cel FROM regisztracios_adatok WHERE tanulasi_cel IS NOT NULL;
INSERT IGNORE INTO regisztracios_valasztas (fiok_id, tipus, ertek)
SELECT fiok_id, 'vegzettseg', vegzettseg FROM regisztracios_adatok WHERE vegzettseg IS NOT NULL;

ALTER TABLE tanar MODIFY ertekeles_id INT NULL;

CREATE TABLE IF NOT EXISTS fiok_tanar (
    fiok_id INT NOT NULL PRIMARY KEY,
    tanar_id INT NOT NULL UNIQUE,
    FOREIGN KEY (fiok_id) REFERENCES fiok(id) ON DELETE CASCADE,
    FOREIGN KEY (tanar_id) REFERENCES tanar(id) ON DELETE CASCADE
) ENGINE=InnoDB;
