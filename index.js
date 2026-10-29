require('dotenv').config({ quiet: true });
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

function joSzoveg(ertek) {
    return typeof ertek === 'string' && ertek.trim().length > 0 && ertek.length <= 100;
}
function joEmail(ertek) {
    return joSzoveg(ertek) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ertek);
}
function joId(ertek) {
    return Number.isInteger(ertek) && ertek > 0 && ertek <= 2147483647;
}
function joDatum(ertek) {
    if (typeof ertek !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(ertek) || ertek < '1000-01-01') return false;
    const datum = new Date(ertek + 'T00:00:00Z');
    return !isNaN(datum.getTime()) && datum.toISOString().slice(0, 10) === ertek;
}
function joIdo(ertek) {
    return typeof ertek === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(ertek);
}

app.param('id', (req, res, next, id) => {
    if (!/^[1-9]\d*$/.test(id) || !joId(Number(id))) {
        return res.status(400).json({ error: 'Hibás azonosító.' });
    }
    next();
});

app.get('/api/health', async (req, res) => {
    await db.execute('SELECT 1');
    res.json({ status: 'ok', database: 'ok' });
});

app.get('/api/diak', async (req, res) => {
    const [sorok] = await db.execute('SELECT * FROM diak ORDER BY id');
    res.json({ data: sorok });
});

app.get('/api/diak/:id', async (req, res) => {
    const [sorok] = await db.execute('SELECT * FROM diak WHERE id = ?', [req.params.id]);
    if (sorok.length === 0) return res.status(404).json({ error: 'Nincs ilyen rekord.' });
    res.json({ data: sorok[0] });
});

app.post('/api/diak', async (req, res) => {
    const { nev, email } = req.body || {};
    if (!(joSzoveg(nev) && joEmail(email))) {
        return res.status(400).json({ error: 'Hiányzó vagy hibás adat.' });
    }
    const [eredmeny] = await db.execute(
        'INSERT INTO diak (nev, email) VALUES (?, ?)',
        [nev, email]
    );
    res.status(201).json({ data: { id: eredmeny.insertId, nev, email } });
});

app.put('/api/diak/:id', async (req, res) => {
    const { nev, email } = req.body || {};
    if (!(joSzoveg(nev) && joEmail(email))) {
        return res.status(400).json({ error: 'Hiányzó vagy hibás adat.' });
    }
    const [sorok] = await db.execute('SELECT id FROM diak WHERE id = ?', [req.params.id]);
    if (sorok.length === 0) return res.status(404).json({ error: 'Nincs ilyen rekord.' });
    await db.execute(
        'UPDATE diak SET nev = ?, email = ? WHERE id = ?',
        [nev, email, req.params.id]
    );
    res.json({ data: { id: Number(req.params.id), nev, email } });
});

app.delete('/api/diak/:id', async (req, res) => {
    const [eredmeny] = await db.execute('DELETE FROM diak WHERE id = ?', [req.params.id]);
    if (eredmeny.affectedRows === 0) return res.status(404).json({ error: 'Nincs ilyen rekord.' });
    res.status(204).end();
});

app.get('/api/ertekeles', async (req, res) => {
    const [sorok] = await db.execute('SELECT * FROM ertekeles ORDER BY id');
    res.json({ data: sorok });
});

app.get('/api/ertekeles/:id', async (req, res) => {
    const [sorok] = await db.execute('SELECT * FROM ertekeles WHERE id = ?', [req.params.id]);
    if (sorok.length === 0) return res.status(404).json({ error: 'Nincs ilyen rekord.' });
    res.json({ data: sorok[0] });
});

app.post('/api/ertekeles', async (req, res) => {
    const { diak_id, pontszam, velemeny } = req.body || {};
    if (!(joId(diak_id) && Number.isInteger(pontszam) && pontszam >= 1 && pontszam <= 5 && joSzoveg(velemeny))) {
        return res.status(400).json({ error: 'Hiányzó vagy hibás adat.' });
    }
    const [eredmeny] = await db.execute(
        'INSERT INTO ertekeles (diak_id, pontszam, velemeny) VALUES (?, ?, ?)',
        [diak_id, pontszam, velemeny]
    );
    res.status(201).json({ data: { id: eredmeny.insertId, diak_id, pontszam, velemeny } });
});

app.put('/api/ertekeles/:id', async (req, res) => {
    const { diak_id, pontszam, velemeny } = req.body || {};
    if (!(joId(diak_id) && Number.isInteger(pontszam) && pontszam >= 1 && pontszam <= 5 && joSzoveg(velemeny))) {
        return res.status(400).json({ error: 'Hiányzó vagy hibás adat.' });
    }
    const [sorok] = await db.execute('SELECT id FROM ertekeles WHERE id = ?', [req.params.id]);
    if (sorok.length === 0) return res.status(404).json({ error: 'Nincs ilyen rekord.' });
    await db.execute(
        'UPDATE ertekeles SET diak_id = ?, pontszam = ?, velemeny = ? WHERE id = ?',
        [diak_id, pontszam, velemeny, req.params.id]
    );
    res.json({ data: { id: Number(req.params.id), diak_id, pontszam, velemeny } });
});

app.delete('/api/ertekeles/:id', async (req, res) => {
    const [eredmeny] = await db.execute('DELETE FROM ertekeles WHERE id = ?', [req.params.id]);
    if (eredmeny.affectedRows === 0) return res.status(404).json({ error: 'Nincs ilyen rekord.' });
    res.status(204).end();
});

