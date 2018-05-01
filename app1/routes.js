

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('/attendance', function(req, res) {
		res.sendfile(path.join(__dirname + '/public/index.html'));
	});
	

};