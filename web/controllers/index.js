var express = require('express')
var router = express.Router()

router.get('/', function(req, res){
  res.render('index')
})

router.post('/', function(req, res){

  var spawn = require('child_process').spawn,
  py    = spawn('python', ['../scraping_search.py']),
  data = [req.body.team],
  dataString = '';

  /*
  Here we are saying that every time our node application receives data
  from the python process output stream(on 'data'),
  we want to convert that received data into a string
  and append it to the overall dataString.
  */
  py.stdout.on('data', function(data){
    //dataString = data.toString();
    dataString = JSON.parse(data)
  });

  /*
  Once the stream is done (on 'end')
  we want to simply log the received data to the console.
  */
  py.stdout.on('end', function(){
    res.render('index', {team: req.body.team, results: dataString})
  });

  /*
  We have to stringify the data first
  otherwise our python process wont recognize it
  */
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();


})

module.exports = router
