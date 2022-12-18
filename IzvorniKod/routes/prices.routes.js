const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	
	res.render('prices', {
		linkActive: 'prices',
		user: req.session.user
	});
});

module.exports = router;