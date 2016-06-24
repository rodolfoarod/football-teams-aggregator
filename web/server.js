var express = require('express')
var app = express()

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')

var port = process.env.PORT || 3000

app.set('views', __dirname + '/views')
app.engine('jade', require('jade').__express)
app.set('view engine', 'jade')

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieParser());
app.use(session({secret: '1234567890QWERTY'}))

app.use(require('./controllers'))

app.listen(port, function(){
    console.log('Listening on port' + port)
})
