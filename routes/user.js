const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

const Order = require('../models/order');
const Cart = require('../models/cart');

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, (req, res, next) => {
	Order.find({ user: req.user }, function(err, orders) {
		if (err) {
			return res.write('Error!');
		}
		var cart;
		orders.forEach(function(order) {
			cart = new Cart(order.cart);
			order.items = cart.generateArray();
		});
		res.render('user/profile', { orders: orders });
	});
});
router.get('/logout', isLoggedIn, (req, res, next) => {
	req.logOut();
	res.redirect('/');
});

router.use('/', notLoggedIn, (req, resn, next) => {
	next();
});

router.get('/signup', (req, res, next) => {
	const messages = req.flash('error');
	res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post(
	'/signup',
	passport.authenticate('local.signup', {
		failureRedirect: '/user/signup',
		failureFlash: true
	}),
	(req, res, next) => {
		if (req.session.oldUrl) {
			let oldUrl = req.session.oldUrl;
			req.session.oldUrl = null;
			res.redirect(oldUrl);
		} else {
			res.redirect('/user/profile');
		}
	}
);

router.get('/signin', (req, res, next) => {
	const messages = req.flash('error');
	res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post(
	'/signin',
	passport.authenticate('local-signin', {
		failureRedirect: '/user/signin',
		failureFlash: true
	}),
	(req, res, next) => {
		if (req.session.oldUrl) {
			let oldUrl = req.session.oldUrl;
			req.session.oldUrl = null;
			res.redirect(oldUrl);
		} else {
			res.redirect('/user/profile');
		}
	}
);

module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

function notLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}
