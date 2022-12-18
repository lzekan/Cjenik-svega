const express = require('express');
const Item = require('../models/ItemModel.js');
const router = express.Router();

router.get('/:barcode', async (req, res) => {
	
	let barcode = req.params.barcode
	let item = new Item();
	item = await item.getItem(barcode);
	
	if (item == undefined)
	{
		res.status(404).send('Item not found');
		return;
	}
	
	console.log(item);
	
	res.render('item', {
		linkActive: 'home',
		user: req.session.user,
		name: item.name,
		stores: item.stores,
		tags: item.tags
	});
});

module.exports = router;