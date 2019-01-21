const express = require('express');
const router = express.Router();

const csrf = require('csurf');
const csrfProtection = csrf();
const passport = require('passport');
const Product = require('../models/product');
const data = require('../data');

router.use(csrfProtection);
// Product.collection.insert(data);

router.get('/', (req, res, next) => {
	Product.find((err, docs) => {
		let productChunks = [];
		let chunkSize = 3;
		for (let i = 0; i < docs.length; i += chunkSize) {
			productChunks.push(docs.slice(i, i + chunkSize));
		}
		res.render('shop/index', { title: 'shopping cart', products: productChunks });
	});
});

router.get('/user/signup', (req, res, next) => {
	const messages = req.flash('error');
	res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post(
	'/user/signup',
	passport.authenticate('local.signup', {
		successRedirect: '/user/profile',
		failureRedirect: '/user/signup',
		failureFlash: true
	})
);

router.get('/user/profile', (req, res, next) => {
	res.render('user/profile');
});
module.exports = router;
