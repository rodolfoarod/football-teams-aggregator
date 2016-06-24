var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000
//var info = require('./controllers/info')

app.set('views', __dirname + '/views')
app.engine('jade', require('jade').__express)
app.set('view engine', 'jade')

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(require('./controllers'))
//app.use('/info', info)

app.listen(port, function(){
    console.log('Listening on port' + port)
})
