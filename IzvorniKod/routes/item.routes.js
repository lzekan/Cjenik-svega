const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
	
	res.render('item', {
		linkActive: 'home',
		user: req.session.user
	});
});

module.exports = router;