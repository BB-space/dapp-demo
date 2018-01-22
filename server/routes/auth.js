const Router	= require('koa-router'),
	  passport	= require('koa-passport'),
	  Web3		= require('web3'),
	  queries	= require('../db/queries/users');

const router = new Router();
const web3 = new Web3();

const BASE_URL = '/api/auth';



router.post(`${BASE_URL}/register`, async (ctx) => {
	const reqBody = ctx.request.body;
	const wallet = web3.eth.accounts.create();

	try {
		await queries.addUser(reqBody, wallet);
	} catch(err) {
		ctx.status = 409;
		ctx.body = { error: err };
		
		return false;
	}

	return passport.authenticate('local', (err, user, info, status) => {
		if (user) {
			ctx.login(user);
			ctx.redirect(`${BASE_URL}/status`);
		} else {
			ctx.status = 400;
			ctx.body = { status: 'error' };
		}
	})(ctx);
});

router.get(`${BASE_URL}/status`, async (ctx) => {
	if (ctx.isAuthenticated()) {
		const user = ctx.state.user;
		
		ctx.body = {
			success: true,
			user: {
				email: user.email,
				wallet: user.wallet
			}
		};
	} else {
		ctx.body = { status: 'not logged in' }
	}
});

router.post(`${BASE_URL}/login`, async (ctx) => {
	return passport.authenticate('local', (err, user, info, status) => {
		if (user) {
			ctx.login(user);
			ctx.redirect(`${BASE_URL}/status`);
		} else {
			ctx.status = 400;
			ctx.body = { status: 'error' };
		}
	})(ctx);
});

router.get(`${BASE_URL}/logout`, async (ctx) => {
	if (ctx.isAuthenticated()) {
		ctx.logout();
		ctx.redirect(`${BASE_URL}/status`);
	} else {
		ctx.body = { success: false };
		ctx.throw(401);
	}
});



module.exports = router;
