const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const data = require('../data');

// Product.collection.insert(data);

//Home page
router.get('/', (req, res, next) => {
	const successMsg = req.flash('success')[0];
	Product.find((err, docs) => {
		let productChunks = [];
		let chunkSize = 3;
		for (let i = 0; i < docs.length; i += chunkSize) {
			productChunks.push(docs.slice(i, i + chunkSize));
		}
		res.render('shop/index', {
			title: 'shopping cart',
			products: productChunks,
			successMsg: successMsg,
			noMessages: !successMsg
		});
	});
});

//cart page
router.get('/add-to-cart/:id', (req, res, next) => {
	const productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});
	Product.findById(productId, function(err, product) {
		if (err) {
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect('/');
	});
});

router.get('/reduce/:id', (req, res, next) => {
	const productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.reduceByOne(productId);
	req.session.cart = cart;

	res.redirect('/shopping-cart');
});

router.get('/remove/:id', (req, res, next) => {
	const productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.removeItem(productId);
	req.session.cart = cart;

	res.redirect('/shopping-cart');
});

router.get('/shopping-cart', (req, res, next) => {
	if (!req.session.cart) {
		return res.render('shop/shopping-cart', { products: null });
	}
	let cart = new Cart(req.session.cart);
	res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totlaPrice });
});

router.get('/checkout', isLoggedIn, (req, res, next) => {
	if (!req.session.cart) {
		return res.render('/shopping-cart');
	}
	let cart = new Cart(req.session.cart);
	var errorMsg = req.flash('error')[0];
	res.render('shop/checkout', { total: cart.totlaPrice, errorMsg: errorMsg, noError: !errorMsg });
});

router.post('/checkout', isLoggedIn, (req, res, next) => {
	if (!req.session.cart) {
		return res.redirect('/shopping-cart');
	}
	var cart = new Cart(req.session.cart);

	var stripe = require('stripe')('sk_test_QeAPmWWf8eMAt3qE2x6tBjoU');
	stripe.charges.create(
		{
			amount: cart.totlaPrice * 100,
			currency: 'usd',
			source: req.body.stripeToken, // obtained with Stripe.js
			description: 'Test Charge'
		},
		function(err, charge) {
			if (err) {
				req.flash('error', err.message);
				return res.redirect('/checkout');
			}
			var order = new Order({
				user: req.user,
				cart: cart,
				address: req.body.address,
				name: req.body.name,
				paymentId: charge.id
			});
			order.save(function(err, result) {
				req.flash('success', 'Successfully bought product!');
				req.session.cart = null;
				res.redirect('/');
			});
		}
	);
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.session.oldUrl = req.url;
	res.redirect('/user/signin');
}

module.exports = router;
