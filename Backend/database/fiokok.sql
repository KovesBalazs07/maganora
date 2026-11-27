USE maganora;

CREATE TABLE IF NOT EXISTS fiok (
    id INT NOT NULL AUTO_INCREMENT,
    nev VARCHAR(100) NOT NULL,
    email VARCHAR(100) COLLATE utf8mb4_bin NOT NULL,
    jelszo_so BINARY(16) NOT NULL,
    jelszo_lenyomat BINARY(64) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY fiok_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS munkamenet (
    token_lenyomat BINARY(32) NOT NULL,
    fiok_id INT NOT NULL,
    lejarat DATETIME NOT NULL,
    PRIMARY KEY (token_lenyomat),
    KEY munkamenet_lejarat (lejarat),
    FOREIGN KEY (fiok_id) REFERENCES fiok(id) ON DELETE CASCADE
) ENGINE=InnoDB;
