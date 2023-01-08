const express = require('express');
const db = require('../db/index.js');
const Item = require('../models/ItemModel.js');
const router = express.Router();

router.get('/:barcode', async (req, res) => {
	
	let barcode = req.params.barcode
	let item = new Item();
	await item.loadItem(barcode);
	
	if (item == undefined)
	{
		res.status(404).send('Item not found');
		return;
	}

	let sql = 'SELECT "Oznaka" AS oznaka FROM "Oznake" WHERE "Barkod" = $1::text AND "KorisnikID" = $2::int';
	let sql_parameters = [barcode, req.session.user.id];

	let userTags = await db.query(sql, sql_parameters);
	let leftTags = 5 - userTags.rows.length;
	
	res.render('item', {
		linkActive: 'item',
		user: req.session.user,
		item: item,
		barcode: barcode,
		userTags: userTags.rows,
		leftTags: leftTags
	});


});

router.post('/:barcode', async (req, res) => {

	let barcode = req.params.barcode;
	
	try{
		let sql = 'INSERT INTO "Oznake" VALUES ($1::text, $2::int, $3::text)';
		let sql_parameters = [barcode, req.session.user.id, req.body.tag];
	
		await db.query(sql, sql_parameters);
	} catch(e) {
		console.log("already inside");
	}


	let item = new Item();
	await item.loadItem(barcode);

	sql = 'SELECT "Oznaka" AS oznaka FROM "Oznake" WHERE "Barkod" = $1::text AND "KorisnikID" = $2::int';
	sql_parameters = [barcode, req.session.user.id];

	let userTags = await db.query(sql, sql_parameters);
	let leftTags = 5 - userTags.rows.length;

	res.render('item', {
		linkActive: 'item',
		user: req.session.user,
		item: item,
		barcode: barcode,
		userTags: userTags.rows,
		leftTags: leftTags
	});
})

router.get('/', (req, res) => {
	res.redirect('/');
})

module.exports = router;