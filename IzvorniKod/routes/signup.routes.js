const express = require('express');
const router = express.Router();
const User = require('../models/UserModel.js');

router.get('/', (req, res) => {
	
	res.render('signup', {
		linkActive: 'signup',
		user: undefined
	});
});

router.post('/', async (req, res) => {
	
	console.log(req.body);

	let user = new User(
		req.body.nickname,
		req.body.first_name,
		req.body.last_name,
		req.body.email,
		req.body.password,
		req.body.chktrg
	);
	
	if (await user.addToDatabase())
	{
		req.session.user = user;
		
		res.render('home', {
			linkActive: 'home',
			user: user
		});
	}
	else
	{
		res.render('signup', {
			linkActive: 'signup',
			user: undefined
		});
	}
	
})

module.exports = router;