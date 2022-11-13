const express = require('express');
const router = express.Router();
const dbAcess = require('../data_access/UserDataAccess.js');

router.get('/', (req, res) => {
	
	res.render('login', {
		linkActive: 'login',
		user: undefined
	});
});


router.post('/', async (req, res) => {
	
	console.log(req.body);
	
	let user = await dbAcess.getByNickname(req.body.nickname);
	if (user)
	{
		req.session.user = user;
		
		res.render('home', {
			linkActive: 'home',
			user: user
		});
	}
	else
	{
		res.render('login', {
			linkActive: 'login',
			user: undefined
		});
	}
	
})

module.exports = router;