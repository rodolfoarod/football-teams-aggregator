var express = require('express')
var router = express.Router()

router.get('/', function(req, res){
    res.render('index')
})

router.post('/', function(req, res){
    res.render('index', {team: req.body.team})
})

module.exports = router
