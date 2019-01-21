const passport = require('passport');
const User = require('../models/user');

const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

passport.use(
	'local.signup',
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		(req, email, password, done) => {
			req
				.checkBody('email', 'Invalid Email')
				.notEmpty()
				.isEmail();
			req
				.checkBody('password', 'Invalid password')
				.notEmpty()
				.isLength({ min: 4 });
			const errors = req.validationErrors();
			if (errors) {
				var messages = [];
				errors.forEach(function(error) {
					messages.push(error.msg);
                });
                return done(null, false, req.flash("error", messages))
			}
			User.findOne({ "email": email }, (err, user) => {
				if (err) {
					return done(err);
				}
				if (user) {
					return done(null, false, { message: 'email is already in use' });
				}
				let newUser = new User();
				newUser.email = email;
				newUser.password = newUser.encryptPassword(password);
				newUser.save((err, res) => {
					if (err) {
						return done(err);
					}
					return done(null, newUser);
				});
			});
		}
	)
);
