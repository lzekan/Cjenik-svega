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

		console.log("REQUEST = "+ JSON.stringify(req.body));
	
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

		if(pristup == 1 && (req.body.naziv_trgovine == undefined || req.body.naziv_trgovine == "") ){
			return res.status(400).send('Unesite naziv trgovine');
		}

		let user = new User(req.body.nickname,req.body.first_name, req.body.last_name, req.body.email, '', pristup,{}, false);
		if(await UserDataAccess.wouldBeUnique(user)){
			user.password_hash = PasswordHasher.hash(req.body.password);
			try {
				let adddedUserId = await UserDataAccess.addNewUser(user);
				user.id = adddedUserId
				console.log("Dodan korisnik: " + JSON.stringify(user))
			} catch (error) {
				console.log(error)
				throw error
			}
			let korisnik = await UserDataAccess.getByNickname(user.nickname);
			let userId = korisnik.id;
			if(pristup == 1 && userId != undefined){
				if(await TrgovinaDataAccess.isUniqueID(userId)){
					console.log(userId)
					let trgovina = new Trgovina(userId, req.body.naziv_trgovine);
					try{
						await TrgovinaDataAccess.addNewTrgovina(trgovina);
						console.log("Korisnik dodan kao trgovina.")
					}catch(err){	
						console.log(err); 
						throw err
					}
					try{
						if (req.body.kod1.charAt(0) != 'b')
							req.body.kod1 = 'b' + req.body.kod1;
						if (req.body.kod2.charAt(0) != 'b')
							req.body.kod2 = 'b' + req.body.kod2;
						if (req.body.kod3 charAt(0) != 'b')
							req.body.kod3 = 'b' + req.body.kod3;
						await TrgovinaDataAccess.putItemsInStore(userId, req.body.kod1, req.body.ime1, req.body.cijena1);
						await TrgovinaDataAccess.putItemsInStore(userId, req.body.kod2, req.body.ime2, req.body.cijena2);
						await TrgovinaDataAccess.putItemsInStore(userId, req.body.kod3, req.body.ime3, req.body.cijena3);
						console.log("Ubaceni proizvodi u ducan")
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