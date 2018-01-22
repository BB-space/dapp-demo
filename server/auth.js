const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;

const knex = require('./db/connection');

const options = {
	usernameField: 'email',
    passwordField: 'password'
};

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	console.log(id);
	return knex('users')
		.where({ id }).first()
		.then((user) => {
			done(null, user);
		})
		.catch((err) => {
			done(err, null);
		});
});

passport.use(new LocalStrategy(options, (email, password, done) => {
	knex('users')
		.where({ email }).first()
		.then((user) => {
			if (!user) return done(null, false);
			if (password === user.password) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		})
		.catch((err) => {
			return done(err);
		});
}));

