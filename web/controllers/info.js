var express = require('express')
var router = express.Router()

//router.use('/info', require('./info'))
var dbConnect = require('../db/database.js');
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
	query.appendPrefix("PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>");
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
	var select = "select distinct ?label ?homepage ?chairman ?fullname ?founded ?league ?ground ?city"
	+ " ?groundLbl ?chairmanLbl ?leagueLbl"
	query.addSelect(select);
}
function appendTeamTriples(query, iri) {
	var rdfIri = "<" + iri + ">";
	query.addTriple(rdfIri + " rdfs:label ?label .")
	query.appendTriple("OPTIONAL{" + rdfIri + " foaf:homepage ?homepage } ")
	query.appendTriple("OPTIONAL{" + rdfIri + " dbp:chairman ?chairman ."
+ "?chairman rdfs:label ?chairmanLbl . FILTER( LANG(?chairmanLbl) = 'en' || LANG(?chairmanLbl) = 'pt' ) } ")
	query.appendTriple("OPTIONAL{" + rdfIri + " dbp:fullname ?fullname } ")
	query.appendTriple("OPTIONAL{" + rdfIri + " dbp:founded ?founded . FILTER(xsd:date(?founded))} ")
	query.appendTriple("OPTIONAL{" + rdfIri + " dbp:league ?league ."
 + " ?league rdfs:label ?leagueLbl . FILTER( LANG(?leagueLbl) = 'en' || LANG(?leagueLbl) = 'pt' ) } ")
	query.appendTriple("OPTIONAL{" + rdfIri + " dbp:ground ?ground ."
		+ "?ground rdfs:label ?groundLbl . FILTER( LANG(?groundLbl) = 'en' || LANG(?groundLbl) = 'pt' ) } ")
	query.appendTriple("OPTIONAL{" + rdfIri + " dbo:city ?city } ")
}
function appendTeamLangFilters(query) {

}
function appendTeamFilters(query) {

}
function createTeamObject(obj, entry) {
	if (entry.label) obj.label = entry.label.value;
	if (entry.homepage) obj.homepage = entry.homepage.value;
	if (entry.chairman) obj.chairman = entry.chairman.value;
	if (entry.fullname) obj.fullname = entry.fullname.value;
	if (entry.founded) obj.founded = entry.founded.value;
	if (entry.league) obj.league = entry.league.value;
	if (entry.ground) obj.ground = entry.ground.value;
	if (entry.city) obj.city = entry.city.value;
	if (entry.groundLbl) obj.groundLbl = entry.groundLbl.value;
	if (entry.chairmanLbl) obj.chairmanLbl = entry.chairmanLbl.value;
	if (entry.leagueLbl) obj.leagueLbl = entry.leagueLbl.value;
}
function titlesWonSelectParams(query) {
	query.addSelect("SELECT DISTINCT ?title ?label");
}
function titlesWonTriples(query, iri) {
	var rdfIri = "<" + iri + ">";
	query.appendTriple("?title a dbo:FootballLeagueSeason .")
	query.appendTriple("?title dbp:winners " + rdfIri + " .")
	query.appendTriple("OPTIONAL{ ?title rdfs:label ?label . FILTER ("
		+ " LANG(?label) = 'en' || LANG(?label) = 'pt' ) }")
	//query.appendTriple("OPTIONAL{" + rdfIri + " dbp:leagueWinners ?title } ")
}
function addTitleToObj(obj, entry) {
	if (entry.title) obj.iri = entry.title.value
	if (entry.label) obj.label = entry.label.value
}
//
//
//routes
router.get("/", function (req, res) {
    
	dbConnect.getTeamsOfUser(req.session.userId, "titles", function(teams) {
		teams.forEach(function (entry) {
			entry.team_id = encodeURIComponent(entry.team_id)
		}, this)
		res.render('./sparql/info', { search_type: "titles", favTeams: teams, infoTag: "infoTag" });
	});
})

router.get("/search", function (req, res) {

	var query = new SparqlQuery()
	addPrefixes(query)
	addSearchSelectParams(query)
	appendSearchTriples(query)
	appendSearchLangFilters(query)

	if (!req.query.team || req.query.team == "") {
		res.render('./sparql/info', { search_type: "titles" })
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

		res.render("./sparql/info", { teams: jsAns, search_type: "titles" })
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
			var queryTitles = new SparqlQuery()
			addPrefixes(queryTitles);
			titlesWonSelectParams(queryTitles)
			titlesWonTriples(queryTitles, req.params.iri)
			
			//console.log("Info: " + req.params.iri + " - " + obj.label);
			dbConnect.addTeam(req.session.userId, -1, req.params.iri, obj.label);

			var queryTitlesStr = queryTitles.returnQuery();
			endpoint.selectQuery(queryTitlesStr, function (error, responseTitles) {
				obj.titles = [];
				var jsonTitleAns = JSON.parse(responseTitles.body).results.bindings
				jsonTitleAns.forEach(function (entry) {
					var title = new Object()
					addTitleToObj(title, entry)
					obj.titles.push(title)
				}, this);
				res.render("./sparql/team", { team: obj })
			})
		}
	})


	//res.render("./sparql/info")
})

module.exports = router;