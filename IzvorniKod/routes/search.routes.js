const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/:term', async (req, res) => {
	
	let sql = 'SELECT "Proizvod"."Naziv" AS naziv, "Proizvod"."Barkod" AS barkod, "Trgovina"."Naziv" AS trgovina, "Cijena" cijena FROM "Proizvod" ' + 
		'NATURAL JOIN "ProizvodTrgovina" NATURAL JOIN "Oznake" LEFT JOIN "Trgovina" ' +
		'ON "ProizvodTrgovina"."TrgovinaID" = "Trgovina"."ID"' +
		'WHERE "Proizvod"."Naziv" = $1::text OR "Oznaka" = $1::text';
	let sql_parameters = [req.params.term];

	let products = await db.query(sql, sql_parameters);

	res.render('prices', {
		linkActive: 'home',
		user: req.session.user,
		proizvodi: products.rows
	})


	// res.render('prices', {
	// 	linkActive: 'prices',
	// 	user: req.session.user
	// });

});

module.exports = router;