"use strict";

var sqlite3 = require('sqlite3').verbose();
var db;

module.exports = {
	getTeamsOfUser: function(iduser, searchType, callback) {
		if(searchType !== "results" && searchType !== "titles") {
			console.log("Invalid search type!");
			callback(null);
			return;
		}
		
		createDb();
		
		console.log("Retriving user " + iduser + " favorite teams for " + searchType + "...");

		db.all("SELECT * from user_team where iduser='" + iduser + "'", function(err,teamIds) {
			var nbrOfTeams = teamIds.length;
			var i = 0;
			var j = 0;
			if(teamIds.length) {
				var resultTeam = new Array();
				var sql;
				teamIds.forEach(function (teamId) {
					if(searchType === "results") {
						sql = "SELECT * from team where id='" + teamId.idteam + "' AND idzzero IS NOT NULL";
					}
					else if(searchType === "titles") {
						sql = "SELECT * from team where id='" + teamId.idteam + "' AND iddbpedia IS NOT NULL";
					}
					db.all(sql, function(err,teams) {
						if(teams.length) {
							teams.forEach(function (team) {
								var jsonData = {};
								if(searchType === "results") {
									jsonData['team_id'] = team.idzzero;
								}
								else if(searchType === "titles") {
									jsonData['team_id'] = team.iddbpedia;
								}
								jsonData['team_name'] = team.teamname;
								resultTeam.push(jsonData);
								i++; j++;
								if(i == nbrOfTeams) {
									console.log("User " + iduser + " have " + j + " favorite teams for " + searchType + ".");
									callback(resultTeam);
									closeDb();
								}
							});
						}
						else {
							i++;
							if(i == nbrOfTeams) {
								console.log("User " + iduser + " have " + j + " favorite teams for " + searchType + ".");
								callback(resultTeam);
								closeDb();
							}
						}
					});
				});
			}
			else {
				console.log("User " + iduser + " don't have favorite teams.");
				callback(null);
				closeDb();
			}
		});
	},
	
	getUser: function (username, password, callback) {
		createDb();
		console.log("Searching user: " + username + "...");

		db.all("SELECT * from user where username='" + username + "'", function(err,rows) {
			if(rows.length) {
				console.log("User " + username + " exist.");
				rows.forEach(function (row) {
					if(row.password == password) {
						console.log("User " + username + " gave good password -> Login.");
						callback(row);
					}
					else {
						console.log("User " + username + " gave wrong password!");
						callback(null);
					}
					closeDb();
				});
			}
			else {
				console.log("User " + username + " don't exist!");
				callback(null);
				closeDb();
			}
		});
	},


	addTeam: function(user_id, idzzero, iddbpedia, team_name) {

		createDb();

		getTeamId(idzzero, iddbpedia, function(err, row){

			if(err) {

				console.log("addTeam - " + err);

			} else {

				if(typeof row != 'undefined') {

					console.log("Adding only new relation...");

					insertTeamRel(user_id, row.id);

				} else {

					console.log("Adding new team and new relation...");

					insertTeam(user_id, idzzero, iddbpedia, team_name);

				}

			}

		});

		closeDb();

	}

};


function createDb(callback) {
	db = new sqlite3.Database('fta.db', callback);
	console.log("DB opened...");
}

function insertTeam(user_id, idzzero, iddbpedia, teamname) {
	console.log("Insert team " + teamname + "...");

	var sql;
	if(idzzero !== -1) {
		sql = "INSERT INTO team(idzzero, teamname) VALUES ($id, $teamname)";
	} else if(iddbpedia !== -1) {
		sql = "INSERT INTO team(iddbpedia, teamname) VALUES ($id, $teamname)"
	}

	var stmt = db.prepare(sql);

	if(idzzero !== -1) {
		stmt.run({ $id: idzzero, $teamname: teamname});
	} else if(iddbpedia !== -1) {
		stmt.run({ $id: iddbpedia, $teamname: teamname});
	}

	stmt.finalize(function(){
		getTeamId(idzzero, iddbpedia, function(row){
			insertTeamRel(user_id, row.id);
		});
	});

}

function getTeamId(idzzero, iddbpedia, callback) {

	console.log("Getting team id...");

	var sql;
	if(idzzero !== -1) {
		sql = "SELECT * FROM team WHERE idzzero=" + idzzero;
	} else if(iddbpedia !== -1){
		sql = "SELECT * FROM team WHERE iddbpedia=" + iddbpedia;
	} else {
		console.log("getTeamId - Wrong ID");
		return;
	}

	db.get(sql, function(err, row){
		callback(row);
	});

}

function insertTeamRel(user_id, team_id) {
	console.log("Insert team relation...");
	var stmt = db.prepare("INSERT INTO user_team(iduser, idteam) VALUES ($iduser, $idteam)");
	stmt.run({ $iduser: user_id, $idteam: team_id });
	stmt.finalize();
}

function closeDb() {
	db.close();
	console.log("DB closed.");
}
