const express = require('express');
const router = express.Router();
const TrgovinaDataAccess = require('../data_access/TrgovinaDataAccess')

router.get('/',async (req, res) => {
    
    //ako nije registriran redirectaj na login
	if(req.session.user == undefined){
        res.redirect('/login')
    }

    //ako je korisnik ili admin
    if(req.session.user.access_level == 0 || req.session.user.access_level == 2){
        res.render('userprofil', {
            linkActive: 'user',
            user: req.session.user
        });
    }

    //ako je trgovina
    if(req.session.user.access_level == 1){
        console.log("USER (trgovina) = " +JSON.stringify(req.session.user))
        let trgovina = await TrgovinaDataAccess.getTrgovina(req.session.user.id)
        res.render('trgovinaprofil', {
            linkActive: 'user',
            user: req.session.user,
            trgovina: trgovina
        });
    }
	
});

router.get('/:id', async (req, res) => {
	
    if(req.session.user == undefined){
        //ako nije registriran redirectaj na login
        res.redirect('/login')
    }

    if(req.session.user.access_level !== 2 ){
        //ako nije admin nema pristup tudem profilu
        return res.status(403).send('403 forbidden');
    }

	return res.status(200).send('Profil korisnika s id = ' + req.params.id);

});

module.exports = router;