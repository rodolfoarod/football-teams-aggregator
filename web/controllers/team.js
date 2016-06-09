var express = require('express')
var router = express.Router()

router.get('/:teamId/:teamName', function(req, res){

  var spawn = require('child_process').spawn
  var py = spawn('python', ['../scraping_team.py'])
  var data = [req.params.teamId]
  var dataString = ''

  py.stdout.on('data', function(data){
    dataString = JSON.parse(data)
  })

  py.stdout.on('end', function(){
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
