var AuthHandler = require(process.cwd() + '/app/controllers/auth.js'), authHandler = new AuthHandler(),
    PollHandler = require(process.cwd() + '/app/controllers/poll.js'), pollHandler = new PollHandler(),
    passport    = require('passport');

module.exports = function (app) {
    
    // pages that require an authenticated user redirect to /login
    function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
    }

    // homepage
    app.get('/', pollHandler.list);

    // signup
    app.route('/signup')
        .get(authHandler.signup)
        .post(authHandler.addUser);
    
    // login
    app.route('/login')
		.get(authHandler.signin)
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));

    // logout
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
    });

    // change password
    app.route('/settings')
        .get(isLoggedIn, authHandler.settings)
        .post(isLoggedIn, authHandler.settingsSubmit);

    // login via github
	app.route('/auth/github')
	   .get(passport.authenticate('github'));

    app.route('/auth/github/callback')
       .get(passport.authenticate('github', {
			    successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true
            }
        ));

    // Create a new poll
    app.route('/new/poll')
       .get(isLoggedIn, pollHandler.create)
       .post(isLoggedIn, pollHandler.createSubmit);

    // Delete
    app.post('/delete/poll', isLoggedIn, pollHandler.delete);

    // View votes
    app.route(/^\/poll\/([a-z0-9]+)\/results/)
       .get(pollHandler.view);

    // Vote
    app.route(/^\/poll\/([a-z0-9]+)/)
       .get(pollHandler.vote)
       .post(pollHandler.voteSubmit);

    // View polls
    app.get('/mypolls', isLoggedIn, pollHandler.listUser);
};