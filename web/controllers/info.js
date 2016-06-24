var express = require('express')
var router = express.Router()

//router.use('/info', require('./info'))
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();


//Sparql config
var SparqlQuery = require('../lib/SparqlQuery');
var request = require('request');
var SparqlHttp = require('sparql-http-client');
// use the request module for all requests
SparqlHttp.request = SparqlHttp.requestModuleRequest(request);
var endpoint = new SparqlHttp({ endpointUrl: 'http://dbpedia.org/sparql' })

addPrefixes = function (query) {
	query.addPrefix('PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>');
	query.appendPrefix('PREFIX dbo: <http://dbpedia.org/ontology/>');
	query.appendPrefix('PREFIX dbp: <http://dbpedia.org/property/>');
	query.appendPrefix('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>');
}

function addSearchSelectParams(query) {
    
}

function appendSearchTriples(query) {
    
}

function appendSearchLangFilters(query) {

}

function createSearchResultObj(obj, entry) {
    
}

//
//
//routes
router.get("/",function (req, res) {
    res.render('layout')
} )

// router.get("/search/:team_name",function (req, res) {
//     console.log("not implemented")
// } )

// router.get("/team/:iri", function (req, res){
//     console.log("not implemented")
// })

module.exports = router;