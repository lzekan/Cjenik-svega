const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const NotificationDataAccess = require('../data_access/NotificationDataAccess')
const PriceChangeRequestDataAccess = require('../data_access/PriceChangeRequestDataAccess')
const TrgovinaDataAccess = require('../data_access/TrgovinaDataAccess')

router.post('/',
    body('status').notEmpty(),
    body('request_id').notEmpty(),
    async (req, res) => {

	    const errors = validationResult(req);
    	if (!errors.isEmpty()) {
      		return res.status(400).json({ errors: errors.array() });
    	}

        if(req.session.user == undefined || req.session.user.access_level !== 2){
            return res.status(403).send("Samo admini mogu odobriti zahtjev za promjenu cijene")
        }

        let request = await PriceChangeRequestDataAccess.getById(req.body.request_id)

        if(req.body.status == 'accepted'){
            //odobri zahtjev
            await PriceChangeRequestDataAccess.acceptPriceChangeRequest(req.body.request_id)

            //promijeni cijenu u ProizvodTrgovina
            TrgovinaDataAccess.changePriceInShop(request.new_price, request.product_barcode ,request.store_id)

            //napravi obavijest
            let text = 'Na zahtjev korisnika ' + request.user_nickname + 
                ' cijena proizvoda ' + request.product_barcode + 
                ' iz trgovine ' + request.store_name +
                ' je promijenjena u ' + request.new_price + '.';
            let notificationId = await NotificationDataAccess.addNotification(text);

            //pošalji obavijest trgovini i korisniku
            await NotificationDataAccess.notifyUser(request.user_id, notificationId)
            await NotificationDataAccess.notifyUser(request.store_id, notificationId)

            return res.redirect('/notifications')
        } else {
            if(req.body.status == 'reject'){
                //odbij zahtjev
                await PriceChangeRequestDataAccess.rejectPriceChangeRequest(req.body.request_id);
    
                return res.redirect('/notifications')
            } else {
                return res.status(400).send('Status mora biti accepted ili reject')
            }
        }
        
    })

module.exports = router;