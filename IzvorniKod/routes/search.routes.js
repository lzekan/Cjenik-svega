const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/:term', async (req, res) => {
	
	let sql = 'SELECT "Proizvod"."Naziv" AS naziv, "Proizvod"."Barkod" AS barkod, "Trgovina"."Naziv" AS trgovina, "Cijena" cijena FROM "ProizvodTrgovina" ' + 
		'NATURAL JOIN "Proizvod" LEFT JOIN "Oznake" USING("Barkod") LEFT JOIN "Trgovina" ' +
		'ON "ProizvodTrgovina"."TrgovinaID" = "Trgovina"."ID" ' +
		'WHERE LOWER("Proizvod"."Naziv") = LOWER($1::text) OR LOWER("Oznaka") = LOWER($1::text)';

	let sql_parameters = [req.params.term];

	let products = await db.query(sql, sql_parameters);

	sql = 'SELECT "Naziv" AS naziv, "ID" AS id FROM "Trgovina" WHERE LOWER("Naziv") = LOWER($1::text)';
	let trgovine = await db.query(sql, sql_parameters);


	res.render('prices', {
		linkActive: 'home',
		user: req.session.user,
		proizvodi: products.rows,
		trgovine: trgovine.rows
	})

});

module.exports = router;