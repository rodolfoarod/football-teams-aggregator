var express = require('express')
var dbConnect = require('../db/database.js')
var router = express.Router()

router.use('/team', require('./team'))
router.use('/home', require('./home'))

router.get('/', function(req, res){

  res.render('login_page')

})

router.post('/', function(req, res){

  //console.log(req.body.email);
  //console.log(req.body.password);
  
	dbConnect.getUser(req.body.email, req.body.password, function(user) {
		if(user != null) {
			req.session.isAuthenticated = true;
			req.session.userId = user.id;

			res.redirect('/home/');
		}
		else {
			req.session.isAuthenticated = false;
			req.session.userId = -1;
			res.redirect('/');
		}
	});
})

module.exports = router
