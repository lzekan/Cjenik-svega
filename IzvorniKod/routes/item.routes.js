const express = require('express');
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
	
	res.render('item', {
		linkActive: 'item',
		user: req.session.user,
		item: item
	});


});

module.exports = router;