const Product = require('../models/product');

const mongoose = require('mongoose');

// mongoose
// 	.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true })
// 	.then(() => console.log('mongodb connected....'))
// 	.catch(err => console.log(err));

const products = [
	new Product({
		imagePath: 'https://images-na.ssl-images-amazon.com/images/I/913fgwuOl9L._AC_SR201,266_.jpg',
		title: 'I Love You Funny Bunny',
		description:
			'Illustrated by Sean Julian, I Love You, Funny Bunny is a padded cover board book perfect for sharing at bedtime or any time of day. With read-aloud rhymes and adorable illustrations!!!',
		price: 8.98
	}),
	new Product({
		imagePath: 'https://images-na.ssl-images-amazon.com/images/I/71PIxYNrxdL._AC_SR201,266_.jpg',
		title: 'You are My Magical Unicorn',
		description: "Sparkle and dazzle wherever you go. You're more amazing than you know!!!!",
		price: 6.99
	}),
	new Product({
		imagePath: 'https://images-na.ssl-images-amazon.com/images/I/71JCmxPE6yL._AC_SR201,266_.jpg',
		title: 'Egg',
		description:
			'Caldecott Medalist Kevin Henkes’s Egg tells an unforgettable story about four eggs, one big surprise, and an unlikely friendship.!!!',
		price: 7.99
	}),
	new Product({
		imagePath: 'https://images-na.ssl-images-amazon.com/images/I/511VxqDOU0L._AC_SR201,266_.jpg',
		title: 'Baby Touch and Feel: Animals ',
		description:
			'A small touch and feel book full of cuddly bunnies and other soft animals, this is a gift your little one is sure to adore!!!',
		price: 8.98
	}),
	new Product({
		imagePath: 'https://images-na.ssl-images-amazon.com/images/I/51%2BmV1XUUQL._AC_SR201,266_.jpg',
		title: 'GoodNight Moon',
		description:
			"In this classic of children's literature, beloved by generations of readers and listeners, the quiet poetry of the words and the gentle, lulling illustrations combine to make a perfect book for the end of the day!!!",
		price: 9.79
	}),
	new Product({
		imagePath: 'https://images-na.ssl-images-amazon.com/images/I/81TGQ1cTcrL._AC_SR201,266_.jpg',
		title: 'The Very Hungry Caterpillar ',
		description:
			"The very hungry caterpillar literally eats his way through the pages of the book—and right into your child's heart...",
		price: 7.89
	})
];

let done = 0;

for (let i = 0; i < products.length; i++) {
	products[i].save(function(err, res) {
		done++;
		if (done === products.length) {
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
}
