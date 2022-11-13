const express = require('express');
const router = express.Router();

const User = require('../models/UserModel')
const UserDataAccess = require('../data_access/UserDataAccess')
const PasswordHasher = require('./helpers/PasswordHasher')

router.get('/', (req, res) => {
	
	res.render('login', {
		linkActive: 'login',
		user: undefined
	});
});


router.post('/', async (req, res) => {
	
	const nickname = req.body.nickname
	const password = req.body.password

	let user = await UserDataAccess.getByNickname(nickname)
	
	if(user == undefined){
		res.status(400).send('User witn nickname ' + nickname + ' does not exist');
	}

	let passwordValid = PasswordHasher.compare(password, user.password_hash);

	if(passwordValid){

		let expiryDate = new Date(Number(new Date()) + 604800000);  
        res.cookie('appuserID', req.body.email, { expires: expiryDate, httpOnly: true });

        req.session.user = user;
        res.redirect('/');

	} else {
		res.status(400).send('Password doesn\'t match the nickname');
	}
})

module.exports = router;