const { createHash, randomBytes, scrypt, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');
const { Router } = require('express');
const db = require('./db');

const auth = Router();
const scryptAsync = promisify(scrypt);
const munkamenetIdotartam = 24 * 60 * 60 * 1000;
const cookieNev = 'maganora_session';
const cookieBeallitasok = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/api/auth'
};

function normalizaltEmail(email) {
    return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function ervenyesEmail(email) {
    return email.length <= 100 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jelszoLenyomat(jelszo, so) {
    return scryptAsync(jelszo, so, 64, { N: 32768, maxmem: 64 * 1024 * 1024 });
}

function tokenLenyomat(token) {
    return createHash('sha256').update(token).digest();
}

function munkamenetToken(req) {
    return req.headers.cookie?.match(/(?:^|;\s*)maganora_session=([a-f0-9]{64})(?:;|$)/)?.[1];
}

auth.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

auth.post('/regisztracio', async (req, res) => {
    const { nev, jelszo, szerepkor, tantargy, tanulasi_cel, vegzettseg } = req.body || {};
    const teljesNev = typeof nev === 'string' ? nev.trim() : '';
    const email = normalizaltEmail(req.body?.email);

    if (!teljesNev || teljesNev.length > 100 || !ervenyesEmail(email) ||
        typeof jelszo !== 'string' || jelszo.length < 8 || jelszo.length > 128) {
        return res.status(400).json({ error: 'Adj meg nevet, érvényes e-mail-címet és 8–128 karakteres jelszót.' });
    }
    const tantargyak = ['matematika', 'fizika', 'kemia', 'informatika', 'magyar', 'tortenelem', 'angol', 'nemet', 'egyeb'];
    const celok = ['felzarkoztatas', 'felveteli', 'erettsegi', 'emelt_erettsegi', 'egyetem', 'egyeb'];
    const vegzettsegek = ['erettsegi', 'folyamatban_levo_felsooktatasi', 'alapkepzes', 'mesterkepzes', 'tanari_diploma', 'doktori', 'egyeb'];
    const listava = ertek => Array.isArray(ertek) ? ertek : typeof ertek === 'string' ? [ertek] : [];
    const tantargyLista = listava(tantargy);
    const celLista = listava(tanulasi_cel);
    const vegzettsegLista = listava(vegzettseg);
    const ervenyesLista = (lista, megengedett) =>
        lista.length > 0 && lista.length <= megengedett.length &&
        new Set(lista).size === lista.length && lista.every(ertek => megengedett.includes(ertek));
    if (!['diak', 'tanar'].includes(szerepkor) || !ervenyesLista(tantargyLista, tantargyak) ||
        (szerepkor === 'diak' && !ervenyesLista(celLista, celok)) ||
        (szerepkor === 'tanar' && !ervenyesLista(vegzettsegLista, vegzettsegek))) {
        return res.status(400).json({ error: 'Válaszd ki a szerepkört és a hozzá tartozó adatokat.' });
    }

    const so = randomBytes(16);
    const lenyomat = await jelszoLenyomat(jelszo, so);
    const kapcsolat = await db.getConnection();
    try {
        await kapcsolat.beginTransaction();
        const [eredmeny] = await kapcsolat.execute(
            'INSERT INTO fiok (nev, email, jelszo_so, jelszo_lenyomat) VALUES (?, ?, ?, ?)',
            [teljesNev, email, so, lenyomat]
        );
        await kapcsolat.execute(
            'INSERT INTO regisztracios_adatok (fiok_id, szerepkor, tantargy, tanulasi_cel, vegzettseg) VALUES (?, ?, ?, ?, ?)',
            [eredmeny.insertId, szerepkor, tantargyLista[0], szerepkor === 'diak' ? celLista[0] : null, szerepkor === 'tanar' ? vegzettsegLista[0] : null]
        );
        const valasztasok = [
            ...tantargyLista.map(ertek => ['tantargy', ertek]),
            ...(szerepkor === 'diak' ? celLista.map(ertek => ['tanulasi_cel', ertek]) : vegzettsegLista.map(ertek => ['vegzettseg', ertek]))
        ];
        for (const [tipus, ertek] of valasztasok) {
            await kapcsolat.execute(
                'INSERT INTO regisztracios_valasztas (fiok_id, tipus, ertek) VALUES (?, ?, ?)',
                [eredmeny.insertId, tipus, ertek]
            );
        }
        if (szerepkor === 'diak') {
            const [diak] = await kapcsolat.execute(
                'INSERT INTO diak (nev, email) VALUES (?, ?)',
                [teljesNev, email]
            );
            await kapcsolat.execute(
                'INSERT INTO fiok_diak (fiok_id, diak_id) VALUES (?, ?)',
                [eredmeny.insertId, diak.insertId]
            );
        } else {
            const [tanar] = await kapcsolat.execute(
                'INSERT INTO tanar (nev, email, ertekeles_id) VALUES (?, ?, NULL)',
                [teljesNev, email]
            );
            await kapcsolat.execute(
                'INSERT INTO fiok_tanar (fiok_id, tanar_id) VALUES (?, ?)',
                [eredmeny.insertId, tanar.insertId]
            );
        }
        await kapcsolat.commit();
        return res.status(201).json({ data: { id: eredmeny.insertId, nev: teljesNev, email } });
    } catch (hiba) {
        await kapcsolat.rollback();
        if (hiba.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ehhez az e-mail-címhez már tartozik fiók.' });
        }
        throw hiba;
    } finally {
        kapcsolat.release();
    }
});

auth.post('/bejelentkezes', async (req, res) => {
    const email = normalizaltEmail(req.body?.email);
    const jelszo = req.body?.jelszo;
    if (!ervenyesEmail(email) || typeof jelszo !== 'string' ||
        jelszo.length < 8 || jelszo.length > 128) {
        return res.status(401).json({ error: 'Hibás e-mail-cím vagy jelszó.' });
    }

    const [[fiok]] = await db.execute(
        'SELECT id, nev, email, jelszo_so, jelszo_lenyomat FROM fiok WHERE email = ?', [email]
    );
    const lenyomat = await jelszoLenyomat(jelszo, fiok?.jelszo_so ?? Buffer.alloc(16));
    if (!fiok || !timingSafeEqual(lenyomat, fiok.jelszo_lenyomat)) {
        return res.status(401).json({ error: 'Hibás e-mail-cím vagy jelszó.' });
    }

    const elozoToken = munkamenetToken(req);
    await db.execute('DELETE FROM munkamenet WHERE lejarat <= UTC_TIMESTAMP()');
    const token = randomBytes(32).toString('hex');
    await db.execute(
        'INSERT INTO munkamenet (token_lenyomat, fiok_id, lejarat) VALUES (?, ?, UTC_TIMESTAMP() + INTERVAL 24 HOUR)',
        [tokenLenyomat(token), fiok.id]
    );
    if (elozoToken) {
        await db.execute('DELETE FROM munkamenet WHERE token_lenyomat = ?', [tokenLenyomat(elozoToken)]);
    }
    res.cookie(cookieNev, token, { ...cookieBeallitasok, maxAge: munkamenetIdotartam });
    res.json({ data: { id: fiok.id, nev: fiok.nev, email: fiok.email } });
});

async function bejelentkezestIgenyel(req, res, next) {
    const token = munkamenetToken(req);
    if (token) {
        const [[fiok]] = await db.execute(
            `SELECT fiok.id, fiok.nev, fiok.email
             FROM munkamenet JOIN fiok ON fiok.id = munkamenet.fiok_id
             WHERE token_lenyomat = ? AND lejarat > UTC_TIMESTAMP()`,
            [tokenLenyomat(token)]
        );
        if (fiok) {
            req.fiok = fiok;
            return next();
        }
    }
    res.status(401).json({ error: 'A művelethez jelentkezz be.' });
}

auth.get('/profil', bejelentkezestIgenyel, (req, res) => {
    res.json({ data: req.fiok });
});

function datumHelyes(datum) {
    if (typeof datum !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(datum) || datum < '1000-01-01') return false;
    const parsed = new Date(datum + 'T00:00:00Z');
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === datum;
}

function idoszak(req, res, next) {
    const { tol, ig } = req.query;
    if ((tol !== undefined && !datumHelyes(tol)) ||
        (ig !== undefined && !datumHelyes(ig)) || (tol && ig && tol > ig)) {
        return res.status(400).json({ error: 'Hibás dátumtartomány. A dátumok formátuma ÉÉÉÉ-HH-NN.' });
    }
    req.idoszak = { tol: tol || '1000-01-01', ig: ig || '9999-12-31' };
    next();
}

auth.get('/szabad-idopontok', bejelentkezestIgenyel, idoszak, async (req, res) => {
    const [sorok] = await db.execute(
        `SELECT sz.id, sz.tanar_id, tanar.nev AS tanar_nev, sz.datum, sz.kezdete, sz.vege, sz.tipus
         FROM idopont sz JOIN tanar ON tanar.id = sz.tanar_id
         WHERE sz.diak_id IS NULL AND sz.datum BETWEEN ? AND ?
         ORDER BY sz.datum, sz.kezdete, sz.id`,
        [req.idoszak.tol, req.idoszak.ig]
    );
    res.json({ data: sorok });
});

auth.get('/sajat-idopontok', bejelentkezestIgenyel, idoszak, async (req, res) => {
    const [sorok] = await db.execute(
        `SELECT idopont.id, idopont.tanar_id, tanar.nev AS tanar_nev,
                idopont.datum, idopont.kezdete, idopont.vege, idopont.tipus
         FROM fiok_diak JOIN idopont ON idopont.diak_id = fiok_diak.diak_id
         JOIN tanar ON tanar.id = idopont.tanar_id
         WHERE fiok_diak.fiok_id = ? AND idopont.datum BETWEEN ? AND ?
         ORDER BY idopont.datum, idopont.kezdete, idopont.id`,
        [req.fiok.id, req.idoszak.tol, req.idoszak.ig]
    );
    res.json({ data: sorok });
});

auth.get('/havi-osszesites', bejelentkezestIgenyel, async (req, res) => {
    const honap = req.query.honap;
    if (typeof honap !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(honap) || honap < '1000-01') {
        return res.status(400).json({ error: 'Add meg a hónapot ÉÉÉÉ-HH formátumban.' });
    }
    const elsoNap = honap + '-01';
    const [[sor]] = await db.execute(
        `SELECT COUNT(*) AS orak_szama,
                COALESCE(SUM(TIME_TO_SEC(TIMEDIFF(idopont.vege, idopont.kezdete)) / 60), 0) AS percek
         FROM fiok_diak JOIN idopont ON idopont.diak_id = fiok_diak.diak_id
         WHERE fiok_diak.fiok_id = ? AND idopont.datum >= ?
           AND idopont.datum <= LAST_DAY(?)`,
        [req.fiok.id, elsoNap, elsoNap]
    );
    res.json({ data: { honap, orak_szama: sor.orak_szama, percek: Number(sor.percek), osszeg: null } });
});

auth.post('/kijelentkezes', async (req, res) => {
    const token = munkamenetToken(req);
    if (token) {
        await db.execute('DELETE FROM munkamenet WHERE token_lenyomat = ?', [tokenLenyomat(token)]);
    }
    res.clearCookie(cookieNev, cookieBeallitasok).status(204).end();
});

module.exports = auth;
