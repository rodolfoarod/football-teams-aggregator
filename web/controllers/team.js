var express = require('express')
var router = express.Router()

var dbConnect = require('../db/database.js')

router.get('/:teamId/:teamName', function(req, res){

  if(!req.session.isAuthenticated) {
    res.redirect('/')
  }

  // Store Favorite Team
  dbConnect.addTeam(req.session.userId, req.params.teamId, -1, req.params.teamName);

  var spawn = require('child_process').spawn
  var py = spawn('python', ['../scraping_team.py'])
  var data = [req.params.teamId]
  var dataString = ''

  py.stdout.on('data', function(data){
    //dataString = JSON.parse(data)
	dataString += data.toString()
  })

  py.stdout.on('end', function(){
	dataString = JSON.parse(dataString)
    res.render('team', {
      teamId: req.params.teamId,
      teamName: req.params.teamName,
      results: dataString
    })
  })

  py.stdin.write(JSON.stringify(data))
  py.stdin.end()

})

module.exports = router
