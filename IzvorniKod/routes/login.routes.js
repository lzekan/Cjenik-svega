const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	
	res.render('login', {
		linkActive: 'login',
		user: undefined
	});
});

module.exports = router;