const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	
	res.render('signup', {
		linkActive: 'signup',
		user: undefined
	});
});

router.post('/', (req, res) => {
	
	console.log(req.body);
	res.send('Got http POST register request');

})

module.exports = router;