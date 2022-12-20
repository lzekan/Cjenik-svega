const express = require('express');
const router = express.Router();
const TrgovinaDataAccess = require('../data_access/TrgovinaDataAccess')
const UserDataAccess = require('../data_access/UserDataAccess')
const upload = require('express-fileupload')
var fs = require('fs');
const { stringify } = require('querystring');
const Trgovina = require('../models/TrgovinaModel');
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
        let trgovina = await TrgovinaDataAccess.getTrgovina(req.session.user.id)
        res.render('trgovinaprofil', {
            linkActive: 'user',
            user: req.session.user,
            trgovina: trgovina 
        });
    }
	
});

router.post('/upload', async(req,res) => {
    if(!req.files) console.log("undefined")
    var data = req.files.fileName
    var str = data.data.toString('utf8')
    var count = 0;
    const map = new Map();
    let key,value;
    let prethodni = 0;
    for(let i = 0; i < str.length;i++){
        if(str.charAt(i) == "\""){
            i++;
            key = "";
            while(i < str.length && str.charAt(i) != '\"'){
                key +=str.charAt(i++);
            }
            prethodni = i+2;
            count=1;
            i++;
        }else if(str.charAt(i) == ' '|| str.charAt(i) == '\n'){
            if(count == 0){
                key = str.substring(prethodni,i);
                count++;
                prethodni = i+1;
            }else{
                value = str.substring(prethodni,i);
                count = 0;
                prethodni = i+1;
                map.set(key,value);
            }
        }
    }
    console.log(req.session.user.id)
    map.forEach((v,k) => {
        if(TrgovinaDataAccess.checkIfItemExists(k)){
            if(TrgovinaDataAccess.checkIfItemExistsInShop(k)){
                TrgovinaDataAccess.changePriceInShop(v,k,req.session.user.id);
            }
        }
    })
    res.redirect('/');
});


router.get('/:id', async (req, res) => {
	
	if (req.params.id.charAt(0) == 'b')
	{
		return res.redirect('/item/' + req.params.id);
	}
	
    if(req.session.user == undefined){
        //ako nije registriran redirectaj na login
        res.redirect('/login')
    }

    if(req.session.user.access_level !== 2 ){
        //ako nije admin nema pristup tudem profilu
        return res.status(403).send('403 forbidden');
    }

    let user = undefined;
    try {
        user = await UserDataAccess.getById(req.params.id);
        console.log(JSON.stringify(req.session.user))
        if(user.id == req.session.user.id){
            res.redirect('/profile')
            return;
        }
    } catch (error) {
        return res.status(404).send('Not found');
    }
    
    if(user !== undefined){
        let trgovina = undefined;

        if(user.access_level == 1){
            trgovina = await TrgovinaDataAccess.getTrgovina(user.id)
        }
        
        res.render('displayProfileForAdmin', {
            linkActive: 'user',
            user: req.session.user,
            displayUser: user,
            displayTrgovina: trgovina
        });

        //return res.status(200).send('Profil korisnika s id = ' + req.params.id + ' postoji');
    } else {
        return res.status(404).send('Not found');
    }
    

});

module.exports = router;