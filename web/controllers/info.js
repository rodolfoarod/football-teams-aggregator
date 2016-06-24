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
    var select = "select distinct ?team ?labelEn"
	query.addSelect(select);
}

function appendSearchTriples(query) {
    query.addTriple("?team a dbo:SoccerClub .")
	query.appendTriple("?team rdfs:label ?labelEn .")
}

function appendSearchLangFilters(query) {
	query.appendWhereFilterAnd('LANG(?labelEn) = "en"')
}

function appendSearchFilters(query, name) {
	var allNames = name.split();
	var first = false;
	var filter = "("

	allNames.forEach(function (element) {
		if (!first) filter += " && ";
		first = true;
		filter += "CONTAINS( LCASE(?labelEn), '" + element.toLowerCase() + "' )"
	}, this);
	filter += ")";

	query.addWhereFilter(filter);
}

function createSearchResultObj(obj, entry) {
    if (entry.team) obj.iri = entry.team.value;
	if (entry.labelEn) obj.labelEn = entry.labelEn.value;
}
//
//
//routes
router.get("/", function (req, res) {
    res.render('./sparql/info')
})

router.get("/:team_name", function (req, res) {
	
	var query = new SparqlQuery()
	addPrefixes(query)
	addSearchSelectParams(query)
	appendSearchTriples(query)

	var queryStr = query.returnQuery()
	endpoint.selectQuery(queryStr, function (error, response) {
		var jsonAns = JSON.parse(response.body).results.bindings
		var jsAns = []

		jsonAns.forEach(function(entry) {
			var obj = new Object()
			createSearchResultObj(obj, entry)
			jsAns.push(obj)
		}, this);

		res.render("./sparql/info", { teams: jsAns })
	})

})

// router.get("/team/:iri", function (req, res){
//     console.log("not implemented")
// })

module.exports = router;