app.get('/api/tanar', async (req, res) => {
    const [sorok] = await db.execute('SELECT * FROM tanar ORDER BY id');
    res.json({ data: sorok });
});

app.get('/api/tanar/:id', async (req, res) => {
    const [sorok] = await db.execute('SELECT * FROM tanar WHERE id = ?', [req.params.id]);
    if (sorok.length === 0) return res.status(404).json({ error: 'Nincs ilyen rekord.' });
    res.json({ data: sorok[0] });
});

app.post('/api/tanar', async (req, res) => {
    const { ertekeles_id, nev, email } = req.body || {};
    if (!(joId(ertekeles_id) && joSzoveg(nev) && joEmail(email))) {
        return res.status(400).json({ error: 'Hiányzó vagy hibás adat.' });
    }
    const [eredmeny] = await db.execute(
        'INSERT INTO tanar (ertekeles_id, nev, email) VALUES (?, ?, ?)',
        [ertekeles_id, nev, email]
    );
    res.status(201).json({ data: { id: eredmeny.insertId, ertekeles_id, nev, email } });
});

app.put('/api/tanar/:id', async (req, res) => {
    const { ertekeles_id, nev, email } = req.body || {};
    if (!(joId(ertekeles_id) && joSzoveg(nev) && joEmail(email))) {
        return res.status(400).json({ error: 'Hiányzó vagy hibás adat.' });
    }
    const [sorok] = await db.execute('SELECT id FROM tanar WHERE id = ?', [req.params.id]);
    if (sorok.length === 0) return res.status(404).json({ error: 'Nincs ilyen rekord.' });
    await db.execute(
        'UPDATE tanar SET ertekeles_id = ?, nev = ?, email = ? WHERE id = ?',
        [ertekeles_id, nev, email, req.params.id]
    );
    res.json({ data: { id: Number(req.params.id), ertekeles_id, nev, email } });
});

app.delete('/api/tanar/:id', async (req, res) => {
    const [eredmeny] = await db.execute('DELETE FROM tanar WHERE id = ?', [req.params.id]);
    if (eredmeny.affectedRows === 0) return res.status(404).json({ error: 'Nincs ilyen rekord.' });
    res.status(204).end();
});

app.get('/api/idopont', async (req, res) => {
    const [sorok] = await db.execute('SELECT * FROM idopont ORDER BY id');
    res.json({ data: sorok });
});

app.get('/api/idopont/:id', async (req, res) => {
    const [sorok] = await db.execute('SELECT * FROM idopont WHERE id = ?', [req.params.id]);
    if (sorok.length === 0) return res.status(404).json({ error: 'Nincs ilyen rekord.' });
    res.json({ data: sorok[0] });
});

app.post('/api/idopont', async (req, res) => {
    const { tanar_id, diak_id, kezdete, vege, datum, tipus } = req.body || {};
    if (!(joId(tanar_id) && joId(diak_id) && joIdo(kezdete) && joIdo(vege) && kezdete < vege && joDatum(datum) && ['online', 'jelenléti', 'feladatmegoldás'].includes(tipus))) {
        return res.status(400).json({ error: 'Hiányzó vagy hibás adat.' });
    }
    const [eredmeny] = await db.execute(
        'INSERT INTO idopont (tanar_id, diak_id, kezdete, vege, datum, tipus) VALUES (?, ?, ?, ?, ?, ?)',
        [tanar_id, diak_id, kezdete, vege, datum, tipus]
    );
    res.status(201).json({ data: { id: eredmeny.insertId, tanar_id, diak_id, kezdete, vege, datum, tipus } });
});

app.put('/api/idopont/:id', async (req, res) => {
    const { tanar_id, diak_id, kezdete, vege, datum, tipus } = req.body || {};
    if (!(joId(tanar_id) && joId(diak_id) && joIdo(kezdete) && joIdo(vege) && kezdete < vege && joDatum(datum) && ['online', 'jelenléti', 'feladatmegoldás'].includes(tipus))) {
        return res.status(400).json({ error: 'Hiányzó vagy hibás adat.' });
    }
    const [sorok] = await db.execute('SELECT id FROM idopont WHERE id = ?', [req.params.id]);
    if (sorok.length === 0) return res.status(404).json({ error: 'Nincs ilyen rekord.' });
    await db.execute(
        'UPDATE idopont SET tanar_id = ?, diak_id = ?, kezdete = ?, vege = ?, datum = ?, tipus = ? WHERE id = ?',
        [tanar_id, diak_id, kezdete, vege, datum, tipus, req.params.id]
    );
    res.json({ data: { id: Number(req.params.id), tanar_id, diak_id, kezdete, vege, datum, tipus } });
});

app.delete('/api/idopont/:id', async (req, res) => {
    const [eredmeny] = await db.execute('DELETE FROM idopont WHERE id = ?', [req.params.id]);
    if (eredmeny.affectedRows === 0) return res.status(404).json({ error: 'Nincs ilyen rekord.' });
    res.status(204).end();
});

app.use((req, res) => {
    res.status(404).json({ error: 'Nincs ilyen végpont.' });
});

app.use((hiba, req, res, next) => {
    if (hiba.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Hibás JSON.' });
    }
    if (hiba.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'A hivatkozott rekord nem létezik.' });
    }
    if (hiba.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'Másik rekord hivatkozik rá, ezért nem törölhető.' });
    }
    console.error(hiba.code || hiba.message);
    res.status(500).json({ error: 'Szerverhiba. Ellenőrizd az adatbázis-kapcsolatot is.' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, '127.0.0.1', () => {
    console.log(`A szerver fut: http://127.0.0.1:${port}/api`);
});
