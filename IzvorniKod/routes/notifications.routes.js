const express = require('express');
const NotificationDataAccess = require('../data_access/NotificationDataAccess')
const PriceChangeRequestDataAccess = require('../data_access/PriceChangeRequestDataAccess')
const router = express.Router();

router.get('/', async (req, res) => {
	if(req.session.user == undefined){
		res.redirect('/login')
	}

	let notifications = await NotificationDataAccess.getNotificationsForUser(req.session.user.id);
	let priceChangeRequests = undefined;
	if(req.session.user.access_level == 2){
		priceChangeRequests = await PriceChangeRequestDataAccess.getPendingPriceChangeRequests();
	}
	
	res.render('notifications', {
		user: req.session.user,
		linkActive: 'notifications',
		notifications: notifications,
		priceChangeRequests: priceChangeRequests
	});
});

module.exports = router;