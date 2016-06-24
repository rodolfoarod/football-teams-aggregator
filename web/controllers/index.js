var express = require('express')
var router = express.Router()

router.use('/team', require('./team'))
router.use('/home', require('./home'))

router.get('/', function(req, res){

  res.render('login_page')

})

router.post('/', function(req, res){

  //console.log(req.body.email);
  //console.log(req.body.password);

  req.session.isAuthenticated = true
  req.session.userId = 1

  res.redirect('/home/')

})

module.exports = router
