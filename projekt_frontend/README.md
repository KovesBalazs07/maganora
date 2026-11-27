# ProjektFrontend

## Regisztráció és bejelentkezés helyi futtatása

1. Új adatbázisnál importáld a `Backend/database/setup.sql` fájlt MySQL-be. Ezután új és meglévő `maganora` adatbázisnál is importáld sorrendben a `Backend/database/fiokok.sql`, `Backend/database/lekerdezesek.sql` és `Backend/database/regisztracios_adatok.sql` fájlokat.
2. A `Backend/Szerver-side` mappában futtasd az `npm ci`, majd az `npm start` parancsot. Ha eltérnek a helyi adatbázis-beállításaid, add meg a `DB_HOST`, `DB_PORT`, `DB_USER` és `DB_PASSWORD` értékét környezeti változóként vagy a backend mappájában lévő `.env` fájlban.
3. A `projekt_frontend` mappában futtasd az `npm ci`, majd az `npm start` parancsot. Nyisd meg a [helyi felületet](http://localhost:4200/). Ha a backend nem a 3000-es porton fut, állítsd át a célt a `proxy.conf.json` fájlban.

Regisztrációkor add meg a nevedet, e-mail-címedet és jelszavadat, majd válaszd ki a szerepkörödet és a hozzá tartozó adatokat. A sikeres regisztráció után automatikusan bejelentkezel. A diákfiókhoz új diákrekord tartozik. A korábbi fiókokat és diákrekordokat csak ellenőrzés után, a `fiok_diak` táblában lehet összekapcsolni.

## GET-végpontok

Az alábbi végpontok bejelentkezést igényelnek és a böngésző munkamenetét használják:

- `GET /api/auth/profil` — az aktuális fiók adatai.
- `GET /api/auth/szabad-idopontok?tol=2026-11-01&ig=2026-11-30` — szabad időpontok, opcionális, mindkét végét beleértő dátumszűréssel.
- `GET /api/auth/sajat-idopontok?tol=2026-11-01&ig=2026-11-30` — az aktuális fiókhoz kapcsolt diák időpontjai, opcionális dátumszűréssel.
- `GET /api/auth/havi-osszesites?honap=2026-11` — az adott hónapban szereplő időpontok száma és összesített hossza percekben. Az összeg `null`, mert az adatbázis nem tárol díjakat.

Az időpont diák nélküli (`diak_id IS NULL`) állapotban szabad. A régebbi fiókokhoz kapcsolás nélkül a saját lista üres. A meglévő általános adatvégpontok az `/api/diak`, `/api/tanar`, `/api/ertekeles` és `/api/idopont` útvonalakon érhetők el.
