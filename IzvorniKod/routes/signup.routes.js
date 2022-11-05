const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	
	res.render('signup', {
		linkActive: 'signup',
		user: undefined
	});
});

module.exports = router;