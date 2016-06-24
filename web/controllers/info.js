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
//
//
//general search
function addSearchSelectParams(query) {
    var select = "select distinct ?team ?labelEn"
	query.addSelect(select);
}
function appendSearchTriples(query) {
    query.addTriple("?team a dbo:SoccerClub .")
	query.appendTriple("?team rdfs:label ?labelEn .")
}
function appendSearchLangFilters(query) {
	query.appendWhereFilterAnd('( LANG(?labelEn) = "en" || LANG(?labelEn) = "pt" )')
}
function appendSearchFilters(query, name) {
	var allNames = name.split(" ");
	var first = true;
	var filter = "("

	allNames.forEach(function (element) {
		if (!first) filter += " && ";
		first = false;
		filter += "CONTAINS( LCASE(?labelEn), '" + element.toLowerCase() + "' )"
	}, this);
	filter += ")";

	query.appendWhereFilterAnd(filter);
}
function createSearchResultObj(obj, entry) {
    if (entry.team) obj.iri = encodeURIComponent(entry.team.value);
	if (entry.labelEn) obj.labelEn = entry.labelEn.value;
}
//
//
//team specific details
function addTeamSelectParams(query) {
	var select = "select distinct ?homepage ?chairman ?fullname ?founded ?league ?ground ?city"
	query.addSelect(select);
}
function appendTeamTriples(query, iri) {
	var rdfIri = "<" + iri + ">";
	query.addTriple(rdfIri + " rdfs:label ?label .")
	query.appendTriple("OPTIONAL{" + rdfIri + " foaf:homepage ?homepage } ")
	query.appendTriple("OPTIONAL{" + rdfIri + " dbp:chairman ?chairman } ")
	query.appendTriple("OPTIONAL{" + rdfIri + " dbp:fullname ?fullname } ")
	query.appendTriple("OPTIONAL{" + rdfIri + " dbp:founded ?founded } ")
	query.appendTriple("OPTIONAL{" + rdfIri + " dbp:league ?league } ")
	query.appendTriple("OPTIONAL{" + rdfIri + " dbp:ground ?ground } ")
	query.appendTriple("OPTIONAL{" + rdfIri + " dbo:city ?city } ")
}
function appendTeamLangFilters(query) {

}
function appendTeamFilters(query) {

}
function createTeamObject(obj, entry) {
	if (entry.label) obj.label = entry.label.value;
	if (entry.chairman) obj.chairman = entry.chairman.value;
	if (entry.fullname) obj.fullname = entry.fullname.value;
	if (entry.founded) obj.founded = entry.founded.value;
	if (entry.league) obj.league = entry.league.value;
	if (entry.ground) obj.ground = entry.ground.value;
	if (entry.city) obj.city = entry.city.value;
}

//
//
//routes
router.get("/", function (req, res) {
    res.render('./sparql/info')
})

router.get("/search", function (req, res) {

	var query = new SparqlQuery()
	addPrefixes(query)
	addSearchSelectParams(query)
	appendSearchTriples(query)
	appendSearchLangFilters(query)

	if (!req.query.team || req.query.team == "") {
		res.render('./sparql/info')
		return;
	}
	appendSearchFilters(query, req.query.team);

	var queryStr = query.returnQuery()
	endpoint.selectQuery(queryStr, function (error, response) {
		var jsonAns = JSON.parse(response.body).results.bindings
		var jsAns = []

		jsonAns.forEach(function (entry) {
			var obj = new Object()
			createSearchResultObj(obj, entry)
			jsAns.push(obj)
		}, this);

		res.render("./sparql/info", { teams: jsAns })
	})

})

router.get("/team/:iri", function (req, res) {
	var query = new SparqlQuery()
	addPrefixes(query)
	addTeamSelectParams(query)
	appendTeamTriples(query, req.params.iri)

	var queryStr = query.returnQuery()
	endpoint.selectQuery(queryStr, function (error, response) {
		var jsonAns = JSON.parse(response.body).results.bindings

		if (jsonAns.length > 0) {
			var obj = new Object()
			createTeamObject(obj, jsonAns[0])
			res.render("./sparql/team", { team: obj })
		}
	})


	//res.render("./sparql/info")
})

module.exports = router;