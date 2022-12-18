const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const User = require('../models/UserModel')
const Trgovina = require('../models/TrgovinaModel')
const UserDataAccess = require('../data_access/UserDataAccess')
const TrgovinaDataAccess = require('../data_access/TrgovinaDataAccess')
const PasswordHasher = require('./helpers/PasswordHasher')

router.get('/', (req, res) => {
	
	res.render('signup', {
		linkActive: 'signup',
		user: req.session.user
	});
});

router.post('/',
	body('nickname').notEmpty().isLength({min: 4, max: 20}),
	body('first_name').notEmpty().isLength({min: 2, max: 20}),
	body('last_name').notEmpty().isLength({min: 2, max: 20}),
	body('email').notEmpty().isEmail(),
	body('password').notEmpty().isLength({min: 8, max: 20}),
	body('password').not().isIn(['password', '12345678']).withMessage('Pick more secure password.'),
	body('chktrg').notEmpty().isIn(['Admin','Korisnik','Trgovina']).withMessage('Select valid user type.'),

	async (req, res) => {

		if(req.session.user !== undefined){
			return res.status(400).send('You have to logout first');
		}
	
		const errors = validationResult(req);
    	if (!errors.isEmpty()) {
      		return res.status(400).json({ errors: errors.array() });
    	}
		var pristup = 0;
		if(req.body.chktrg == 'Admin'){
			pristup  = 2;
		}else if(req.body.chktrg == 'Trgovina'){
			pristup = 1;
		}
		let user = new User(req.body.nickname,req.body.first_name, req.body.last_name, req.body.email, '', pristup);
		if(await UserDataAccess.wouldBeUnique(user)){
			user.password_hash = PasswordHasher.hash(req.body.password);
			try {
				UserDataAccess.addNewUser(user);
			} catch (error) {
				console.log(error)
				throw error
			}
			let korisnik = await UserDataAccess.getByNickname(user.nickname);
			let userId = korisnik.id;
			if(pristup == 1 && userId != undefined){
				if(await TrgovinaDataAccess.isUniqueID(userId)){
					console.log(userId)
					let trgovina = new Trgovina(userId, req.body.nickname);
					try{
					TrgovinaDataAccess.addNewTrgovina(trgovina);
					}catch(err){
						console.log(err); 
						throw err
					}
				}
			}
			req.session.user = user;
			res.redirect('/')

		} else {
			return res.status(400).send('User with the same nickname or email already exists.');
		}
	}
)

module.exports = router;