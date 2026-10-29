# Magánóra backend

Egyszerű Node.js + MySQL backend a meglévő adatbázishoz.

## Indítás

1. Indítsd el a MySQL-t, például XAMPP-ban.
2. Ha még nincs adatbázisod, új, üres adatbázishoz importáld a `Backend/database/setup.sql` fájlt. Ha már megvan az eredeti séma és az adatbázis, ne importáld újra. Az eredeti `maganora.sql` adatbázis-törlést tartalmaz, az új setup.sql nem.
3. VS Code terminálban:

```powershell
cd Backend/Szerver-side
npm ci
Copy-Item .env.example .env
npm start
```

A Node.js 22 vagy újabb verziója szükséges. A .env fájlban add meg az adatbázis nevét, felhasználóját és jelszavát. Alapból: maganora adatbázis, root felhasználó, üres jelszó, 3306-os port. A .env fájlt ne töltsd fel GitHubra.

Ellenőrzés: http://127.0.0.1:3000/api/health. Leállítás: Ctrl+C.

## A két szerverfájl

- `index.js`: a szerver és az összes végpont. A négy táblához külön vannak leírva az SQL-lekérdezések.
- `db.js`: az adatbázis-kapcsolat beállításai.

Minden táblához öt végpont tartozik: lista, egy rekord lekérdezése, létrehozás, módosítás, törlés. Példa a diákokra:

| Metódus | Cím | Feladat |
| --- | --- | --- |
| GET | /api/diak | Diákok listája |
| GET | /api/diak/1 | Az 1-es diák |
| POST | /api/diak | Új diák |
| PUT | /api/diak/1 | Az 1-es diák módosítása |
| DELETE | /api/diak/1 | Az 1-es diák törlése |

Ugyanez működik a `tanar`, `ertekeles` és `idopont` nevekkel. Szűrés nincs. A GET és PUT válasza 200, a POST 201, a DELETE 204, üres válasszal. A válaszokban a rekordok a `data` mezőben vannak.

POST és PUT esetén `Content-Type: application/json` fejléc kell. A PUT minden felsorolt mezőt kér. Az id automatikus, nem kell a törzsbe írni.

- diak: nev, email
- ertekeles: diak_id, pontszam, velemeny
- tanar: ertekeles_id, nev, email
- idopont: tanar_id, diak_id, kezdete, vege, datum, tipus

Példa új diákhoz: `{"nev":"Kiss Anna","email":"anna@example.hu"}`.
Az azonosítók és a pontszám számok. A pontszám 1–5 közötti egész. A dátum például `2026-10-29`, az idő `14:00`; a befejezés későbbi legyen a kezdésnél. A típus `online`, `jelenléti` vagy `feladatmegoldás` lehet. A szövegmezők legfeljebb 100 karakteresek.

Hibás adatnál 400, nem létező rekordnál 404, kapcsolódó rekord törlésénél 409, egyéb szerverhibánál 500 érkezik.

## EchoAPI

Importáld az `EchoAPI/Maganora.postman_collection.json` fájlt Postman 2.1 formátumként. Ehhez nem kell Postmant telepíteni.

A baseUrl: `http://127.0.0.1:3000/api`. A 02 mappában sorrendben hozd létre az új rekordokat. Minden válaszból másold a `data.id` számot a megfelelő gyűjteményváltozóba: `diakId`, `ertekelesId`, `tanarId`, `idopontId`. Ezután a többi kérés ezeket használja. A változók eleinte üresek, így nem írják felül a mintarekordokat. Automatikus szkriptek nincsenek a gyűjteményben.

Az eredeti adatbázis kapcsolatai miatt a létrehozási sorrend: diák, értékelés, tanár, időpont. Törléskor fordított a sorrend. A tanár kötelező ertekeles_id mezője az eredeti adatbázistervből származik.

## Mi tartozik bele

Csak a backend és az API-kérések. Nincs frontendmódosítás, bejelentkezés, jogosultságkezelés vagy foglalási üzleti logika. A szerver helyi gépen fut. A kérésnek megfelelően új DOCX és PDF nem készült, az eredeti dokumentumok változatlanok.
