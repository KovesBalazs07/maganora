USE maganora;

CREATE TABLE IF NOT EXISTS fiok_diak (
    fiok_id INT NOT NULL,
    diak_id INT NOT NULL,
    PRIMARY KEY (fiok_id),
    UNIQUE KEY fiok_diak_diak (diak_id),
    FOREIGN KEY (fiok_id) REFERENCES fiok(id) ON DELETE CASCADE,
    FOREIGN KEY (diak_id) REFERENCES diak(id) ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE idopont MODIFY diak_id INT NULL;
