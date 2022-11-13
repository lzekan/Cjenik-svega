const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	
	res.render('login', {
		linkActive: 'login',
		user: undefined
	});
});


router.post('/', (req, res) => {
	
	console.log(req.body);
	res.send('Got http POST login request');

})

module.exports = router;