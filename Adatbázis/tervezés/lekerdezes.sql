SELECT * FROM diak;

SELECT nev FROM diak
ORDER BY nev DESC;

SELECT * FROM diak
WHERE nev='Kiss Miklós';

SELECT nev FROM diak
WHERE email LIKE '%g%';

SELECT COUNT(*) AS diakokszama FROM diak;


SELECT * FROM tanar;

SELECT DISTINCT nev FROM tanar
INNER JOIN idopont ON tanar.id=idopont.tanar_id
WHERE idopont.tipus='online';

SELECT nev FROM tanar
ORDER BY nev ASC;

SELECT COUNT(*) AS tanarokszama FROM tanar;

SELECT pontszam FROM tanar
JOIN ertekeles ON tanar.ertekeles_id=ertekeles.id
WHERE tanar.nev='Szabó János';


SELECT * FROM ertekeles;

SELECT * FROM ertekeles
WHERE pontszam=4 OR pontszam=5;

SELECT pontszam FROM ertekeles
ORDER BY pontszam DESC;

SELECT AVG(pontszam) AS atlagpont FROM ertekeles;

SELECT * FROM ertekeles
JOIN diak ON ertekeles.diak_id=diak.id
WHERE ertekeles.pontszam<5;


SELECT * FROM idopont
ORDER BY datum ASC;

SELECT * FROM idopont
WHERE tipus='online';

SELECT * FROM idopont
WHERE datum='2026-09-29'

SELECT COUNT(*) AS foglalasszam FROM idopont;

SELECT (idopont.datum,tanar.nev,diak.nev) FROM idopont
INNER JOIN diak ON idopont.diak_id=diak.id
INNER JOIN tanar ON idopont.tanar_id=tanar.id