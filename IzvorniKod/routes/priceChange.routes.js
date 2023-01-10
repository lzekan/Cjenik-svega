const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

router.post('/',
    body('status').notEmpty(),
    body('request_id').notEmpty(),
    async (req, res) => {

	    const errors = validationResult(req);
    	if (!errors.isEmpty()) {
      		return res.status(400).json({ errors: errors.array() });
    	}

        if(req.session.user == undefined || req.session.user.access_level !== 2){
            return res.status(403).send("Samo admini mogu --")
        }

        return res.status(200).send('Zahtjev ' + req.body.request_id + ' primljen')

        
    })

module.exports = router;